class Stimmenabgabe {
  constructor() {
    $("#datum").html(`am ${this.formatDate(new Date())}`);
    $('#sozNrModal').on('click', '#submit', function(e) {
      console.log($('#sozNrInput').val());
      $("#sozNrModal").modal("hide");
    });
    this.renderWahlzettel();
  }

  renderWahlzettel() {
    const dataDirekt = [{
      id: 0,
      name: "Herr 1"
    }, {
      id: 1,
      name: "Herr 2"
    }, {
      id: 2,
      name: "Herr 3"
    }, {
      id: 3,
      name: "Herr 4"
    }];
    const dataZweit = [{
      id: 0,
      name: "CDU"
    }, {
      id: 1,
      name: "SPD"
    }, {
      id: 2,
      name: "Grüne"
    }, {
      id: 3,
      name: "FDP"
    }];
    dataDirekt.forEach((v,k) => {
      $("#erstStimme").append(`<div class="radio">
    <label >
      <input type="radio" name="optionsRadios1" id="optionsRadios1" value="option1">
    ${v.name}</label>
  </div>`)
    });
    dataZweit.forEach((v,k) => {
      $("#zweitStimme").append(`<div class="radio">
    <label>
      <input type="radio" name="optionsRadios2" id="optionsRadios2" value="option1">
    ${v.name}</label>
  </div>`)
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
