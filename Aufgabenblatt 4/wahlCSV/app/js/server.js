const express = require('express')
const app = express();
var fs = require('fs');
var data = require('../complete.json');
const csv = require('csvtojson');


const csvFilePath = 'orginal_btw17_kerg.csv';


csv().fromFile(csvFilePath)
  .on('json', (jsonObj) => {
    debugger;
    // combine csv header row and csv line to a json object
    // jsonObj.a ==> 1 or 4
  })
  .on('done', (error) => {
    debugger;
  });

// app.get('/', (req, res) = > {
//     res.sendFile(__dirname + "/" + "index.html");
// });

// app.listen(3000, () = > console.log('Example app listening on port 3000!'));



debugger;
fs.writeFile("./test.txt", "Hello World", function(err) {
  if (err) {
    return console.log(err);
  }

  console.log("The file was saved!");
});
