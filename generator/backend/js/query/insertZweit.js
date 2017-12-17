module.exports = (wahlkreis, partei) => `
insert into zweit17 (partei, wahlkreis) values (${partei}, ${wahlkreis})`
