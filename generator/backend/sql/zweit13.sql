drop table zweit13;

create table zweit13(partei, wahlkreis) as (

	with recursive zweit13withNum(partei, wahlkreis, numStimmen) as
	((select * from aggzweit13
	where numstimmen > 0)
	union all
	(select partei, wahlkreis, numstimmen-1 from zweit13withNum where numstimmen > 1))
	(select partei, wahlkreis from zweit13withNum)

)
