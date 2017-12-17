import parteiToAbk from "./parteiToAbk";

class Stimmenabgabe {
  constructor() {
    $("#datum").html(`am ${this.formatDate(new Date())}`);
    $('#sozNrModal').on('click', '#submit', function(e) {
      console.log($('#sozNrInput').val());
      $("#sozNrModal").modal("hide");
    });
    $("#submitStimme").on("click", _ => {
      const erstStimme = $('input[name=optionsRadios1]:checked', "#erstStimme").val();
      const zweitStimme = $('input[name=optionsRadios2]:checked', "#zweitStimme").val();
      if (erstStimme && zweitStimme) {
        $.getJSON(`db/customquery/insertErst?param=228,${erstStimme}`, data => {console.log(data)});
        $.getJSON(`db/customquery/insertZweit?param=228,${zweitStimme}`, data => {console.log(data)});
      }

    });
    this.renderWahlzettel();
  }

  renderWahlzettel() {
    $.getJSON("db/customquery/erstKandidaten?param=228", data => {
      console.log(data);
      data.forEach((v, k) =>  {
        $("#erstStimme").append(`<div class="radio">
    <label>
      <input type="radio" name="optionsRadios1" value="${v.pid}">
    ${v.titel ? v.titel : ''} ${v.vorname}, ${v.name} (${v.partei})</label>
  </div>`)
      });
    });

    $.getJSON("/db/customquery/zweitParteien?param=228", data => {
      console.log(data);
      data.forEach((v, k) =>  {
        $("#zweitStimme").append(`<div class="radio">
    <label>
      <input type="radio" name="optionsRadios2" value="${v.pid}">
    ${v.pname}</label>
    <div style="padding-left:20px;">${v.k1name}, ${v.k1vorname}; ${v.k2name}, ${v.k2vorname}; ${v.k3name}, ${v.k3vorname}</div>
  </div>`)
      });
    });


  }

  formatDate(date) {
    var monthNames = [
      "Januar", "Februar", "März",
      "April", "Mai", "Juni", "Juli",
      "August", "September", "Oktober",
      "Novemebr", "Dezember"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return day + ' ' + monthNames[monthIndex] + ' ' + year;
  }

}
export default Stimmenabgabe;
