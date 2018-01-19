/*
Zusatzabfrage Gruppe-2
(Frauenquote gewählte Direktkandidaten) / (Frauenquote Direktkandidaten) => Ist dieser Wert größer als 1 => „Frauenbonus“, sonst: „Männerbonus“
*/
-- Welche Partei hat welchen Wahlkreis gewonnen
with mandatProWahlkreis(wahlkreis, partei) as
(
	select agg1.wahlkreis, agg1.partei
	from aggErst17 agg1 LEFT JOIN aggErst17 agg2
	on (agg1.wahlkreis = agg2.Wahlkreis and agg1.numStimmen < agg2.numStimmen)
	where agg2.numStimmen IS NULL

),
-- Frauenquote Direktkandidaten
frauenquoteDir(quote) as (
Select count(*) * 1.0 / (Select count(*) from direkt17) from direkt17 dir17, kandidat17 k17 where dir17.kandidat = k17.id and k17.geschlecht = 'w'
),
-- Frauenquote gewählter Direktkandidaten
frauenquoteGew(quote) as (
Select count(*) * 1.0 / (Select count(*) from wahlkreis17) from mandatProWahlkreis wkS, direkt17 dir17, kandidat17 k17 where dir17.wahlkreis = wkS.wahlkreis and k17.partei = wkS.partei
	and dir17.kandidat = k17.id and k17.geschlecht = 'w'
),
--Query Zusatzaufgabe Gruppe 2
frauenbonus(bonus) as (
Select Round(frauenquoteGew.quote / frauenquoteDir.quote, 2) from frauenquoteGew, frauenquoteDir
)
Select * from frauenbonus
