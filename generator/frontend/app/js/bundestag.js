import PieChart from './pieChart';
import initDataTable from './dataTable';

class Bundestag {
  constructor() {
    // create pie chart
    new PieChart('#pieRoot', 'db/bundesland', {
      value: 'sitze',
      durationInit: 0,
      durationMouse: 100
    });
    this.initSwitch();
    this.fillTableInit();
  }
  // init navbar switch for bundestag
  initSwitch() {

    let checked = $("#cb1:checked").length;
    $("#cb1").change(function() {
      $("#switch").hide();
      $("#loader").show();

      this.dataTable
        .clear()
        .draw();
      checked = $("#cb1:checked").length;
      console.log(checked);
      if (checked) {
        console.log("checked");
        $.getJSON("db/query/bundestagsmitglieder17_update");
      }
      debugger;
      this.dataTable.clear().draw();

      this.fillTable();
    }.bind(this));
  }

  // fill table Mitglieder
  fillTableInit() {
    console.log("fillTable");
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
        <td>${val.name}</td>
        <td>${val.geschlecht}</td>
        <td>${val.gebjahr}</td>
        <td>${val.pname}</td>
        </tr>
      `
        );
      });

      // init data table
      if (!this.dataTable)
        this.dataTable = initDataTable("membersTable", {
          "order": [
            [2, "asc"]
          ]
        });
    });
  }

  // fill table Mitglieder
  fillTable() {
    $.getJSON("db/mview/bundestagsmitglieder17", data => {
      let tmparray = [];
      data.forEach(val => {
        tmparray.push($(
          `
        <tr>
        <td>${val.titel || ''}</td>
        <td>${val.vorname}</td>
        <td>${val.name}</td>
        <td>${val.geschlecht}</td>
        <td>${val.gebjahr}</td>
        <td>${val.pname}</td>
        </tr>
      `
        )[0]);

      });
      console.log("fillTable2");

      this.dataTable.rows.add(tmparray).draw();
      this.dataTable.columns.adjust().draw()
      $("#loader").hide();
      $("#switch").show();
    });
  }
}

export default Bundestag;
