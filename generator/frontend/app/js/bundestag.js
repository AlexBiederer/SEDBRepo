import PieChart from './pieChart';
import initDataTable from './dataTable';

export default function() {
  // create pie chart
  new PieChart('#pieRoot', 'db/bundesland', {
    value: 'sitze',
    durationInit: 0,
    durationMouse: 100
  });

  // fill table Mitglieder
  $.getJSON("db/mview/bundestagsmitglieder17", data => {
    $("#membersTable").append(`
      <thead>
      <tr>
        <th>Titel</th>
        <th>Vorname</th>
        <th>Nachname</th>
        <th>Geschlecht</th>
        <th>Gebjahr</th>
        <th>Partei</th>
      </tr>
      </thead>
      <tbody id="membersTableBody">
      </tbody>
    `);
    data.forEach(val => {
      $("#membersTableBody").append(
        `
        <tr>
        <td>${val.titel || ''}</td>
        <td>${val.vorname}</td>
        <td>${val.nachname}</td>
        <td>${val.geschlecht}</td>
        <td>${val.gebjahr}</td>
        <td>${val.abk}</td>
        </tr>
      `
      );
    });
    // init data table
    initDataTable("membersTable");
  });
}
