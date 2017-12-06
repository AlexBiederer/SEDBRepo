import initDataTable from './dataTable';
import IDtoBundesland from './IDtoBundesland';
import bundeslandToID from './bundeslandToID';

export default function() {
  let selectedWK;
  let dataTable;

  $('#bundeslandMap').vectorMap({
    map: 'de_merc',
    onRegionClick: function(event, region) {
      // init data table
      let bundeslandID = bundeslandToID[region.split('-')[1]];
      if(!dataTable) dataTable = initDataTable("wkTable");
      dataTable.columns( 1 )
        .search( bundeslandID )
        .draw();
    },
    regionsSelectable: true,
    regionsSelectableOne: true,
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
      });
    });
}
