drop table erst17;

create table erst17(partei, wahlkreis) as (

	with recursive erst17withNum(partei, wahlkreis, numStimmen) as 
	((select * from aggErst17
	where numstimmen > 0)
	union all
	(select partei, wahlkreis, numstimmen-1 from erst17withNum where numstimmen > 1))
	(select partei, wahlkreis from erst17withNum)

)