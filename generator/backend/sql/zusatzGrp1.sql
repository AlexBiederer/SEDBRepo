/*
Zusatzabfrage Gruppe-1
Für jede Partei, in welchem Wahlkreis war die Diskrepanz zwischen Erstimmenergebnis für den Direktkandidaten der Partei und dem Zweitstimmenergebnis für die Partei am größten.
Damit könnte man sehen in welchen Wahlkreisen besonders die Person (und nicht die Einstellung der Partei an sich) gewählt wird, oder der Direktkandidat besonders unbeliebt ist (wenn Erststimmenergebnis << Zweitstimmenergebnis).
*/

with diskrepanz(partei,wk,dis) as (
Select aggerst17.partei, aggerst17.wahlkreis, (aggerst17.numstimmen - aggzweit17.numstimmen) as diskrepanz from aggerst17, aggzweit17
  where aggerst17.partei = aggzweit17.partei and aggerst17.wahlkreis = aggzweit17.wahlkreis and aggerst17.numstimmen > 0 and aggzweit17.numstimmen > 0 and aggerst17.partei != 42
), diskrepanzMaxMin(partei,disMax,disMin ) as (
Select d1.partei, max(dis), min(dis) from diskrepanz d1 group by d1.partei
),
-- Diskrepanz Max/Min mit jewiligem Wahlkreis
diskrepanzMaxMinWahlkreis as (
Select dMaxMin.partei, p17.name as parteiname, d.wk as wkMax, wk17_1.name as wkMaxName, d2.wk as wkMin, wk17_2.name as wkMinName, dMaxMin.disMax, dMaxMin.disMin from diskrepanzMaxMin dMaxMin, diskrepanz d, diskrepanz d2, partei17 p17, wahlkreis17 wk17_1, wahlkreis17 wk17_2
  where dMaxMin.partei = d.partei and dMaxMin.partei = d2.partei and dMaxMin.disMax = d.dis and dMaxMin.disMin = d2.dis and p17.id = dMaxMin.partei and d.wk = wk17_1.id and d2.wk = wk17_2.id order by dMaxMin.partei
)
Select * from diskrepanzMaxMinWahlkreis
