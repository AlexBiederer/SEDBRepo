import initDataTable from './dataTable';
import IDtoBundesland from './IDtoBundesland';
import bundeslandToID from './bundeslandToID';
import parteiToAbk from './parteiToAbk';
import Wahlkreis from './wahlkreis';

class Bundesland {

  constructor(router) {
    this.router = router;
    this.initVectorMap();
    this.fillTable();
    this.wahlkreis = new Wahlkreis();
  }
  // init germany jVector map
  initVectorMap() {
    let bundeslandID;
    this.map = $('#bundeslandMap').vectorMap({
      map: 'de_merc',
      onRegionClick: function(event, region) {
        // init data table
        var newID = bundeslandToID[region.split('-')[1]];

        if (bundeslandID != newID) {
          bundeslandID = newID;
          $('#bundeslandMap').vectorMap("get", "mapObject").clearSelectedRegions();
          $('#bundeslandMap').vectorMap("get", "mapObject").setSelectedRegions(region);

          this.dataTable.columns(2)
            .search(bundeslandID)
            .draw();
        } else {
          bundeslandID = null;
          $('#bundeslandMap').vectorMap("get", "mapObject").clearSelectedRegions();
          this.dataTable.columns(2)
            .search("")
            .draw();
        }
      }.bind(this),
      regionsSelectable: false,
      regionsSelectableOne: false,
      regionStyle: {
        initial: {
          fill: '#81AC8B'
        },
        selected: {
          fill: '#425957'
        }
      },
      backgroundColor: "#fff",
      labels: {
        regions: {
          render: function(code) {
            return code.split('-')[1];
          },
          offsets: function(code) {
            return {
              'BB': [0, 50],
              'HB': [0, 30]
            }[code.split('-')[1]];
          }
        }
      },
      regionLabelStyle: {
        initial: {
          fill: '#000'
        },
        selected: {
          fill: '#fff'
        }
      },
    });
  }

  // fill data table
  fillTable() {
    $.getJSON("db/wahlkreis17", data => {
      data.forEach(val => {
        $("#wkTableBody").append(
          `
      <tr>
      <td>${val.id}</td>
      <td>${val.name}</td>
      <td>${val.bundesland}</td>
      <td>${IDtoBundesland[val.bundesland]}</td>
      </tr>
    `
        );
      })
      this.dataTable = initDataTable("wkTable", {
        "order": [
          [0, "asc"]
        ],
        "columnDefs": [{
          "targets": [0, 2],
          "visible": false
        }]
      });
      this.initTableClick();
    });

  }
  initTableClick() {
    const that = this;
    let dataTable = this.dataTable;
    $('#wkTableBody').on('click', 'tr', function() {
      const data = dataTable.row(this).data();
      const wkID = data[0];
      that.updateBarChart(wkID);
    });
  }

  updateBarChart(wkID) {
    const that = this;
    $.getJSON(`db/customquery/q3?param=${wkID}`, data => {
      $.getJSON(`db/customquery/wkDetails?param=${wkID}`, data2 => {
        $.getJSON(`db/customquery/kandidatDetails?param=${data[0].direktkandidat}`, data3 => {
          $.getJSON(`db/customquery/q4?param=${wkID}`, data4 => {
            $("#wkDetails").html(`
              <tr>
              <td>${data3[0].titel ? data3[0].titel : ''} ${data3[0].vorname} ${data3[0].name}
                <b>(${parteiToAbk[data3[0].parteiname]})</b></td>
              <td>${parteiToAbk[data4[0].siegererstname]}</td>
              <td>${parteiToAbk[data4[0].siegerzweitname]}</td>
              <td>${data2[0].numwahlb}</td>
              <td>${data2[0].numgueltigeerst}</td>
              <td>${data2[0].numgueltigezweit}</td>
              <td>${data2[0].numungueltigeerst}</td>
              <td>${data2[0].numungueltigezweit}</td>
              </tr>
          `);
            $("#wahlkreis #wkHeader").html(`Wahlkreis ${wkID} - ${data[0].wkname}`);
            const barChart = that.wahlkreis.getBarChart(data, data2, that.router);
            if (barChart) barChart.update(data, data2);
            $('.navbar-nav a[href="#wahlkreis"]').parent('li').removeClass('disabled');
            that.router.navigate(`/wahlkreis`);
          });
        });
      });
    });
  }
}
export default Bundesland;
