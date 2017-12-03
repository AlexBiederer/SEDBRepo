/**
 * Stimmengenerator
 * @author Felix Schwarzmeier & Alexander Biederer
 */
const express = require('express');
const port = 3000;
const fs = require('fs');
const path = require('path');
const dataComplete = require('../json/complete.json');
const testJSON = require('../json/testJSON1.json');
const bundeslandToID = require('../json/bundeslandToID.json');
const parteiToID = require('../json/parteiToID.json');
const wahlkreisToID = require('../json/wahlkreisToID.json');
const csv = require('csvtojson');
const app = express();
const dbConnector = require('./dbConnector');


// Script starts from here after deploying the index.html to the client
const startHere = () => {};

// Returns the index.html and starts the script
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../..', 'frontend/index.html'));
  startHere();
});
// Returns the complete.json file
app.get('/complete', (req, res) => {
  res.sendFile(path.join(__dirname, "../json", "complete.json"));
});
// Serving static files
app.use(express.static(path.join(__dirname, '../..', 'frontend')));
// DB REST endpoint
app.use('/db', dbConnector.DB_Connector.createRouter());
// Specify port for listening of the web-server
app.listen(port, () => console.log(`Generator is listening on port ${port}!`));


/**
 * Functions for creating sql statements
 * @param {Object} data which shall be inserted into the db
 *    @return {String} outputString containing all sql statements
 * || @return {void} prints directly to a file (neccessary for verly large files e.g. erst17)
 */
const erst17 = data => {
  csv().fromFile("./csv/aggErst17.csv")
    .on('json', (val) => {
      outputString = "";
      console.log(val.partei, val.wahlkreis);
      for (let i = 1; i <= val.sum; i++) {
        outputString += `${val.partei},${val.wahlkreis}`;
      }
      printToFile(outputString, {
        flag: 'a'
      });
    }).on("end", (err) => {
      //  printToFile(outputString);
    });
};
const aggErst17 = () => {
  const wk = dataComplete.wahlkreise;
  let outputString = "INSERT INTO aggerst17 (partei,wahlkreis,numstimmen) VALUES ";
  for (let id in wk) {
    wk[id].ParteiErgebnisse.forEach((val) => {
      outputString += `(${parteiToID[val.Partei]},${id},${val.Erststimme_17}),`;
    });
  }
  return outputString.substring(0, outputString.length - 1);
};
const aggErst13 = () => {
  var wk = dataComplete.wahlkreise;
  var outputString = "INSERT INTO aggerst13 (partei,wahlkreis,numstimmen) VALUES ";
  for (var id in wk) {
    wk[id].ParteiErgebnisse.forEach((val) => {
      outputString += `(${parteiToID[val.Partei]},${id},${val.Erststimme_13}),`;
    });
  }
  return outputString.substring(0, outputString.length - 1);
};
const aggZweit17 = () => {
  var wk = dataComplete.wahlkreise;
  var outputString = "INSERT INTO aggzweit17 (partei,wahlkreis,numstimmen) VALUES ";
  for (var id in wk) {
    wk[id].ParteiErgebnisse.forEach((val) => {
      outputString += `(${parteiToID[val.Partei]},${id},${val.Zweitstimme_17}),`;
    });
  }
  return outputString.substring(0, outputString.length - 1);
};
const aggZweit13 = () => {
  var wk = dataComplete.wahlkreise;
  var outputString = "INSERT INTO aggzweit13 (partei,wahlkreis,numstimmen) VALUES ";
  for (var id in wk) {
    wk[id].ParteiErgebnisse.forEach((val) => {
      outputString += `(${parteiToID[val.Partei]},${id},${val.Zweitstimme_13}),`;
    });
  }
  return outputString.substring(0, outputString.length - 1);
};
const wahlkreis17 = () => {
  var outputString = "";
  var wk = data.wahlkreise;
  outputString += "INSERT INTO wahlkreis17 (id, Name, Bundesland, numWahlb, numGueltigeErst, numGueltigeZweit, numUngueltigeErst, numUngueltigeZweit) VALUES "
  for (var id in wk) {
    outputString += `(${id},'${wk[id]["Name"]}',${bundeslandToID[wk[id]["Bundesland"]]},${wk[id]["Wahlberechtigte_17"]},${wk[id]["Gueltige_17_Erst"]},${wk[id]["Gueltige_17_Zweit"]},${wk[id]["Ungueltige_17_Erst"]},${wk[id]["Ungueltige_17_Zweit"]}),`;
  }
  return outputString.substring(0, outputString.length - 1);;
}
const wahlkreis13 = () => {
  var outputString = "";
  var wk = data.wahlkreise;
  outputString += "INSERT INTO wahlkreis13 (id, Name, Bundesland, numWahlb, numGueltigeErst, numGueltigeZweit, numUngueltigeErst, numUngueltigeZweit) VALUES "
  for (var id in wk) {
    outputString += `(${id},'${wk[id]["Name"]}',${bundeslandToID[wk[id]["Bundesland"]]},${wk[id]["Wahlberechtigte_13"]},${wk[id]["Gueltige_13_Erst"]},${wk[id]["Gueltige_13_Zweit"]},${wk[id]["Ungueltige_13_Erst"]},${wk[id]["Ungueltige_13_Zweit"]}),`;
  }
  return outputString.substring(0, outputString.length - 1);;
};
const kandidat17 = () => {
  printToFile("INSERT INTO kandidat17 (id,titel,vorname,name,geschlecht,gebjahr,gebort,beruf,partei) VALUES ", null, "sql/kandidat17.sql");
  var partei = "";
  var titel = "";
  csv({
      delimiter: ";"
    }).fromFile("./csv/btw17_kandidaten_utf8-korr2.csv")
    .on("json", val => {
      outputString = "";
      partei = parteiToID[val.Wahlkreis_ParteiKurzBez.startsWith("EB:") ? "Übrige" : val.Wahlkreis_ParteiKurzBez ? val.Wahlkreis_ParteiBez : val.Liste_ParteiBez];
      outputString += val.Titel ? `,(${val.ID},'${val.Titel}','${val.Vorname}','${val.Name}','${val.Geschlecht}',${val.Geburtsjahr},'${val.Geburtsort}','${val.Beruf}',${partei})` :
        `,(${val.ID},null,'${val.Vorname}','${val.Name}','${val.Geschlecht}',${val.Geburtsjahr},'${val.Geburtsort}','${val.Beruf}',${partei})`
      if (val.ID == 0) printToFile(outputString.substring(1, outputString.length), {
        flag: 'a'
      }, "sql/kandidat17.sql")
      else printToFile(outputString, {
        flag: 'a'
      }, "sql/kandidat17.sql");
    }).on("err", err => console.log(err));
};
const direkt17 = () => {
  printToFile("INSERT INTO direkt17 (kandidat,wahlkreis) VALUES ", null, "sql/direkt17.sql");
  var removeFirstSemicolon = 1;
  csv({
      delimiter: ";"
    }).fromFile("./csv/btw17_kandidaten_utf8-korr2.csv")
    .on("json", val => {
      outputString = "";
      if (val.Wahlkreis_Nr) {
        outputString += `,(${val.ID},${val.Wahlkreis_Nr})`;
        if (removeFirstSemicolon) {
          outputString = outputString.substring(1, outputString.length);
          removeFirstSemicolon = 0;
        }
      }

      printToFile(outputString, {
        flag: 'a'
      }, "sql/direkt17.sql")
    }).on("err", err => console.log(err));
};
const liste17 = () => {
  printToFile("INSERT INTO liste17 (kandidat,bundesland,partei,platz) VALUES ", null, "sql/liste17.sql");
  var removeFirstSemicolon = 1;
  csv({
      delimiter: ";"
    }).fromFile("./csv/btw17_kandidaten_utf8-korr2.csv")
    .on("json", val => {
      outputString = "";
      if (val.Liste_Land) {
        outputString += `,(${val.ID},${bundeslandToID[val.Liste_Land]},${parteiToID[val.Liste_ParteiBez]},${val.Liste_Platz})`;
        if (removeFirstSemicolon) {
          outputString = outputString.substring(1, outputString.length);
          removeFirstSemicolon = 0;
        }
      }
      printToFile(outputString, {
        flag: 'a'
      }, "sql/liste17.sql")
    }).on("err", err => console.log(err));
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
  fs.writeFileSync(`./${target}`, data, options, function(err) {
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
