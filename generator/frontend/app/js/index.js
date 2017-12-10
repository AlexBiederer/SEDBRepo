import '../scss/styles.scss'; // Main style sheet for all chart types
import Bundestag from './bundestag';
import Bundesland from './bundesland';
$(function() {
  new Bundestag();
  new Bundesland();
  // Collapse navbar on click
  $('.nav a').on('click', function() {
    $('.navbar-toggle').click();
  });
});
