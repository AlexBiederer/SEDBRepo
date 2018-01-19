import '../scss/styles.scss'; // Main style sheet for all chart types
import Bundestag from './bundestag';
import Bundesland from './bundesland';
import Wahlkreis from './wahlkreis';
import StimmenAbgabe from './stimmenAbgabe';
import KnappstSieger from './knappsteSieger';
import Sonstiges from './sonstiges';
import Navigo from 'Navigo';

$(function() {
  const root = null;
  const useHash = true;
  const router = new Navigo(root, useHash);
  const stimmenAbgabe = new StimmenAbgabe();
  const bundesland = new Bundesland(router);
  const bundestag =  new Bundestag();
  const knappsteSieger = new KnappstSieger();
  const sonstiges = new Sonstiges();
  // Main route
  router
    .on(_ => {
      router.navigate(`/bundestag`);
    })
    .resolve();
  // Other routes
  router
    .on({
      '/stimmenAbgabe/:wkID/:key': params => {
        $(`.navbar-nav a[href="#stimmenAbgabe"]`).tab('show');
        stimmenAbgabe.update(params)
      },
      '/wahlkreis/:wkID': params => {
        bundesland.updateBarChart(params.wkID)
        $(`.navbar-nav a[href="#wahlkreis"]`).tab('show');
      },
      '/stimmenAbgabe': _ => {
        $(`.navbar-nav a[href="#stimmenAbgabe"]`).tab('show');
        router.navigate(`/stimmenAbgabe/228/1234`);
      },
      '/:tab': params => $(`.navbar-nav a[href="#${params.tab}"]`).tab('show')
    })
    .resolve();

  // Collapse navbar on click
  $('.nav a').on('click', function() {
    $('.navbar-toggle').click();
  });
  // Hide Wahlkreis tab at first & activate routing on tab-click
  $('a[data-toggle="tab"]').on('click', function() {
    const target = $(this).attr("href").split('#')[1].trim();
    if ($(this).parent('li').hasClass('disabled')) {
      alert("Bitte wählen Sie zuerst einen Wahlkreis im Reiter 'Bundesland' aus!");
      return false;
    } else router.navigate(`/${target}`);
  });
});
