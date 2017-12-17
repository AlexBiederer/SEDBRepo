module.exports = (wahlkreis) => 
`
select p.id as pid, p.name as pname, p.abk, 
k1.titel as k1titel, k1.vorname as k1vorname, k1.name as k1name,
k2.titel as k2titel, k2.vorname as k2vorname, k2.name as k2name,
k3.titel as k3titel, k3.vorname as k3vorname, k3.name as k3name
from kandidat17 k1, liste17 l1, kandidat17 k2, liste17 l2, kandidat17 k3, liste17 l3, partei17 p, wahlkreis17 w
where p.id = l1.partei
and p.id = l2.partei
and p.id = l3.partei
and l1.bundesland = w.bundesland
and l2.bundesland = w.bundesland
and l3.bundesland = w.bundesland
and l1.platz = 1
and l2.platz = 2
and l3.platz = 3
and k1.id = l1.kandidat
and k2.id = l2.kandidat
and k3.id = l3.kandidat
and w.id = ${wahlkreis}
order by pid
`
