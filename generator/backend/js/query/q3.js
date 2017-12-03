module.exports = (wahlkreis) => `with
-- Welche Partei hat welchen Wahlkreis gewonnen
mandatProWahlkreis(wahlkreis, partei) as
(
	select agg1.wahlkreis, agg1.partei
	from aggErst17 agg1 LEFT JOIN aggErst17 agg2
	on (agg1.wahlkreis = agg2.Wahlkreis and agg1.numStimmen < agg2.numStimmen)
	where agg2.numStimmen IS NULL

),

wahlkreisDetails(wahlkreis, direktkandidat,
                   wahlbeteiligung,
                   wahlbeteiligungVorj) as
(
	select w17.id as wahlkreis,
    d.kandidat as direktkandidat,
    cast (((w17.numgueltigeerst + w17.numungueltigeerst) / cast(w17.numwahlb as float)) * 100 as decimal(18, 2)) as wahlbeteiligung,
    cast (((w13.numgueltigeerst + w13.numungueltigeerst) / cast(w13.numwahlb as float)) * 100 as decimal(18, 2)) as wahlkbeteiligungVorj
    from wahlkreis13 w13, wahlkreis17 w17, mandatProWahlkreis mw, direkt17 d, kandidat17 k
    where w17.id = mw.wahlkreis
    and mw.partei = k.partei
    and d.kandidat = k.id
    and d.wahlkreis = w17.id
    and w17.id = w13.id
),

prozUndAbsZweitProParteiProWahlkreis(partei, wahlkreis, numStimmenProz, numStimmenAbs, numStimmenProzVorj, numStimmenAbsVorj) as
(
	select z17.partei, z17.wahlkreis,
    cast(100 * cast(z17.numStimmen as float)/(w17.numGueltigeZweit + w17.numUngueltigeZweit) as decimal(18, 2)),
    z17.numStimmen,
    cast(100 * cast(z13.numStimmen as float)/(w13.numGueltigeZweit + w13.numUngueltigeZweit) as decimal(18, 2)),
    z13.numStimmen
    from aggZweit17 z17, wahlkreis17 w17, aggZweit13 z13, wahlkreis13 w13
    where z17.wahlkreis = w17.id
    and w17.id = w13.id
    and w13.id = z13.wahlkreis
    and z17.partei = z13.partei
),

-- Q3 Wahlkreisübersicht
wahlkreisUebersicht(wahlkreis, partei, direktkandidat,
                   wahlbeteiligung,
                   diffWahlbeteiligung,
                   numStimmmenProz, numStimmenAbs,
                   diffStimmenProz, diffStimmenAbs) as
(
    select d.wahlkreis, pa.partei, d.direktkandidat,
    d.wahlbeteiligung,
    d.wahlbeteiligung - d.wahlbeteiligungvorj,
    pa.numStimmenProz, pa.numStimmenAbs,
    pa.numstimmenProz - pa.numStimmenProzVorj,
    pa.numStimmenAbs - pa.numStimmenAbsVorj
    from wahlkreisdetails d, prozUndAbsZweitProParteiProWahlkreis pa
    where pa.wahlkreis = d.wahlkreis
)
select * from wahlkreisUebersicht where wahlkreis = ${wahlkreis}`
