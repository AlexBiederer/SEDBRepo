module.exports = (wahlkreis) => `with
-- Welche Partei hat welchen Wahlkreis gewonnen
mandatProWahlkreis(wahlkreis, partei) as
(
	select agg1.wahlkreis, agg1.partei
	from aggErst17 agg1 LEFT JOIN aggErst17 agg2
	on (agg1.wahlkreis = agg2.Wahlkreis and agg1.numStimmen < agg2.numStimmen)
	where agg2.numStimmen IS NULL

),

wahlkreisDetails(wahlkreis, wkName, direktkandidat,
                   wahlbeteiligung,
                   wahlbeteiligungVorj) as
(
	select w17.id as wahlkreis, w17.name as wkName,
    d.kandidat as direktkandidat,
    cast (((w17.numgueltigeerst + w17.numungueltigeerst + w17.numgueltigezweit + w17.numungueltigezweit) / cast(2 * w17.numwahlb as float)) * 100 as decimal(18, 2)) as wahlbeteiligung,
    cast (((w13.numgueltigeerst + w13.numungueltigeerst + w13.numgueltigezweit + w13.numungueltigezweit) / cast(2 * w13.numwahlb as float)) * 100 as decimal(18, 2)) as wahlkbeteiligungVorj
    from wahlkreis13 w13, wahlkreis17 w17, mandatProWahlkreis mw, direkt17 d, kandidat17 k
    where w17.id = mw.wahlkreis
    and mw.partei = k.partei
    and d.kandidat = k.id
    and d.wahlkreis = w17.id
    and w17.id = w13.id
),

prozUndAbsErstProParteiProWahlkreis(partei, wahlkreis, numStimmenProz, numStimmenAbs, numStimmenProzVorj, numStimmenAbsVorj) as
(
	select e17.partei, e17.wahlkreis,
    cast(100 * cast(e17.numStimmen as float)/(w17.numGueltigeErst + w17.numUngueltigeErst) as decimal(18, 2)),
    e17.numStimmen,
    cast(100 * cast(e13.numStimmen as float)/(w13.numGueltigeErst + w13.numUngueltigeErst) as decimal(18, 2)),
    e13.numStimmen
    from aggErst17 e17, wahlkreis17 w17, aggErst13 e13, wahlkreis13 w13
    where e17.wahlkreis = w17.id
    and w17.id = w13.id
    and w13.id = e13.wahlkreis
    and e17.partei = e13.partei
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
wahlkreisUebersicht(wahlkreis, wkName, partei, parteiID, direktkandidat,
                   wahlbeteiligung,
                   diffWahlbeteiligung,
                   numErstStimmenProz, numErstStimmenAbs,
                   diffErstStimmenProz, diffErstStimmenAbs,
				   numZweitStimmenProz, numZweitStimmenAbs,
                   diffZweitStimmenProz, diffZweitStimmenAbs) as
(
    select d.wahlkreis, d.wkName,
  	p.name,
		p.id,
    d.direktkandidat,
    d.wahlbeteiligung,
    d.wahlbeteiligung - d.wahlbeteiligungvorj,
    pea.numStimmenProz,
    pea.numStimmenAbs,
    pea.numstimmenProz - pea.numStimmenProzVorj,
    pea.numStimmenAbs - pea.numStimmenAbsVorj,
    pza.numStimmenProz,
    pza.numStimmenAbs,
    pza.numstimmenProz - pza.numStimmenProzVorj,
    pza.numStimmenAbs - pza.numStimmenAbsVorj
    from wahlkreisdetails d, prozUndAbsErstProParteiProWahlkreis pea, prozUndAbsZweitProParteiProWahlkreis pza, partei17 p
    where pea.wahlkreis = d.wahlkreis
    and p.id = pea.partei
	and pza.wahlkreis = d.wahlkreis
    and p.id = pza.partei
),

wahlkreisUebersichtMitSonstige(wahlkreis, wkName, partei, parteiID, direktkandidat,
                   wahlbeteiligung,
                   diffWahlbeteiligung,
                   numErstStimmenProz, numErstStimmenAbs,
                   diffErstStimmenProz, diffErstStimmenAbs,
				   numZweitStimmenProz, numZweitStimmenAbs,
                   diffZweitStimmenProz, diffZweitStimmenAbs) as
(
	(
        select * from wahlkreisUebersicht
    	where numZweitStimmenProz >= 5

    )
    union
    (
        select wahlkreis, wkName, 'Sonstige', ${Number.MAX_SAFE_INTEGER},
        direktkandidat, wahlbeteiligung, diffwahlbeteiligung,
        sum(numErstStimmenProz),
        sum(numErstStimmenAbs),
        sum(diffErstStimmenProz),
        sum(diffErstStimmenAbs) ,
        sum(numZweitStimmenProz),
        sum(numZweitStimmenAbs),
        sum(diffZweitStimmenProz),
        sum(diffZweitStimmenAbs)
        from wahlkreisUebersicht
        where numZweitStimmenProz < 5
        group by wahlkreis, wkName, direktkandidat, wahlbeteiligung, diffWahlbeteiligung
    )
	order by numZweitStimmenAbs desc

)
select * from wahlkreisUebersichtMitSonstige where wahlkreis = ${wahlkreis} order by parteiID`
