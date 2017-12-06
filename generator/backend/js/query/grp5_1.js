module.exports = (agg) => `with wkSiegerStimmen(wk,maxStimmen) as (
	Select agg1.wahlkreis, max(agg1.numstimmen) as max from ${agg} agg1 group by wahlkreis
),
wkSieger(partei, wk, stimmen) as (
	Select partei,wk,maxStimmen from wkSiegerStimmen, ${agg} where wahlkreis = wk and maxStimmen = numstimmen order by partei, wk
),
wkSiegerPercent(partei,wk,percent) as (
Select wkS.partei, wkS.wk, Round((wkS.stimmen * 100.0 / wk17.numgueltigeerst),1) as prozent from wkSieger wkS, wahlkreis17 wk17 where wkS.wk = wk17.id
)
Select wkSP.partei, wkSP.wk, wkSP.percent, Concat(k17.titel,' ', k17.vorname,' ',k17.name) as name from wksiegerPercent wkSP, direkt17 dir17, kandidat17 k17
	where percent = (Select min(percent) from wkSiegerPercent) and wahlkreis = wkSP.wk and k17.id = dir17.kandidat and wkSP.partei = k17.partei
`
