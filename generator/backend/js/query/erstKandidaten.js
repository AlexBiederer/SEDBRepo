module.exports = (wahlkreis) => 
`
select k.id, k.titel, k.vorname, k.name, p.abk from kandidat17 k, partei17 p, direkt17 dselect * from kandidat17 k, partei17 p, direkt17 d
where k.partei = p.id
and d.kandidat = k.id
and d.wahlkreis = ${wahlkreis}
`
