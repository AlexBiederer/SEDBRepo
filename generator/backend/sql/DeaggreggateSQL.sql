drop table erst13;
drop table erst17;
drop table zweit13;
drop table zweit17;

create table erst13(partei, wahlkreis) as (

	with recursive erst13withNum(partei, wahlkreis, numStimmen) as 
	((select * from aggErst13
	where numstimmen > 0)
	union all
	(select partei, wahlkreis, numstimmen-1 from erst13withNum where numstimmen > 1))
	(select partei, wahlkreis from erst13withNum)

);

create table erst17(partei, wahlkreis) as (

	with recursive erst17withNum(partei, wahlkreis, numStimmen) as 
	((select * from aggErst17
	where numstimmen > 0)
	union all
	(select partei, wahlkreis, numstimmen-1 from erst17withNum where numstimmen > 1))
	(select partei, wahlkreis from erst17withNum)

);

create table zweit13(partei, wahlkreis) as (

	with recursive zweit13withNum(partei, wahlkreis, numStimmen) as 
	((select * from aggZweit13
	where numstimmen > 0)
	union all
	(select partei, wahlkreis, numstimmen-1 from zweit13withNum where numstimmen > 1))
	(select partei, wahlkreis from zweit13withNum)

);

create table zweit17(partei, wahlkreis) as (

	with recursive zweit17withNum(partei, wahlkreis, numStimmen) as 
	((select * from aggZweit17
	where numstimmen > 0)
	union all
	(select partei, wahlkreis, numstimmen-1 from zweit17withNum where numstimmen > 1))
	(select partei, wahlkreis from zweit17withNum)

);