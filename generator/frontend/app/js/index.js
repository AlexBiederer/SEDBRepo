// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap';
// import 'datatables.net-bs';
import '../scss/styles.scss'; // Main style sheet for all chart types
import bundestag from './bundestag';
import bundesland from './bundesland';
$(function() {
  bundestag();
  bundesland();
  $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
    var targetTab = $(e.target).attr("href").substring(1); // activated tab
    if (targetTab === "bundesland") {
    }
  });
});
