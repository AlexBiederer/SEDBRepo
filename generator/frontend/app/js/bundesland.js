import initDataTable from './dataTable';
import IDtoBundesland from './IDtoBundesland';
import bundeslandToID from './bundeslandToID';

class Bundesland {

  constructor() {
    this.initVectorMap();
    this.fillTable();
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
          $("#wkTable").append(`
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>BundeslandID</th>
            <th>Bundesland</th>
            <th>Wahlberechtigte</th>
            <th>Gültige Erststimmen</th>
            <th>Gültige Zweitstimmen</th>
            <th>Ungültige Erststimmen</th>
           <th>Ungültige Zweitstimmen</th>
          </tr>
        </thead>
        <tbody id="wkTableBody">
        </tbody>
      `);
      data.forEach(val => {
        $("#wkTableBody").append(
          `
      <tr>
      <td>${val.id}</td>
      <td>${val.name}</td>
      <td>${val.bundesland}</td>
      <td>${IDtoBundesland[val.bundesland]}</td>
      <td>${val.numwahlb}</td>
      <td>${val.numgueltigeerst}</td>
      <td>${val.numgueltigezweit}</td>
      <td>${val.numungueltigeerst}</td>
      <td>${val.numungueltigezweit}</td>
      </tr>
    `
        );
      })
      this.dataTable = initDataTable("wkTable", {
        "order": [
          [0, "asc"]
        ],
        "columnDefs": [{
          "targets": [0,2],
          "visible": false
        }]
      });
      this.initTableClick();
    });

  }
  initTableClick(){
    let dataTable = this.dataTable;
    $('#wkTableBody').on('click', 'tr', function () {

        var data = dataTable.row( this ).data();
        alert( 'You clicked on '+data[0]+'\'s row' );
    } );
  }

}
export default Bundesland;
