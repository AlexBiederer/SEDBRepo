module.exports = (wahlkreis, partei) => `
insert into erst17 (partei, wahlkreis) values (${partei}, ${wahlkreis})`
