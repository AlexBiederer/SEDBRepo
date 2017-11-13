with recursive sl(divisor, bland, wert) as (
	(
	select 0.5 as divisor, name, numEinwohner/0.5 as wert
	from bundesland
	)
	union
	(
	select divisor + 1, bland, numEinwohner/(divisor+1) as wert
	from sl, bundesland
	where divisor < 598
	and name = bland
	)
)

select bland, count(*) 
from (
	select *
	from sl
	order by wert DESC
	limit 598) as tmp
group by bland