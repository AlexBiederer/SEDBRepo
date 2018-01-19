/*
Zusatzabfrage Gruppe-5
Finde den Direktkandiaten, der es mit prozentual am wenigsten Stimmen in den Bundestag geschafft hat.
*/
-- Welche Partei hat welchen Wahlkreis gewonnen
with mandatProWahlkreis(wk, partei, stimmen) as
(
	select agg1.wahlkreis, agg1.partei, agg1.numStimmen
	from aggErst17 agg1 LEFT JOIN aggErst17 agg2
	on (agg1.wahlkreis = agg2.Wahlkreis and agg1.numStimmen < agg2.numStimmen)
	where agg2.numStimmen IS NULL

),
-- Siegerstimmen jedes Wahlkreissiegers in Prozent
wkSiegerPercent(partei,wk,percent) as (
Select wkS.partei, wkS.wk, Round((wkS.stimmen * 100.0 / wk17.numgueltigeerst),1) as prozent from mandatProWahlkreis wkS, wahlkreis17 wk17 where wkS.wk = wk17.id
),
-- Direktkandiaten, der es mit prozentual am wenigsten Stimmen in den Bundestag geschafft hat
oekonomischterKandidat(partei,wk,percent,name) as (
	Select wkSP.partei, wkSP.wk, wkSP.percent, Concat(k17.titel,' ', k17.vorname,' ',k17.name) as name from wksiegerPercent wkSP, direkt17 dir17, kandidat17 k17
	where percent = (Select min(percent) from wkSiegerPercent) and wahlkreis = wkSP.wk and k17.id = dir17.kandidat and wkSP.partei = k17.partei
)
-- Hinzufügen von Parteiname und Wahkreisname für die Visualiserung im Frontend
Select oek.partei, p17.name as parteiname, oek.wk, wk17.name as wkname, oek.percent, oek.name from oekonomischterKandidat oek, wahlkreis17 wk17, partei17 p17
where oek.partei = p17.id and wk17.id = oek.wk
