import parteiToAbk from "./parteiToAbk";

class Stimmenabgabe {
  constructor() {
    $("#datum").html(`am ${this.formatDate(new Date())}`);
    this.initBtns();
  }

  update(params) {
    this.wkID = params.wkID;
    this.key = params.key;
    this.renderWahlzettel(this.wkID);
  }

  initBtns() {
    let erstStimme;
    let zweitStimme;
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
      this.vote(erstStimme, zweitStimme, true);
    });
    // stimme abgegeben
    $("#submitStimme").on("click", _ => {
      erstStimme = $('input[name=optionsRadios1]:checked', "#erstStimme").val() ? $('input[name=optionsRadios1]:checked', "#erstStimme").val() : -1;
      zweitStimme = $('input[name=optionsRadios2]:checked', "#zweitStimme").val() ? $('input[name=optionsRadios2]:checked', "#zweitStimme").val() : -1;
      const warningBody = this.genWarningBody(erstStimme, zweitStimme);
      $("#warningStimmenAbgabe .modal-body").html(warningBody);

      if (erstStimme >= 0 && zweitStimme >= 0) { // beide stimmen gültig
        this.vote(erstStimme, zweitStimme, false);
      } else { // mind. eine Stimme ungültig
        $("#warningStimmenAbgabe").modal("show");
      }
    });
  }

  vote(erstStimme, zweitStimme, modalOpen) {
    $.getJSON(`db/function/insertVote?param=${this.wkID},${erstStimme},${zweitStimme},${this.key}`, data => {
      let bodyHTML = "";
      if (data[0].insertvote === "Key invalid") bodyHTML = (`<span>Der Key <b>${this.key}</b> ist ungültig!</span>`);
      else if (data[0].insertvote === "Vote Inserted") bodyHTML = ("<span>Ihre Stimme wurde erfolgreich abgespeichert!</span>");
      else bodyHTML = "<span>Server Error!</span>";
      $("#modalStimmeAbgegeben .modal-body").html(bodyHTML);
      $('#warningStimmenAbgabe').one('hidden.bs.modal', _ => {
        $("#modalStimmeAbgegeben").modal("show");
      });
      if (!modalOpen) $("#modalStimmeAbgegeben").modal("show");
      else $("#warningStimmenAbgabe").modal("hide");
    });
  }

  genWarningBody(erstStimme, zweitStimme) {
    let warningText = "";
    if (erstStimme === -1 && zweitStimme === -1) {
      warningText = "Sie habe eine <b>ungültige Erststimme und eine ungültige Zweitstimme</b> abgegeben.<br>";
    } else if (erstStimme === -1) {
      warningText = "Sie habe eine <b>ungültige Erststimme</b> abgegeben.<br>";
    } else if (zweitStimme === -1) {
      warningText = "Sie habe eine <b>ungültige Zweitstimme</b> abgegeben.<br>";
    }
    warningText += "Sind Sie sich wirklich sicher?";
    return warningText;
  }

  renderWahlzettel(wk) {
    $.getJSON(`db/customquery/erstKandidaten?param=${wk}`, data => {
      $.getJSON(`/db/customquery/zweitParteien?param=${wk}`, data2 => {
        // update stimmzettel
        $("#erstStimme").html("");
        $("#zweitStimme").html("");
        $("#wkName").html(`im Wahlkreis ${wk} - ${data[0].wkname}`);
        let parteiCounter = 0;
        let found1 = false,
          found2 = false;
        while (parteiCounter <= 42) {
          for (let i = 0; i < data.length; i++)  {
            let v = data[i];
            if (v.pid === parteiCounter) {
              $("#erstStimme").append(`<div class="radio" style="min-height:75px">
                  <label class="labelStimmenabgabe">
                      <input type="radio" name="optionsRadios1" value="${v.pid}">
                          ${v.titel ? v.titel : ''} ${v.name}, ${v.vorname} <b>(${v.partei})</b></label>
                  <div style="padding-left:20px;">${v.beruf}</div>
              </div>`);
              found1 = true;
              break;
            }
          }
          for (let i = 0; i < data2.length; i++)  {
            let v = data2[i];
            if (v.pid === parteiCounter) {
              $("#zweitStimme").append(`<div class="radio" style='min-height:75px'>
              <label class="labelStimmenabgabe">
                <input type="radio" name="optionsRadios2" value="${v.pid}">
                  <b>${v.pname}</b></label>
                  <div style="padding-left:20px;">${v.k1name}, ${v.k1vorname}; ${v.k2name}, ${v.k2vorname}; ${v.k3name}, ${v.k3vorname}</div>
          </div>`);
              found2 = true;
              break;
            }
          }
          if (!found1 && found2) $("#erstStimme").append("<div class='radio' style='min-height:75px'></div>");
          if (!found2 && found1) $("#zweitStimme").append("<div class='radio' style='min-height:75px'></div>");
          found1 = found2 = false;
          parteiCounter++;
        }
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
