with recursive mandatProWahlkreis(wahlkreis, partei) as
(
	select agg1.wahlkreis, agg1.partei
	from aggErst17 agg1 LEFT JOIN aggErst17 agg2
	on (agg1.wahlkreis = agg2.Wahlkreis and agg1.numStimmen < agg2.numStimmen)
	where agg2.numStimmen IS NULL

),

mandateProParteiProBLohne0(bundesland, partei, numMandate) as
(
    select w.bundesland, mpw.partei, count(*) as numMandate
	from mandatProWahlkreis mpw, wahlkreis17 w
	where w.id = mpw.wahlkreis
	group by bundesland, partei
),

mandateProParteiProBLOhneHuerde(bundesland, partei, numMandate) as
(
   	select bundesland, partei, sum(numMandate)
    from
    (
    	(
         	select * from mandateProParteiProBLohne0 mpppb0
        )
        union 
        (
            select b.id as bundesland, p.id as partei, 0 as numMandate
            from partei17 p, bundesland b
        ) 
   	) tmp
    group by bundesland, partei
),

mandateProParteiOhneHuerde(partei, numMandate) as 
(
	select partei, sum(nummandate) as numMandate
	from mandateProParteiProBLOhneHuerde
	group by partei
),

zweitProBL(bundesland, numStimmen) as 
(
	select w.bundesland, sum(agg.numStimmen) 
	from aggZweit17 agg, wahlkreis17 w
	where w.id = agg.wahlkreis
	group by w.bundesland 
),

zweitProBLProParteiOhneHuerde(bundesland, partei, numStimmen) as 
(
	select w.bundesland, agg.partei, sum(agg.numStimmen) 
	from aggZweit17 agg, wahlkreis17 w
	where w.id = agg.wahlkreis
	group by w.bundesland, agg.partei
),

zweitProParteiOhneHuerde(partei, numStimmen) as
(
	select partei, sum(numStimmen)
    from zweitProBLProParteiOhneHuerde
    group by partei
),

parteiNachHuerde(id) as
(
	select distinct p.id
    from partei17 p, zweitProBLProParteiOhneHuerde zpbp, zweitProBL zpb, mandateProParteiOhneHuerde mpp
	where p.id = zpbp.partei 
    and p.id = mpp.partei
    and (((zpbp.numStimmen)/(zpb.numStimmen)) > 0.05
	or mpp.numMandate >= 3)
),

mandateProPartei(partei, numMandate) as
(
	select mpp.*
    from mandateProParteiOhneHuerde mpp, parteiNachHuerde p
	where p.id = mpp.partei
),

mandateProParteiProBL(bundesland, partei, nummandate) as 
(
	select mpbpp.*
    from mandateProParteiProBLOhneHuerde mpbpp, parteiNachHuerde p
	where p.id = mpbpp.partei
),

zweitProBLProPartei(bundesland, partei, numStimmen) as 
(
	select zpbpp.*
    from zweitProBLProParteiOhneHuerde zpbpp, parteiNachHuerde p
	where p.id = zpbpp.partei
),

zweitProPartei(partei, numStimmen) as
(
	select zpp.*
    from zweitProParteiOhneHuerde zpp, parteiNachHuerde p
	where p.id = zpp.partei
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

minSitzeProParteiProBL(bundesland, partei, numSitze) as 
(
	select spppb.bundesland, spppb.partei, (case when spppb.numSitze > mpppb.nummandate then spppb.numSitze else mpppb.nummandate end)
    from sitzeProParteiProBL spppb, mandateProParteiProBL mpppb
    where spppb.partei = mpppb.partei 
    and mpppb.bundesland = spppb.bundesland
),

sitzeProPartei(partei, numSitze) as
(
	select partei, sum(numSitze)
    from sitzeProParteiProBL
    group by partei
),

minSitzeProPartei(partei, numSitze) as
(
	select partei, sum(numsitze)
    from minSitzeProParteiProBL
    where numsitze is not null
    group by partei
),

sl3part1(divisor, partei, wert) as (
	(
	select 0.5 as divisor, mpp.partei, zpp.numStimmen/0.5 as wert
	from minSitzeProPartei mpp, zweitProPartei zpp
	where zpp.partei = mpp.partei
	)
	union
	(
	select sl.divisor + 1, sl.partei, (zpp.numStimmen)/(sl.divisor+1) as wert
	from sl3part1 sl, zweitProPartei zpp
	where sl.divisor < (select sum(numSitze) from minSitzeProPartei)
	and zpp.partei = sl.partei
	)
),

sl3part2(divisor, partei, wert) as
(
    select sl1.divisor, sl1.partei, sl1.wert 
    from sl3part1 sl1
    where not exists
    (
        select *
        from sl3part1 sl2, minSitzeProPartei mspp1
        where sl2.wert > sl1.wert
        and sl2.partei = sl1.partei
        and sl2.divisor + 1 > mspp1.numsitze
        and mspp1.partei = sl2.partei
    )
),

sitzeProParteiUeberhang(partei, numSitze) as
(
    select partei, count(*) 
	from sl3part1 
    where wert >= (select min(wert) from sl3part2)
    group by partei
),

sl4part1(divisor, bundesland, partei, wert) as (
	(
		select 0.5 as divisor, bundesland, partei, numStimmen/0.5 as wert
		from zweitProBLProPartei
	)
	union
	(
		select sl.divisor + 1, sl.bundesland, sl.partei, zbp.numStimmen/(sl.divisor+1) as wert
		from sl4part1 sl, zweitProBLProPartei zbp
		where sl.divisor < (select numSitze from sitzeProParteiUeberhang spu where spu.partei = sl.partei)
		and sl.bundesland = zbp.bundesland
    	and sl.partei = zbp.partei
	)
),

sl4part2(divisor, bundesland, partei, wert) as
(
    select sl1.divisor, sl1.bundesland, sl1.partei, sl1.wert 
    from sl4part1 sl1
    where not exists
    (
        select *
        from sl4part1 sl2, mandateProParteiProBL mpb
        where sl2.wert > sl1.wert
        and sl2.bundesland = sl1.bundesland
        and sl2.partei = sl1.partei
        and sl2.divisor + 1 > mpb.numMandate        
        and mpb.bundesland = sl2.bundesland
        and mpb.partei = sl2.partei
        
    )
),

sitzeProParteiProBLFinal1(bundesland, partei, numSitze) as
(
    select sl1.bundesland, sl1.partei, 
    (
    	select count(*) 
        from sl4part1 sl2
        where sl2.partei = sl1.partei
        and sl2.bundesland = sl1.bundesland
        order by wert
    )

    
),

sitzeProParteiProBLFinal(bundesland, partei, numSitze) as
(
    select sl1.bundesland, sl1.partei, count(*) 
	from sl4part1 sl1 
    where sl1.wert > (select min(sl2.wert) from sl4part2 sl2 where sl2.partei = sl1.partei)
    group by bundesland, partei
)

select * from sitzeProParteiProBLFinal where partei = 0 order by bundesland

/*

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
	where (divisor < (select numSitze from sitzeProBLAusgleich spba where sl.bundesland = spba.bundesland))
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

select sum(numsitze) from sitzeProBLAusgleich;

*/
