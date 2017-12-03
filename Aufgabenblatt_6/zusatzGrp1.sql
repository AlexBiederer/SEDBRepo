/*
Zusatzabfrage Gruppe-1
Für jede Partei, in welchem Wahlkreis war die Diskrepanz zwischen Erstimmenergebnis für den Direktkandidaten der Partei und dem Zweitstimmenergebnis für die Partei am größten.
Damit könnte man sehen in welchen Wahlkreisen besonders die Person (und nicht die Einstellung der Partei an sich) gewählt wird, oder der Direktkandidat besonders unbeliebt ist (wenn Erststimmenergebnis << Zweitstimmenergebnis).
*/

with diskrepanz(partei,wk,dis) as (
Select aggerst17.partei, aggerst17.wahlkreis, abs((aggerst17.numstimmen - aggzweit17.numstimmen)) as diskrepanz from aggerst17, aggzweit17 where aggerst17.partei = aggzweit17.partei and aggerst17.wahlkreis = aggzweit17.wahlkreis
), diskrepanzMax(partei,disMax) as (
Select d1.partei, max(dis) from diskrepanz d1 group by d1.partei order by d1.partei
)
Select dMax.partei, d.wk, dMax.disMax from diskrepanzMax dMax, diskrepanz d where dMax.partei = d.partei and dMax.disMAx = d.dis order by dMax.partei
