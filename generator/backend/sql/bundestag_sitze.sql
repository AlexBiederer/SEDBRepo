select partei, pname as name, count(*) as sitze from bundestagsmitglieder17 group by partei, pname order by partei, pname
