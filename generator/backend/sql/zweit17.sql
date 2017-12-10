drop table zweit17;

create table zweit17(partei, wahlkreis) as (

	with recursive zweit17withNum(partei, wahlkreis, numStimmen) as
	((select * from aggzweit17
	where numstimmen > 0)
	union all
	(select partei, wahlkreis, numstimmen-1 from zweit17withNum where numstimmen > 1))
	(select partei, wahlkreis from zweit17withNum)

)
