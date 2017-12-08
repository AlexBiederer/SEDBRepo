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
      if (!dataTable) dataTable = initDataTable("wkTable");
      dataTable.columns(2)
        .search(bundeslandID)
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
      <th>ID</th>
      <th>Name</th>
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
      <td>${val.numwahlb}</td>
      <td>${val.numgueltigeerst}</td>
      <td>${val.numgueltigezweit}</td>
      <td>${val.numungueltigeerst}</td>
      <td>${val.numungueltigezweit}</td>
      </tr>
    `
      );
    });
  });
}
