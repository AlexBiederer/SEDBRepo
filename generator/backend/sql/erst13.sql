drop table erst13;

create table erst13(partei, wahlkreis) as (

	with recursive erst13withNum(partei, wahlkreis, numStimmen) as 
	((select * from aggErst13
	where numstimmen > 0)
	union all
	(select partei, wahlkreis, numstimmen-1 from erst13withNum where numstimmen > 1))
	(select partei, wahlkreis from erst13withNum)

)