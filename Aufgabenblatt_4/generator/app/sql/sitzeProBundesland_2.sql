with recursive mandatProWahlkreis(wahlkreis, partei) as
(
	select wahlkreis, partei 
	from aggErst17
	group by wahlkreis

)

select * from mandatProWahlkreis;

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

sitzeProBL (bundesland, sitze) as 
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
	select zpbp.bundesland, zpbp.partei, zpbp.numStimmen 
	from zweitProBLProParteiVor zpbp, zweitProBLVor zpb, aggErst17 agg, mandateProPartei mpp
	where (zpbp.numStimmen*1.0)/(zpb.numStimmen) > 0.05
	or mpp.numMandate >= 3
),

zweitProBL(bundesland, numStimmen) as 
(
	select bundesland, count(*)
	from zweitProBLProPartei
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
	where divisor < (select sitze from sitzeProBL where sl.bundesland = bundesland)
	and zpb.bundesland = sl.bundesland
	and zpb.partei = sl.partei
	)
),

sitzeProParteiProBL(bundesland, partei, sitze) as
(
	select b.id, p.id, 
	(
		select count(*) from
		(
			select * from sl2 sl
			where b.id = sl.bundesland
			order by wert desc
			limit (select sitze from sitzeProBL spb where spb.bundesland = b.id)
		) as sllimit
		where partei = p.id
	)
	from bundesland b, partei17 p
)

select sum(sitze) from sitzeProParteiProBL;
