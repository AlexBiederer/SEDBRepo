/**
 * Sonstiges tab (SQL-Zusatzaufgaben)
 */
import parteiToAbk from './parteiToAbk';
import initDataTable from './dataTable';

class Sonstiges {
  constructor() {
    if (!this.dataTableZusatz1) this.dataTableZusatz1 = initDataTable("zusatz1Table",{
      "order": [
        [0, "asc"]
      ],
      "columnDefs": [{
        "targets": [0],
        "visible": false
      }]
    });
    this.additionalTasks();
  }

  additionalTasks() {
    const that = this;
    $.getJSON("/db/query/zusatzgrp1", data1 => {
      $.getJSON("/db/query/zusatzgrp2", data2 => {
        $.getJSON("/db/query/zusatzgrp5", data5 => {
          $("#zusatz2").html(`<b>${data2[0].bonus}</b>`);
          $("#zusatz5").html(`<b>${data5[0].name} (${parteiToAbk[data5[0].parteiname]}) im WK: ${data5[0].wkname} mit ${data5[0].percent}% der Stimmen</b>`);
          let tmparray = [];
          data1.forEach(val => {
            tmparray.push($(
              `
          <tr>
          <td>${val.partei}</td>
          <td>${val.parteiname}</td>
          <td>${val.wkmaxname}</td>
          <td>${val.dismax}</td>
          <td>${val.wkminname}</td>
          <td>${val.dismin}</td>
          </tr>
        `
            )[0]);
          });
          that.dataTableZusatz1.clear().draw();
          that.dataTableZusatz1.rows.add(tmparray).draw();
          //  that.dataTableKnappste.columns.adjust().draw()
        });
      });
    });
  }
}
export default Sonstiges;
