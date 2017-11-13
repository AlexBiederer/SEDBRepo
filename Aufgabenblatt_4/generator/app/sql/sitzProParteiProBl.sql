with recursive sl(divisor, bundesland, wert) as (
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

zweitProBL(bundesland, numStimmen) as 
(
	select w.bundesland, sum(agg.numStimmen) 
	from aggErst17 agg, wahlkreis17 w
	where w.id = agg.wahlkreis
	group by w.bundesland 
),

zweitProBLProPartei(bundesland, partei, numStimmen) as 
(
	select w.bundesland, agg.partei, sum(agg.numStimmen) 
	from aggErst17 agg, wahlkreis17 w
	where w.id = agg.wahlkreis
	group by w.bundesland, agg.partei
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
