with recursive mandatProWahlkreis(wahlkreis, partei) as
(
	select agg1.wahlkreis, agg1.partei
	from aggErst17 agg1 LEFT JOIN aggErst17 agg2
	on (agg1.wahlkreis = agg2.Wahlkreis and agg1.numStimmen < agg2.numStimmen)
	where agg2.numStimmen IS NULL

),

mandateProBundesland(bundesland, partei, numMandate) as
(
	select w.bundesland, mpw.partei, count(*) as numMandate
	from mandatProWahlkreis mpw, wahlkreis17 w
	where w.id = mpw.wahlkreis
	group by bundesland, partei
),

mandateProPartei(partei, numMandate) as 
(
	select partei, count(*) as numMandate
	from mandatProWahlkreis
	group by partei
),

sl(divisor, bundesland, wert) as (
	(
	select 0.5 as divisor, id, numEinwohner/0.5 as wert
	from bundesland
	)
	union
	(
	select divisor + 1, id, numEinwohner/(divisor+1) as wert
	from sl, bundesland
	where divisor < 598
	and id = bundesland
	)
),

sitzeProBL (bundesland, numSitze) as 
( 
	select bundesland, count(*) 
	from (
		select *
		from sl
		order by wert DESC
		limit 598) as tmp
	group by bundesland
),

zweitProBLVor(bundesland, numStimmen) as 
(
	select w.bundesland, sum(agg.numStimmen) 
	from aggErst17 agg, wahlkreis17 w
	where w.id = agg.wahlkreis
	group by w.bundesland 
),

zweitProBLProParteiVor(bundesland, partei, numStimmen) as 
(
	select w.bundesland, agg.partei, sum(agg.numStimmen) 
	from aggErst17 agg, wahlkreis17 w
	where w.id = agg.wahlkreis
	group by w.bundesland, agg.partei
),

zweitProBLProPartei(bundesland, partei, numStimmen) as
(
	select distinct zpbp.bundesland, zpbp.partei, zpbp.numStimmen 
	from zweitProBLProParteiVor zpbp, zweitProBLVor zpb, mandateProPartei mpp
	where ((zpbp.numStimmen)/(zpb.numStimmen)) > 0.05
	or mpp.numMandate >= 3
),

zweitProBL(bundesland, numStimmen) as 
(
	select bundesland, count(*)
	from zweitProBLProPartei
	group by bundesland
),

zweitProPartei(partei, numStimmen) as
(
	select partei, sum(numStimmen)
    from zweitProBLProPartei
    group by partei
),

sl2(divisor, partei, bundesland, wert) as (
	(
	select 0.5 as divisor, p.id, zpb.bundesland, zpb.numStimmen/0.5 as wert
	from partei17 p, zweitProBLProPartei zpb
	where zpb.partei = p.id
	)
	union
	(
	select sl.divisor + 1, sl.partei, sl.bundesland, (zpb.numStimmen*1.00)/(sl.divisor+1.0) as wert
	from sl2 sl, zweitProBLProPartei zpb
	where divisor < (select numSitze from sitzeProBL where sl.bundesland = bundesland)
	and zpb.bundesland = sl.bundesland
	and zpb.partei = sl.partei
	)
),

sitzeProParteiProBL(bundesland, partei, numSitze) as
(
	select b.id, p.id, 
	(
		select count(*) from
		(
			select * from sl2 sl
			where b.id = sl.bundesland
			order by wert desc
			limit (select numSitze from sitzeProBL spb where spb.bundesland = b.id)
		) as sllimit
		where partei = p.id
	)
	from bundesland b, partei17 p
),

sitzeProPartei(partei, numSitze) as
(
	select partei, sum(numSitze)
    from sitzeProParteiProBL
    group by partei
),

minSitzeProPartei(partei, numSitze) as
(
	select spp.partei, (case when spp.numSitze > mpp.nummandate then spp.numSitze else mpp.nummandate end)
    from sitzeProPartei spp, mandateProPartei mpp
    where spp.partei = mpp.partei
),

sl3(divisor, partei, wert) as (
	(
	select 0.5 as divisor, mpp.partei, zpp.numStimmen/0.5 as wert
	from minSitzeProPartei mpp, zweitProPartei zpp
	where zpp.partei = mpp.partei
	)
	union
	(
	select sl.divisor + 1, sl.partei, (zpp.numStimmen)/(sl.divisor+1) as wert
	from sl3 sl, zweitProPartei zpp
	where divisor < (select numSitze from minSitzeProPartei mspp where sl.partei = mspp.partei)
	and zpp.partei = sl.partei
	)
),

sitzeProParteiUeberhang(partei, numSitze) as
(
	select partei, count(*)
    from sl3
    group by partei
),

sl4(divisor, bundesland, wert) as (
	(
	select 0.5 as divisor, id, numEinwohner/0.5 as wert
	from bundesland
	)
	union
	(
	select divisor + 1, id, numEinwohner/(divisor+1) as wert
	from sl, bundesland
	where divisor < (select sum(numSitze) from sitzeProParteiUeberhang)
	and id = bundesland
	)
),

sitzeProBLAusgleich (bundesland, numSitze) as 
( 
	select bundesland, count(*) 
	from (
		select *
		from sl4
		order by wert DESC
		limit (select sum(numSitze) from sitzeProParteiUeberhang)) as tmp
	group by bundesland
),

sl5(divisor, partei, bundesland, wert) as (
	(
	select 0.5 as divisor, zpb.partei, zpb.bundesland, zpb.numStimmen/0.5 as wert
	from zweitProBLProPartei zpb
	)
	union
	(
	select sl.divisor + 1, sl.partei, sl.bundesland, (zpb.numStimmen)/(sl.divisor+1.0) as wert
	from sl2 sl, zweitProBLProPartei zpb
	where divisor < (select numSitze from sitzeProBLAusgleich spba where sl.bundesland = spba.bundesland)
	and zpb.bundesland = sl.bundesland
	and zpb.partei = sl.partei
	)
),

sitzeProParteiProBLAusgleich(bundesland, partei, numSitze) as
(
	select b.id, p.id, 
	(
		select count(*) from
		(
			select * from sl5 sl
			where b.id = sl.bundesland
			order by wert desc
			limit (select numSitze from sitzeProBLAusgleich spba where spba.bundesland = b.id)
		) as sllimit
		where partei = p.id
	)
	from bundesland b, partei17 p
)

select sum(numsitze) from sitzeProParteiProBLAusgleich ;


