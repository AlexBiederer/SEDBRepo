import '../scss/styles.scss'; // Main style sheet for all chart types
import Bundestag from './bundestag';
import Bundesland from './bundesland';
import Wahlkreis from './wahlkreis';
import StimmenAbgabe from './stimmenAbgabe';

$(function() {
  new Bundestag();
  new Bundesland();
  new StimmenAbgabe();
  // Collapse navbar on click
  $('.nav a').on('click', function() {
    $('.navbar-toggle').click();
  });
  // Hide Wahlkreis tab at first
  $('a[data-toggle="tab"]').on('click', function() {
    if ($(this).parent('li').hasClass('disabled')) {
      alert("Bitte wählen Sie zuerst einen Wahlkreis im Reiter 'Bundesland' aus!");
      return false;
    };
  });
  // Open Sozialversicherungsnummer Modal on tab-show
  $('.nav a').on('shown.bs.tab', function(event) {
    if($(event.target).text() === "Stimmenabgabe") $("#sozNrModal").modal("show");

  });
});
