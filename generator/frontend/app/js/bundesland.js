import initDataTable from './dataTable';
import IDtoBundesland from './IDtoBundesland';
import bundeslandToID from './bundeslandToID';

export default function() {
  let bundeslandID;
  let dataTable;

  let map = $('#bundeslandMap').vectorMap({
    map: 'de_merc',
    onRegionClick: function(event, region) {
      // init data table
        var newID = bundeslandToID[region.split('-')[1]];

      if (bundeslandID != newID) {
          bundeslandID = newID;

          $('#bundeslandMap').vectorMap("get", "mapObject").setSelectedRegions(region);

          dataTable.columns(1)
              .search(bundeslandID)
              .draw();
      }
      else {
        bundeslandID = null;
          $('#bundeslandMap').vectorMap("get", "mapObject").clearSelectedRegions();
        dataTable.columns(1)
            .search("")
            .draw();
      }


    },
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

  $.getJSON("db/wahlkreis17", data => {
      $("#wkTable").append(`
    <thead>
    <tr>
      <th>Name</th>
      <th>Bundesland</th>
      <th>Wahlberechtigte</th>
    </tr>
    </thead>
    <tbody id="wkTableBody">
    </tbody>
  `);
      data.forEach(val => {
        $("#wkTableBody").append(
          `
      <tr>

      <td>${val.name}</td>
      <td>${val.bundesland}</td>
      <td>${val.numwahlb}</td>
      </tr>
    `
        );
      })
      dataTable = initDataTable("wkTable");
    });
}
