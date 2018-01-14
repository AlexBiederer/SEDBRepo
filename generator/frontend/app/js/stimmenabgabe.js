import parteiToAbk from "./parteiToAbk";

class Stimmenabgabe {
  constructor() {
    $("#datum").html(`am ${this.formatDate(new Date())}`);
    this.initBtns();
    this.renderWahlzettel();
  }
  //   $("#submitStimme").on("click", _ => {
  //   this.renderWahlzettel();
  // }

  initBtns() {
    // erstimme ungueltig machen
    $("#erstUngueltig").on("click", _ => {
      $('input[name=optionsRadios1]').prop('checked', false);
    });
    // zweitstimme ungueltig machen
    $("#zweitUngueltig").on("click", _ => {
      $('input[name=optionsRadios2]').prop('checked', false);
    });
    // ungültig bestätigen
    $("#warningStimmenAbgabe").on("click", "#submit", _ => {
      // @TODO ungültig abschicken
    });
    // stimme abgegeben
    $("#submitStimme").on("click", _ => {
      const erstStimme = $('input[name=optionsRadios1]:checked', "#erstStimme").val();
      const zweitStimme = $('input[name=optionsRadios2]:checked', "#zweitStimme").val();
      const warningBody = this.genWarningBody(erstStimme, zweitStimme);
      $("#warningStimmenAbgabe .modal-body").html(warningBody);

      if (erstStimme && zweitStimme) { // beide stimmen gültig
        //    $.getJSON(`db/customquery/insertVoteSecure?param=228,${erstStimme}`, data => {console.log(data)});
        $("#modalStimmeAbgegeben").modal("show");

      } else { // mind. eine Stimme ungültig
          $("#warningStimmenAbgabe").modal("show");
      }
    });
  }

  vote(erstStimme, zweitStimme) {
    $.getJSON(`db/customquery/insertVoteSecure?param=228,${erstStimme}`, data => {console.log(data)});
  }

  genWarningBody(erstStimme, zweitStimme) {
    let warningText = "";
    if (!erstStimme && !zweitStimme) {
      warningText = "Sie habe eine <b>ungültige Erststimme und eine ungültige Zweitstimme</b> abgegeben.<br>";
    } else if (!erstStimme) {
      warningText = "Sie habe eine <b>ungültige Erststimme</b> abgegeben.<br>";
    } else if (!zweitStimme) {
      warningText = "Sie habe eine <b>ungültige Zweitstimme</b> abgegeben.<br>";
    }
    warningText += "Sind Sie sich wirklich sicher?";
    return warningText;
  }

  renderWahlzettel() {
    $.getJSON("db/customquery/erstKandidaten?param=228", data => {
      data.forEach((v, k) =>  {
        $("#erstStimme").append(`<div class="radio">
    <label>
      <input type="radio" name="optionsRadios1" value="${v.pid}">
    ${v.titel ? v.titel : ''} ${v.vorname}, ${v.name} <b>(${v.partei})</b></label>
  </div>`)
      });
    });

    $.getJSON("/db/customquery/zweitParteien?param=228", data => {
      console.log(data);
      data.forEach((v, k) =>  {
        $("#zweitStimme").append(`<div class="radio">
    <label>
      <input type="radio" name="optionsRadios2" value="${v.pid}">
    <b>${v.pname}</b></label>
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
