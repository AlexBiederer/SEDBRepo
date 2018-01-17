module.exports = (wahlkreis) => `-- Q4: Wahlkreissieger
with -- Welche Partei hat welchen Wahlkreis gewonnen
mandatProWahlkreis(wahlkreis, partei) as
(
	select agg1.wahlkreis, agg1.partei
	from aggErst17 agg1 LEFT JOIN aggErst17 agg2
	on (agg1.wahlkreis = agg2.Wahlkreis and agg1.numStimmen < agg2.numStimmen)
	where agg2.numStimmen IS NULL

),

-- Welche Partei hat welchen Wahlkreis gewonnen
zweitSiegerProWahlkreis(wahlkreis, partei) as
(
	select agg1.wahlkreis, agg1.partei
	from aggZweit17 agg1 left join aggZweit17 agg2
	on (agg1.wahlkreis = agg2.Wahlkreis and agg1.numStimmen < agg2.numStimmen)
	where agg2.numStimmen is null
),

wahlkreisSieger(wahlkreis, siegerErst, siegerZweit, siegerErstName, siegerZweitName) as
(
	select mw.wahlkreis, mw.partei, zs.partei, p17_1.name, p17_2.name
  from mandatProWahlkreis mw, zweitSiegerProWahlkreis zs, partei17 p17_1, partei17 p17_2
  where zs.wahlkreis = mw.wahlkreis and p17_1.id = mw.partei and p17_2.id = zs.partei)

select * from wahlkreisSieger where wahlkreis = ${wahlkreis}`
