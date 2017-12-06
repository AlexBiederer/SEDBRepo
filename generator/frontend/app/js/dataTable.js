// @TODO columnDefs müssen der Funktion übergeben werden, da nicht alle tables unsichtbare columns haben
export default function(id) {
  // Show table
  $(`#${id}`).show();
  // init data table
  return $(`#${id}`).DataTable({
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
    },
    "order": [
      [0, "asc"]
    ],
    "columnDefs": [{
      "targets": [1],
      "visible": false
    }]
  });
}
