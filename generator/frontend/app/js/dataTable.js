/**
* Data Table
*/
export default function(id,options) {
  const tableOptions = Object.assign(DATA_TABLE_DEFAULTS,options);
  // Show table
  $(`#${id}`).show();
  // init data table
  return $(`#${id}`).DataTable(tableOptions);
}
// Default option values
const DATA_TABLE_DEFAULTS = {
  "language": {
    "search": "Suche",
    "paginate": {
      "first": "Erste",
      "last": "Letzte",
      "next": "Nächste",
      "previous": "Vorherige"
    },
    "lengthMenu": "Zeige _MENU_ Einträge",
    "info": "Zeige _START_ bis _END_ von _TOTAL_ Einträgen",
    "infoFiltered": "(gefiltert aus _MAX_ Einträgen)",
     "infoEmpty":   "Zeige 0 bis 0 aus 0 Einträgen",
  }
};
