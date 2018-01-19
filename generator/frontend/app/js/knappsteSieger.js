import initDataTable from './dataTable';

class KnappstSieger {
  constructor() {
    if(!this.dataTableKnappste) this.dataTableKnappste = initDataTable("knappsteTable");
    this.initSelector();
  }

  initSelector() {
    const that = this;
    $.getJSON("/db/query/parteienOrderedByID", data => {
      let tmpBody = "";
      data.forEach(party => {
        tmpBody += `
        <option value=${party.id}>${party.name}</option>
      `;
    });

      $("#partySelect").append(tmpBody);
      $('#partySelect').selectpicker('refresh');
      $("#partySelect").on("changed.bs.select", function()  {
        const val = $(this).val()
        $.getJSON(`/db/customQuery/q6?param=${val}`, data => {
        let tmparray = [];
        data.forEach(val => {
          tmparray.push($(
            `
        <tr>
        <td>${val.parteiname}</td>
        <td>${val.wahlkreisname}</td>
        <td>${val.diffstimmen}</td>
        </tr>
      `
          )[0]);
        });
          that.dataTableKnappste.clear().draw();
          that.dataTableKnappste.rows.add(tmparray).draw();
        //  that.dataTableKnappste.columns.adjust().draw()
        });
      })
    });
  }
}
export default KnappstSieger;
