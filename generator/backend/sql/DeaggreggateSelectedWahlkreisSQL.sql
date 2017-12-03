delete from erst17 where wahlkreis = <wahklreis>;

insert into erst17 (

	with recursive erst17withNum(partei, wahlkreis, numStimmen) as 
	((select * from aggErst17
	where numstimmen > 0
	AND wahlkreis = <wahlkreis>)
	union all
	(select partei, wahlkreis, numstimmen-1 from erst17withNum where numstimmen > 1))
	(select partei, wahlkreis from erst17withNum)

)