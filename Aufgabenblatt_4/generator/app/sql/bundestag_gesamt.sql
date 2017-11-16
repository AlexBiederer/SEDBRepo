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

slSitzeProBL(divisor, bundesland, wert) as (
	(
	select 0.5 as divisor, id, numEinwohner/0.5 as wert
	from bundesland
	)
	union
	(
	select divisor + 1, id, numEinwohner/(divisor+1) as wert
	from slSitzeProBL, bundesland
	where divisor < 598
	and id = bundesland
	)
),

sitzeProBL (bundesland, numSitze) as 
( 
	select bundesland, count(*) 
	from (
		select *
		from slSitzeProBL
		order by wert DESC
		limit 598) as tmp
	group by bundesland
),

slSitzeProParteiProBL(divisor, partei, bundesland, wert) as (
	(
	select 0.5 as divisor, p.id, zpb.bundesland, zpb.numStimmen/0.5 as wert
	from partei17 p, zweitProBLProPartei zpb
	where zpb.partei = p.id
	)
	union
	(
	select sl.divisor + 1, sl.partei, sl.bundesland, (zpb.numStimmen*1.00)/(sl.divisor+1.0) as wert
	from slSitzeProParteiProBL sl, zweitProBLProPartei zpb
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
			select * from slSitzeProParteiProBL sl
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

slSitzeProParteiAusgleich(divisor, partei, wert) as (
	(
	select 0.5 as divisor, mpp.partei, zpp.numStimmen/0.5 as wert
	from minSitzeProPartei mpp, zweitProPartei zpp
	where zpp.partei = mpp.partei
	)
	union
	(
	select sl.divisor + 1, sl.partei, (zpp.numStimmen)/(sl.divisor+1) as wert
	from slSitzeProParteiAusgleich sl, zweitProPartei zpp
	where sl.divisor < (select sum(numSitze) from minSitzeProPartei)
	and zpp.partei = sl.partei
	)
),

slSitzeProParteiAusgleichFilter(divisor, partei, wert) as
(
    select sl1.divisor, sl1.partei, sl1.wert 
    from slSitzeProParteiAusgleich sl1
    where not exists
    (
        select *
        from slSitzeProParteiAusgleich sl2, minSitzeProPartei mspp1
        where sl2.wert > sl1.wert
        and sl2.partei = sl1.partei
        and sl2.divisor + 1 > mspp1.numsitze
        and mspp1.partei = sl2.partei
    )
),

sitzeProParteiAusgleich(partei, numSitze) as
(
    select partei, count(*) 
	from slSitzeProParteiAusgleich 
    where wert >= (select min(wert) from slSitzeProParteiAusgleichFilter)
    group by partei
),

slSitzeProParteiProBLAusgleich(divisor, bundesland, partei, wert) as (
	(
		select 0.5 as divisor, bundesland, partei, numStimmen/0.5 as wert
		from zweitProBLProPartei
	)
	union
	(
		select sl.divisor + 1, sl.bundesland, sl.partei, zbp.numStimmen/(sl.divisor+1) as wert
		from slSitzeProParteiProBLAusgleich sl, zweitProBLProPartei zbp
		where sl.divisor < (select numSitze from sitzeProParteiAusgleich spu where spu.partei = sl.partei)
		and sl.bundesland = zbp.bundesland
    	and sl.partei = zbp.partei
	)
),

sitzeProParteiProBLAusgleich(bundesland, partei, numSitze) as
(
    select distinct b.id, p.id, m3.numMandate + 
    (
    	select count(*) 
        from 
        (
            select sl.* 
            from slSitzeProParteiProBLAusgleich sl, mandateProParteiProBL m2
        	where sl.partei = p.id   
            and sl.partei = m2.partei
            and sl.bundesland = m2.bundesland
            and sl.divisor > m2.nummandate
        	order by sl.wert desc
        	limit (select spp.numSitze from sitzeProParteiAusgleich spp where spp.partei = p.id) - (m1.numMandate)
        ) as sllimit
        where sllimit.partei = p.id
        and sllimit.bundesland = b.id
    )
    from parteiNachHuerde p, bundesland b, mandateProPartei m1, mandateProParteiProBL m3
    where m1.partei = p.id 
    and m3.partei = p.id
    and m3.bundesland = b.id
)

--select * from sitzeProParteiProBLAusgleich where partei = 0
--select * from mandateProParteiProBL order by bundesland, partei 
--select sum(numsitze) from sitzeProParteiProBLAusgleich 
select p.name, b.name, s.numsitze 
from sitzeProParteiProBLAusgleich s, bundesland b, partei17 p
where s.bundesland = b.id 
and p.id = s.partei
order by partei, bundesland 
