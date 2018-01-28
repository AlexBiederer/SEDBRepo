drop materialized view bundestagsmitglieder17;

-- Hier stehen alle Queries für die Sitzplatzberechnung dokumentiert
-- Das ganze wird in einem materialized View gespeichert, und bei bedarf neu berechnet.
create materialized view bundestagsmitglieder17 as
(
with

	-- Neu Aggregierte Erststimmen 17
	recursive altAggErst17(partei, wahlkreis, numStimmen) as
	(
		select partei, wahlkreis, count(*)
		from erst17
		-- where wahlkreis = <wahlkreis>
		group by partei, wahlkreis
	),

	-- Neu Aggregierte Erststimmen 13
	altAggErst13(partei, wahlkreis, numStimmen) as
	(
		select partei, wahlkreis, count(*)
		from erst13
		-- where wahlkreis = <wahlkreis>
		group by partei, wahlkreis
	),

	-- Neu Aggregierte Zweitstimmen 17
	altAggZweit17(partei, wahlkreis, numStimmen) as
	(
		select partei, wahlkreis, count(*)
		from zweit17
		-- where wahlkreis = <wahlkreis>
		group by partei, wahlkreis
	),

	-- Neu Aggregierte Zweitstimmen 13
	altAggZweit13(partei, wahlkreis, numStimmen) as
	(
		select partei, wahlkreis, count(*)
		from zweit13
		-- where wahlkreis = <wahlkreis>
		group by partei, wahlkreis
	),

	-- Welche Partei hat welchen Wahlkreis gewonnen
	mandatProWahlkreis(wahlkreis, partei) as
	(
		select agg1.wahlkreis, agg1.partei
		from altAggErst17 agg1 LEFT JOIN altAggErst17 agg2
		-- Joine mit allen Parteien, welche im selben Wahlkreis besser sind 
		on (agg1.wahlkreis = agg2.Wahlkreis and agg1.numStimmen < agg2.numStimmen)
		-- Sieger ist dann die Partei, wo keine bessere gefunden werden konnte
		where agg2.numStimmen IS NULL

	),

	--Gibt den zweitbesten pro wahlkreis
	zweiterProWahlkreis(wahlkreis, partei) as
	(
		select agg1.wahlkreis, agg1.partei
		from (select * from altAggErst17 a
		      	-- Entferne die Sieger aus der liste
			  where not exists 
			  (
				  select * from mandatProWahlkreis w
				  where w.partei = a.partei 
				  and w.wahlkreis = a.wahlkreis
			  )) agg1 LEFT JOIN (select * from altAggErst17 a
		     -- Entferne die Sieger aus der liste auch hier
			  where not exists 
			  (
				  select * from mandatProWahlkreis w
				  where w.partei = a.partei 
				  and w.wahlkreis = a.wahlkreis
			  )) agg2
		-- Berechne davon wieder den besten
		on (agg1.wahlkreis = agg2.Wahlkreis and agg1.numStimmen < agg2.numStimmen)
		where agg2.numStimmen IS NULL
	),

	-- Wie viele Direktmandate hat eine Partei pro Bundesland gewonnen 
	-- (hier nur Parteien enthalten, welche auch etwas erhalten haben) 
	mandateProParteiProBLohne0(bundesland, partei, numMandate) as
	(
		select w.bundesland, mpw.partei, count(*) as numMandate
		from mandatProWahlkreis mpw, wahlkreis17 w
		where w.id = mpw.wahlkreis
		group by bundesland, partei
	),

	-- Wie viele Direktmandate hat eine Partei pro Bundesland gewonnen 
	-- (hier auch Parteien enthalten, welche nicht erhalten haben)
	-- (aber auch Parteien, welche die Hürde nicht schaffen)
	mandateProParteiProBLOhneHuerde(bundesland, partei, numMandate) as
	(
		select bundesland, partei, sum(numMandate)
		from
		(
			(
				select * from mandateProParteiProBLohne0 mpppb0
			)
			union 
			(
				select b.id as bundesland, p.id as partei, 0 as numMandate
				from partei17 p, bundesland b
			) 
		) tmp
		group by bundesland, partei
	),

	-- Wie viele Direktmandate hat eine Partei insgesamt gewonnen 
	-- (hier auch Parteien enthalten, welche nichts erhalten haben)
	-- (aber auch Parteien, welche die Hürde nicht schaffen)
	mandateProParteiOhneHuerde(partei, numMandate) as 
	(
		select partei, sum(nummandate) as numMandate
		from mandateProParteiProBLOhneHuerde
		group by partei
	),

	-- Anzahl der gesamt abgegebenen Zweitstimmen pro Bundesland 
	zweitProBL(bundesland, numStimmen) as 
	(
		select w.bundesland, sum(agg.numStimmen) 
		from altAggZweit17 agg, wahlkreis17 w
		where w.id = agg.wahlkreis
		group by w.bundesland 
	),
    
    	-- Anzahl der gesamt abgegebenen Zweitstimmen pro Bundesland 
	zweitGesamt(numStimmen) as 
	(
		select sum(numStimmen) 
		from zweitProBL
	),

	-- Wie viele Zweitstimmen hat eine Partei pro Bundesland erhalten 
	-- (mit Parteien, welche die Hürde nicht schaffen)
	zweitProBLProParteiOhneHuerde(bundesland, partei, numStimmen) as 
	(
		select w.bundesland, agg.partei, sum(agg.numStimmen) 
		from altAggZweit17 agg, wahlkreis17 w
		where w.id = agg.wahlkreis
		group by w.bundesland, agg.partei
	),

	-- Wie viele Zweitstimmen hat eine Partei erhalten 
	-- (mit Parteien, welche die Hürde nicht schaffen)
	zweitProParteiOhneHuerde(partei, numStimmen) as
	(
		select partei, sum(numStimmen)
		from zweitProBLProParteiOhneHuerde
		group by partei
	),

	-- Welche Parteien schaffen beide Hürden?
	parteiNachHuerde(id) as
	(
		select distinct p.id
		from partei17 p, zweitProParteiOhneHuerde zpbp, zweitGesamt zpb, mandateProParteiOhneHuerde mpp
		where p.id = zpbp.partei 
		and p.id = mpp.partei
		and (((zpbp.numStimmen)/(zpb.numStimmen)) > 0.05
		or mpp.numMandate >= 3)
	),

	-- Wie viele Direktmandate hat jede Partei erhalten
	mandateProPartei(partei, numMandate) as
	(
		select mpp.*
		from mandateProParteiOhneHuerde mpp, parteiNachHuerde p
		where p.id = mpp.partei
	),

	-- Wie viele Direktmandate hat jede Partei pro Bundesland erhalten
	mandateProParteiProBL(bundesland, partei, nummandate) as 
	(
		select mpbpp.*
		from mandateProParteiProBLOhneHuerde mpbpp, parteiNachHuerde p
		where p.id = mpbpp.partei
	),

	-- Wie viele Zweitstimmen hat jede Partei pro Bundesland erhalten
	zweitProBLProPartei(bundesland, partei, numStimmen) as 
	(
		select zpbpp.*
		from zweitProBLProParteiOhneHuerde zpbpp, parteiNachHuerde p
		where p.id = zpbpp.partei
	),

	-- Wie viele Zweitstimmen hat jede Partei erhalten
	zweitProPartei(partei, numStimmen) as
	(
		select zpp.*
		from zweitProParteiOhneHuerde zpp, parteiNachHuerde p
		where p.id = zpp.partei
	),

	-- Saint-Lageue Tabelle, welche die Bundesländer nach dem Höchstzahlverfahren anordnet
	slSitzeProBL(divisor, bundesland, wert) as (
		(
			-- Starte mit 0,5 in der divisortabelle
			select 0.5 as divisor, id, numEinwohner/0.5 as wert
			from bundesland
		)
		union
		(
			-- Erhöhe rekursiv den Divisor um 1 
			select divisor + 1, id, numEinwohner/(divisor+1) as wert
			from slSitzeProBL, bundesland
			-- Maximale Größe der Tabelle: Ein Bundesland erhält alle 598 Stimmen,
			-- Abbruchbedinung für die Rekursion,
			-- da der Divisor = Anzahl - 0.5
			where divisor < 598 
			and id = bundesland
		)
	),

	-- Wie viele Sitze haben die Bundesländer vorläufig im Bundestag (Auswertung der Saint-Lageue Tabelle)
	sitzeProBL (bundesland, numSitze) as 
	( 
		select bundesland, count(*) 
		from (
			select *
			from slSitzeProBL
			order by wert DESC
			-- Nimm die obersten 598 der Eben berechneten, geordneten tabelle
			limit 598) as tmp
		group by bundesland
	),

	-- Saint-Lageue Tabelle, welche Parteien in den Bundesländern per Höchstzahlverfahren anordnet
	slSitzeProParteiProBL(divisor, partei, bundesland, wert) as (
		(
			-- Starte wieder mit 0,5 als Divisor
			select 0.5 as divisor, p.id, zpb.bundesland, zpb.numStimmen/0.5 as wert
			from partei17 p, zweitProBLProPartei zpb
			where zpb.partei = p.id
		)
		union
		(
			-- Inkrementiere wieder den Divisor um 1 pro Schritt
			select sl.divisor + 1, sl.partei, sl.bundesland, (zpb.numStimmen*1.00)/(sl.divisor+1.0) as wert
			from slSitzeProParteiProBL sl, zweitProBLProPartei zpb
			-- Abbruchbedingung jetzt abhängig von der Maximalzahl der verfügbaren Sitze pro Bundesland
			-- Abbruch = Eine Partei hat alle sitze im Bundesland
			where divisor < (select numSitze from sitzeProBL where sl.bundesland = bundesland) 
			and zpb.bundesland = sl.bundesland
			and zpb.partei = sl.partei
		)
	),

	-- Wie viele Sitze haben die Parteien vorläufig?
	sitzeProParteiProBL(bundesland, partei, numSitze) as
	(
		select b.id, p.id, 
		(
			select count(*) from
			(
				select * from slSitzeProParteiProBL sl
				where b.id = sl.bundesland
				order by wert desc
				-- Weise die Anzahl der Sitze pro Bundesland zu, die verfügbar sind 
				limit (select numSitze from sitzeProBL spb where spb.bundesland = b.id)
			) as sllimit
			where partei = p.id
		)
		from bundesland b, partei17 p
	),

	-- Wie viele Sitze hat jede Partei mindestens pro Bundesland (maximum aus direktmandaten, und zweitstimmenandteilen)
	minSitzeProParteiProBL(bundesland, partei, numSitze) as 
	(
		select spppb.bundesland, spppb.partei, (case when spppb.numSitze > mpppb.nummandate then spppb.numSitze else mpppb.nummandate end)
		from sitzeProParteiProBL spppb, mandateProParteiProBL mpppb
		where spppb.partei = mpppb.partei 
		and mpppb.bundesland = spppb.bundesland
	),

	-- Wie viele Sitze stehen einer Partei insgesamt nach Zweitstimmenanteil zu
	sitzeProPartei(partei, numSitze) as
	(
		select partei, sum(numSitze)
		from sitzeProParteiProBL
		group by partei
	),

	-- Wie viele Sitze stehen jeder Partei mindestens zu?
	minSitzeProPartei(partei, numSitze) as
	(
		select partei, sum(numsitze)
		from minSitzeProParteiProBL
		where numsitze is not null
		group by partei
	),

	-- Saint-Lageue Tabelle, welche alle Parteien nach dem Höchstzahlverfahren anordnet
	slSitzeProParteiAusgleich(divisor, partei, wert) as (
		(
			-- Wieder Start mit 0,5 als Divisor
			select 0.5 as divisor, mpp.partei, zpp.numStimmen/0.5 as wert
			from minSitzeProPartei mpp, zweitProPartei zpp
			where zpp.partei = mpp.partei
		)
		union
		(
			-- Wieder inkrementieren des Divisors
			select sl.divisor + 1, sl.partei, (zpp.numStimmen)/(sl.divisor+1) as wert
			from slSitzeProParteiAusgleich sl, zweitProPartei zpp
			-- Abbruchbedingung ist hier gegeben, wenn eine Partei alleine alle 
			-- von allen Parteien benötigten Sitze hat (unrealistisch, aber der mögliche Extremfall) 
			where sl.divisor < (select sum(numSitze) from minSitzeProPartei)
			and zpp.partei = sl.partei
		)
	),

	-- Die Einträge aus der Saint-Lageue Tabelle, welche die Mindestanzahl Sitze
	-- pro Partei gerade noch erfüllen
	slSitzeProParteiAusgleichFilter(divisor, partei, wert) as
	(
		select sl1.divisor, sl1.partei, sl1.wert 
		from slSitzeProParteiAusgleich sl1
		-- Checke für jeden Sitz, ob nicht einer Existiert, der höhere Prio hat und die Anforderungen schon erfüllt
		where not exists
		(
			select *
			from slSitzeProParteiAusgleich sl2, minSitzeProPartei mspp1
			-- höhere Prio
			where sl2.wert > sl1.wert
			and sl2.partei = sl1.partei
			-- Mindestanforderungen der Partei sind erfüllt
			and sl2.divisor + 1 > mspp1.numsitze
			and mspp1.partei = sl2.partei
		)
	),

	-- Die Anzahl der Sitze Pro Partei nach dem Verteilen von Ausgleichsmandaten 
	sitzeProParteiAusgleich(partei, numSitze) as
	(
		select partei, count(*) 
		from slSitzeProParteiAusgleich 
		-- Alle sitze, dessen Wert größer als der Wert
		-- des letzten für die Einhaltung aller Mindestbedingungen nötigen Sitzes ist
		where wert >= (select min(wert) from slSitzeProParteiAusgleichFilter)
		group by partei
	),

	-- Saint-Lageue Tabelle, welche alle Sitze pro Partei pro Bundesland nach Höchstzahlverfahren anordnet
	slSitzeProParteiProBLAusgleich(divisor, bundesland, partei, wert) as (
		(
			-- Wie immer start mit 0,5 als Divisor
			select 0.5 as divisor, bundesland, partei, numStimmen/0.5 as wert
			from zweitProBLProPartei
		)
		union
		(
			select sl.divisor + 1, sl.bundesland, sl.partei, zbp.numStimmen/(sl.divisor+1) as wert
			from slSitzeProParteiProBLAusgleich sl, zweitProBLProPartei zbp
			-- Abbruchbedingung hier wieder die mindestanzahl der partei
			where sl.divisor < (select numSitze from sitzeProParteiAusgleich spu where spu.partei = sl.partei)
			and sl.bundesland = zbp.bundesland
			and sl.partei = zbp.partei
		)
	),

	-- Q1: Die Sitzverteilung der Parteien je Bundesland nach verteilen der Ausgleichsmandate
	sitzeProParteiProBLAusgleich(bundesland, partei, numSitze) as
	(
		-- Wähle Parteidaten mit anzahl der direktmandate + anzahl der sonstigen mandate
		select distinct b.id, p.id, m3.numMandate + 
		(
			-- Anzahl der Über zweitstimme erhaltenen Mandate
			select count(*) 
			from 
			(
				select sl.* 
				from slSitzeProParteiProBLAusgleich sl, mandateProParteiProBL m2
				where sl.partei = p.id   
				and sl.partei = m2.partei
				and sl.bundesland = m2.bundesland
				-- Nur die Sitze Werden Betrachtet, welche nach dem Erfüllen der Mindestmandate erst vergeben werden
				and sl.divisor > m2.nummandate 
				order by sl.wert desc
				-- Nimm nur so viele Sitze, bis die der Partei zustehenden Plätze aufgebraucht sind
				limit (select spp.numSitze from sitzeProParteiAusgleich spp where spp.partei = p.id) - (m1.numMandate)
			) as sllimit
			where sllimit.partei = p.id
			and sllimit.bundesland = b.id
		)
		from parteiNachHuerde p, bundesland b, mandateProPartei m1, mandateProParteiProBL m3
		where m1.partei = p.id 
		and m3.partei = p.id
		and m3.bundesland = b.id
	),

	-- Welche Direktkandidaten sind pro bundesland und partei sicher im Bundestag?
	direktKandProParteiProBL(bundesland, partei, kandidat) as
	(
		select w.bundesland, k.partei, k.id
		from direkt17 d, mandatProWahlkreis m, kandidat17 k, wahlkreis17 w
		where d.kandidat = k.id
		and d.wahlkreis = m.wahlkreis
		and m.partei = k.partei
		and w.id = d.wahlkreis
	),

	-- Die Gewählten Direktkandidaten werden aus den Listenkandidaten entfernt, Listenplatznummern angepasst
	listenKandProParteiProBlOhneDirekt(kandidat, bundesland, partei, platz) as
	(
		select distinct l.kandidat, l.bundesland, l.partei,
		row_number () over (
			-- Ordne alle Kandidaten pro bundesland und partei
			partition by l.partei, l.bundesland
			order by l.platz
		) as platz from liste17 l 
		-- Entferne die Kandidaten aus der liste, welche bereits ein Direktmandat haben
		where not exists 
		(
			select * 
			from direktKandProParteiProBL b
			where l.kandidat = b.kandidat 
		)
	),

	-- Welche Kandidaten sind jetzt insgesamt im Bundestag?
	kandidatenProParteiProBL(bundesland, partei, kandidat) as
	(
		select l.bundesland, l.partei, l.kandidat 
		from listenKandProParteiProBlOhneDirekt l
		-- Wähle alle Kandidaten, deren Platznummer kleiner der Anzahl der Partei pro BL zustehenden Plätze ist
		where platz <= (
			select (g.numSitze - m.numMandate) as dif
			from sitzeProParteiProBLAusgleich g, mandateProParteiProBL m
			where g.partei = m.partei
			and g.bundesland = m.bundesland
			and g.partei = l.partei
			and g.bundesland = l.bundesland
		)
		-- Füge die Direktkandidaten dazu
		union 
		(
			select * from direktKandProParteiProBL
		)
	),

	-- Q2: Mitglieder des Bundestages, 
	mitgliederDesBundestags(id, titel, vorname, name, geschlecht, gebjahr, gebort, beruf, wahlslogan, bildurl, partei) as
	(
		select k1.* 
		from kandidat17 k1 
		 join kandidatenProParteiProBL k2 on k1.id = k2.kandidat
	)

	select m.*, p.name as pname from mitgliederDesBundestags m, partei17 p where p.id = m.partei);

