import PieChart from './pieChart';
import initDataTable from './dataTable';

export default function() {

    let dataTable;
    // create pie chart
    new PieChart('#pieRoot', 'db/bundesland', {
        value: 'sitze',
        durationInit: 0,
        durationMouse: 100
    });

    var checked = $("#cb1:checked").length;

    $("#cb1:checked").change(function () {
        dataTable
            .clear()
            .draw();
        checked = $("#cb1:checked").length;
        console.log(checked);
        if(checked)
            $.getJSON("db/query/bundestagsmitglieder17_update");

        dataTable
            .clear()
            .draw();
        fillTable2();
    });

    fillTable();

    // fill table Mitglieder
    function fillTable() {
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
            if (!dataTable)
                dataTable = initDataTable("membersTable");
        });
    }

    // fill table Mitglieder
    function fillTable2() {
        $.getJSON("db/mview/bundestagsmitglieder17", data => {
            let tmparray = [];
            data.forEach (val => {
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

            dataTable.rows.add(tmparray);
        });
    }
}
