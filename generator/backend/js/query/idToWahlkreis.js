module.exports = (wahlkreis) => 
`
select w.name from wahlkreis17 w where w.id = ${wahlkreis}
`
