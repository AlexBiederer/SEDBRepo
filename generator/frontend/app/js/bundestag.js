import PieChart from './pieChart';
import initDataTable from './dataTable';
import IDtoBundesland from './IDtoBundesland';

class Bundestag {
  constructor() {
    // create pie chart
    new PieChart('#pieRoot', {
      value: 'sitze',
      durationInit: 200,
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
      if (checked) {
        $.getJSON("db/query/bundestagsmitglieder17_update", _ => {
          this.dataTable.clear().draw();
          this.fillTable();
        });
      } else {
        this.dataTable.clear().draw();
        this.fillTable();
      }
    }.bind(this));
  }

  // init tables
  fillTableInit() {
    $.getJSON("db/mview/bundestagsmitglieder17", data => {
      $.getJSON("db/query/q5", data2 => {
        // fill Mitglieder table
        this.fillTable();
        // fill Überhangmandate Tables
        let tmparray = [];
        data2.forEach(val => {
          if (val.nummandate > 0) { // only show parties/states with überhangmandaten
            tmparray.push($(
              `
          <tr>
          <td>${val.parteiname}</td>
          <td>${IDtoBundesland[val.bundesland]}</td>
          <td>${val.nummandate}</td>
          </tr>
        `
            )[0]);
          }
        });
        // init data table mitglieder
        if (!this.dataTable) {
          this.dataTable = initDataTable("membersTable", {
            "order": [
              [2, "asc"]
            ]
          });
        }
        // init data table überhangmandate
        if (!this.dataTableUeberhang) {
          this.dataTableUeberhang = initDataTable("ueberhangTable");
          this.dataTableUeberhang.rows.add(tmparray).draw();
        //  this.dataTableUeberhang.columns.adjust().draw()
        }
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
      this.dataTable.rows.add(tmparray).draw();
    //  this.dataTable.columns.adjust().draw()
      $("#loader").hide();
      $("#switch").show();
    });
  }
}

export default Bundestag;
