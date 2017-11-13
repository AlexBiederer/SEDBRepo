/**
 * Stimmengenerator
 * @author Felix Schwarzmeier & Alexander Biederer
 */
var express = require('express');
var fs = require('fs');
var path = require('path');
var dataComplete = require('../json/complete.json');
var testJSON = require('../json/testJSON1.json');
var bundeslandToID = require('../json/bundeslandToID.json');
var parteiToID = require('../json/parteiToID.json');
var wahlkreisToID = require('../json/wahlkreisToID.json');
var csv = require('csvtojson');
var app = express();
var port = 3000;

// Script starts from here after deploying the index.html to the client
var startHere = () => {
  printToFile(wahlkreis13(dataComplete), null, "sql/wahlkreis13.sql");
};

// Returns the index.html and starts the script
app.get('/', (req, res) => {
  res.sendFile(__dirname + "/" + "index.html");
  startHere();
});
// Returns the complete.json file
app.get('/complete', (req, res) => {
  res.sendFile(path.join(__dirname, "../", "complete.json"));
  startHere();
});
// Specify port for listening of the web-server
app.listen(port, () => console.log(`Generator is listening on port ${port}!`));


/**
 * Functions for creating sql statements
 * @param {Object} data which shall be inserted into the db
 *    @return {String} outputString containing all sql statements
 * || @return {void} prints directly to a file (neccessary for verly large files e.g. erst17)
 */
var erst17 = data => {
  csv().fromFile("./app/csv/aggErst17.csv")
    .on('json', (val) => {
      outputString = "";
      console.log(val.partei, val.wahlkreis);
      for (var i = 1; i <= val.sum; i++) {
        outputString += `${val.partei},${val.wahlkreis}`;
      }
      printToFile(outputString, {
        flag: 'a'
      });
    }).on("end", (err) => {
      //  printToFile(outputString);
    });
};
var aggErst17 = data => {
  var wk = dataComplete.wahlkreise;
  var outputString = "INSERT INTO aggerst17 (partei,wahlkreis,numstimmen) VALUES ";
  for (var id in wk) {
    wk[id].ParteiErgebnisse.forEach((val) => {
      outputString += `(${parteiToID[val.Partei]},${id},${val.Erststimme_17}),`;
    });
  }
  return outputString.substring(0, outputString.length - 1);
};
var aggErst13 = data => {
  var wk = dataComplete.wahlkreise;
  var outputString = "INSERT INTO aggerst13 (partei,wahlkreis,numstimmen) VALUES ";
  for (var id in wk) {
    wk[id].ParteiErgebnisse.forEach((val) => {
      outputString += `(${parteiToID[val.Partei]},${id},${val.Erststimme_13}),`;
    });
  }
  return outputString.substring(0, outputString.length - 1);
};
var aggZweit17 = data => {
  var wk = dataComplete.wahlkreise;
  var outputString = "INSERT INTO aggzweit17 (partei,wahlkreis,numstimmen) VALUES ";
  for (var id in wk) {
    wk[id].ParteiErgebnisse.forEach((val) => {
      outputString += `(${parteiToID[val.Partei]},${id},${val.Zweitstimme_17}),`;
    });
  }
  return outputString.substring(0, outputString.length - 1);
};
var aggZweit13 = data => {
  var wk = dataComplete.wahlkreise;
  var outputString = "INSERT INTO aggzweit13 (partei,wahlkreis,numstimmen) VALUES ";
  for (var id in wk) {
    wk[id].ParteiErgebnisse.forEach((val) => {
      outputString += `(${parteiToID[val.Partei]},${id},${val.Zweitstimme_13}),`;
    });
  }
  return outputString.substring(0, outputString.length - 1);
};
var wahlkreis17 = data => {
  var outputString = "";
  var wk = data.wahlkreise;
  outputString += "INSERT INTO wahlkreis17 (id, Name, Bundesland, numWahlb, numGueltigeErst, numGueltigeZweit, numUngueltigeErst, numUngueltigeZweit) VALUES "
  for (var id in wk) {
    outputString += `(${id},'${wk[id]["Name"]}',${bundeslandToID[wk[id]["Bundesland"]]},${wk[id]["Wahlberechtigte_17"]},${wk[id]["Gueltige_17_Erst"]},${wk[id]["Gueltige_17_Zweit"]},${wk[id]["Ungueltige_17_Erst"]},${wk[id]["Ungueltige_17_Zweit"]}),`;
  }
  return outputString.substring(0, outputString.length - 1);;
}
var wahlkreis13 = data => {
  var outputString = "";
  var wk = data.wahlkreise;
  outputString += "INSERT INTO wahlkreis13 (id, Name, Bundesland, numWahlb, numGueltigeErst, numGueltigeZweit, numUngueltigeErst, numUngueltigeZweit) VALUES "
  for (var id in wk) {
    outputString += `(${id},'${wk[id]["Name"]}',${bundeslandToID[wk[id]["Bundesland"]]},${wk[id]["Wahlberechtigte_13"]},${wk[id]["Gueltige_13_Erst"]},${wk[id]["Gueltige_13_Zweit"]},${wk[id]["Ungueltige_13_Erst"]},${wk[id]["Ungueltige_13_Zweit"]}),`;
  }
  return outputString.substring(0, outputString.length - 1);;
};

/**
 * Print an input string to the query.sql file
 * @param {String} data which shall be printed
 * @param {Object} options for the writeFile function e.g. flags etc.
 * @param {String} target for the sql script
 */
var printToFile = (data, options = {
  flag: 'w'
}, target = "sql/query.sql") => {
  fs.writeFileSync(`./app/${target}`, data, options, function(err) {
    if (err) return console.log(err);
    console.log("The file was successfully saved!");
  });
};


// csv().fromFile("./app/csv/wahlkreise.csv")
//   .on('json', (val) => {
//     wahlkreisToID[val.name] = val.id;
//   }).on("end", (err) => {
//     if (err) return console.log(err);
//     printToFile(JSON.stringify(wahlkreisToID));
//     debugger;
//   });
