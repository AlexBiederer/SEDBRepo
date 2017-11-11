const express = require('express')
const app = express();
var fs = require('fs');
var data = require('../complete.json');


app.get('/', (req, res) => {
  res.sendFile(__dirname + "/" + "index.html");
});


app.listen(3000, () => console.log('Example app listening on port 3000!'));

console.log(data);
debugger;
fs.writeFile("./test.txt", "Hello World", function(err) {
  if (err) {
    return console.log(err);
  }

  console.log("The file was saved!");
});
