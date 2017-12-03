import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

//
// import * as dataTable from './table1';
// import * as dataTable2 from './table2';
// require('datatables.net');
import * as dataTable from 'datatables.net-bs';
// require('datatables.net-buttons');
// require('datatables.net-buttons-bs');
import '../scss/styles.scss'; // Main style sheet for all chart types
import PieChart from './pieChart';
import * as d3 from 'd3';

$(function() {
  let p = new PieChart('#pieRoot', 'db/bundesland', {
    value: 'sitze',
    durationInit: 0,
    durationMouse: 100
  });

  // fill table Mitglieder
  d3.json("db/mview/bundestagsmitglieder17", data => {
    data.forEach(val => {
      d3.select("#membersTableBody").append("tr").html(
        `
        <td>${val.titel || ''}</td>
        <td>${val.vorname}</td>
        <td>${val.nachname}</td>
        <td>${val.geschlecht}</td>
        <td>${val.gebjahr}</td>
        <td>${val.abk}</td>
      `
      );
    });
      $('#membersTable').DataTable({"order": [[ 2, "asc" ]]});
  });
  // init search input
  $("#sucheMitglieder").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#membersTable tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
  $("body").show();
});
