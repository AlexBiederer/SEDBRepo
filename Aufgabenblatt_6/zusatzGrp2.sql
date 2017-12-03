/*
Zusatzabfrage Gruppe-2
(Frauenquote gewählte Direktkandidaten) / (Frauenquote Direktkandidaten) => Ist dieser Wert größer als 0.5 => „Frauenbonus“, sonst: „Männerbonus“
*/

with wkSiegerStimmen(wk,maxStimmen) as (
	Select agg1.wahlkreis, max(agg1.numstimmen) as max from aggerst17 agg1 group by wahlkreis
),
wkSieger(partei, wk, stimmen) as (
	Select partei,wk,maxStimmen from wkSiegerStimmen, aggerst17 where wahlkreis = wk and maxStimmen = numstimmen order by partei, wk
),
frauenquoteDir(quote) as (
Select count(*) * 1.0 / (Select count(*) from direkt17) from direkt17 dir17, kandidat17 k17 where dir17.kandidat = k17.id and k17.geschlecht = 'w'
),
frauenquoteGew(quote) as (
Select count(*) * 1.0 / (Select count(*) from wahlkreis17) from wkSieger wkS, direkt17 dir17, kandidat17 k17 where dir17.wahlkreis = wkS.wk and k17.partei = wkS.partei 
	and dir17.kandidat = k17.id and k17.geschlecht = 'w'
)
Select Round(frauenquoteGew.quote / frauenquoteDir.quote, 2) from frauenquoteGew, frauenquoteDir
