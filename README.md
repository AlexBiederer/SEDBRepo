# Wahlsystem - Dokumentation
Felix Schwarzmeier und Alex Biederer.

## Zielsetzung
Das Wahlinformationssystem ist soll prototypisch mehrere Anwendungsfälle explorieren:
* Die Möglichkeit für Bürger, sich online über den Ausgang der Bundestagswahl informieren zu können, und diese im Detail analysieren zu können
* Die Möglichkeit für Bürger, die Wahl elektronisch durchführen zu können. Dabei wird sowohl die Anwendung des Systems als elektronisches Backend in einem Wahllokal, als auch der Einsatz für eine Online-Wahl betrachtet.

## Highlights
* Interaktives, ansprechendes und intuitives Web-Interface
* Graphische Daten-Visualisierung der Wahlergebnisse (Pie-charts, Bar-charts, Bundesland-picker, D3.js, Bootstrap 3)
* Ermöglicht effiziente Analysen des Wahlergebnisses der Bundestagswahl 2017:
	* Implementierung der kompletten Auswertung in SQL
	* Effizientes Datenbankschema
* Korrektheit der Ergebnisse
  * Verwendung der offiziellen Stimmdaten der Wahlen von 2017/2013 auf [bundeswahlleiter.de](https://www.bundeswahlleiter.de/)
	* Ergebnisse identisch zu den offiziellen Auswertungen
* Verwendung des Systems als Backend für die elektronische Stimmabgabe im Wahllokal
* Verwendung des Systems zur sicheren Online-Wahl

## [Lastenheft](https://github.com/AlexBiederer/SEDBRepo/blob/master/Aufgabenblatt_2/Lastenheft_Wahlinformationssystem.md) 

## [Pflichtenheft](https://github.com/AlexBiederer/SEDBRepo/blob/master/Aufgabenblatt_3/Pflichtenheft_Wahlinformatonssystem.pdf)

# Dokumentation des Wahlinformationssystems

## Beschreibung der Benutzer-Schnittstelle
Das Wahlinformationssystem ist aufgegliedert auf 5 Seiten, welche von der Navigationsbar oben auf der Seite navigierbar sind:
1. Bundestag
2. Bundesland
3. Wahlkreis
4. Knappste Sieger
5. Sonstiges

### Bundestag
Auf der Startseite des Wahlsystems (im Tab Bundestag) ist die Auswertung der vorliegenden Stimmdaten zu sehen.
Dabei werden angezeigt: 
1. Ein Kuchendiagramm zur Darstellung der Sitzplatzverteilung und der Zusammensetzung des Bundestags, gruppiert nach Parteien
2. Eine Detailansicht zur Darstellung der Sitzplatzverteilung und der Zusammensetzung des Bundestags, gruppiert nach Parteien
3. Eine Liste mit allen gewählten Abgeordneten
4. Eine Liste mit der Anzahl aller Vergebenen Überhangmandate gruppoert nach Parteien und Bundesland

![alt text](https://github.com/AlexBiederer/SEDBRepo/blob/master/Abschlusspr%C3%A4sentation/Bundestag.png "Bundestagsansicht") 

Oben rechts ist die Option zum Umschalten zwischen voraggregierten und nicht-aggregierten Daten angezeigt (Rohdaten verwenden).
Wenn auf den Aggregierten Daten gearbeitet wird, so werden die Anfragen auf bereits voraggregierten Wahldaten ausgeführt.
Sobald auf die nicht-aggregierten Daten gewechselt wird, werden die Anfragen auf nicht-aggregierten Daten ausgeführt. Dies führt dazu, dass diese auch deutlich länger für die Berechnung der Ergebnisse benötigen.

In den Listen kann nach beliebigen Einträgen gefiltert und sortiert werden, sowie die Anzahl der angezeigten Einträge angepasst werden. 

### Bundesland
![alt text](https://github.com/AlexBiederer/SEDBRepo/blob/master/Abschlusspr%C3%A4sentation/Bundesland2.png "Bundeslandansicht") 
Auf dem Tab Bundesland eine Navigierbare und Zoombare Karte mit den Bundesländern Deutschlands, sowie daneben eine Liste mit allen Wahlkreisen angezeigt. Die Liste ist wie immer filter-, sortier- und in der Größe anpassbar. Diese Seite dient dazu, einen bestimmten Wahlkreis für die Wahlkreis-Ansicht auszuwählen. Dazu wird in der Liste auf der rechten Seite der gewünschte Wahlkreis ausgewählt. Daraufhin erfolgt automatisch der Übergang zur Wahlkreis-Ansicht.

### Wahlkreis
In der Wahlkreis-Ansicht (Tab Wahlkreis) werden alle Daten bezüglich eines gewählten Wahlkreises, wie der gewählte Direktkandidat, die Gewinnerparteien, die Anzahl der berechtigten Wähler, die Anzahl der gültigen und ungültigen Erst-und Zweitstimmen tabellarisch dargestellt. Außerdem werden die Ergebnisse der Wahl, sowie der Vergleich der Ergebnisse mit den Ergebnissen der Vorperiode in Form zweier Balkendiagramme für die Erst- und Zweitstimmen angezeigt.

![alt text](https://github.com/AlexBiederer/SEDBRepo/blob/master/Abschlusspr%C3%A4sentation/Wahlkreis.png "Wahlkreisübersicht") 

Für genauere Details zu den Wahlergebnissen einer Partei kann in den Balkgendiagrammen per Tooltip das Wahlergebnis der jeweiligen Partei in % und Anzahl der Stimmen jeweils wieder im Vergleich zur Vorperiode entnommen werden.

Auch auf der Wahlkreis-Ansicht findet sich oben rechts wieder ein Umschalter, der auch hier wieder zwischen der Berechnung aus aggregierten und nicht-aggregierten Daten umschaltet. 

### Knappste Sieger
![alt text](https://github.com/AlexBiederer/SEDBRepo/blob/master/Abschlusspr%C3%A4sentation/Knappste%20Sieger.png "Knappste Sieger") 
Auf dem Tab Knappste Sieger werden die (bis zu) 10 Knappsten Sieger einer Partei mit der Anzahl der Stimmen Vorsprung (-) angezeigt. Für den Fall dass eine Partei keine 10 Kandidaten im Bundestag hat, wird mit knappsten Verlierern (+) aufgefüllt.
Über der Liste findet sich ein Feld, wo eine Partei (gesucht und) ausgewählt werden kann.
Wieder kann in der Liste sortiert und gefiltert werden.

### Sonstiges
![alt text](https://github.com/AlexBiederer/SEDBRepo/blob/master/Abschlusspr%C3%A4sentation/Sonstiges.png "Knappste Sieger") 
Auf dem Tab Sonstiges finden sich die Ergebnisse der Zusatzaufgaben. Dafür ist oben eine Liste, welche die Auswertung der Fragestellungen über das vorhandenseien eines Frauenbonus, den/die "ökonimischste/n" Kandidat/in (welche/r es mit dem geringsten Vorsprung in den Bundestag geschafft hat), sowie den Wahlkreis mit der größten Diskrepanz zwischen Erst- und Zweitstimme pro Partei, vorhanden.

## Beschreibung der Implementierung
### Verwendete Technologien
Für das Frontend wurde Javascript und D3 zur Darstellung der Grafiken, für das Backend Node.js verwendet.
Die Daten werden in einer Postgres-Datenbank gespeichert.

### Verwendetes Datenschema
![alt text](https://github.com/AlexBiederer/SEDBRepo/blob/master/Aufgabenblatt_1/umlDiagram.png "Verwendetes Datenbankschema")

Um das Schema in der Datenbank gut umzusetzen, wurde das Schema in der Datenbank 2 mal angelegt, einmal für die Ergebnisse von 2013, und einmal für die Ergebnisse von 2017. Die Stimmen sind sowohl aggregiert, als auch nicht-aggregiert abgespeichert.
Das genaue Implementierung des Schemas ist [hier](https://github.com/AlexBiederer/SEDBRepo/blob/master/generator/backend/sql/schema.sql) zu finden.
Die aggregierten Daten wurden mithilfe einer [SQL-Query](https://github.com/AlexBiederer/SEDBRepo/blob/master/generator/backend/sql/DeaggreggateSQL.sql) deaggrigiert. 

Da laut Vorgabe keine Indexe auf den Datenstrukturen verwendet werden durften, wurden um Berechnungen im Rahmen der erlaubten Möglichkeiten zu beschleunigen: 
* nur speichereffiziente Datentypen (shortint) für Referenzen anstatt Strings in den Wahlergebnistabellen verwendet
* Erst- und Zweitstimmen getrennt, aufgeteilt bezüglich der Wahlperiode und reduziert auf kurze Partei- und Wahlkreisreferenzen gespeichert (Um die Reaggregation zu beschleunigen)

### Verwendete Daten
Als Grundlage für die Berechnung der Zusammensetzung des Bundestags wurden die [offiziellen Wahlergebnisse des Bundeswahlleiters von 2017](https://www.bundeswahlleiter.de/dam/jcr/72f186bb-aa56-47d3-b24c-6a46f5de22d0/btw17_kerg.csv) verwendet.
Hier liegen die Wahlergebnisse in bereits aggergierter Form vor.

Um die Performance der Datenbanken testen zu können, wurden die Wahldaten per SQL deaggregiert und gespeichert.
Das Deaggregieren (und Einfügen von 4 * 40.000.000 Einträgen) dauert ca 5min.  

### Berechnung der Sitzplatzverteilung
Die Berechnung der Sitzplatzverteilung und der Zusammensetzung des Bundestags funkioniert nach dem [Sainte-Laguë/Schepers-Verfahren](https://www.bundeswahlleiter.de/dam/jcr/992a9841-b869-49a6-b7b9-0b1366bf2589/btw17_erl_sitzzuteilung.pdf), welches allerdings nicht nach dem Divisorverfahren, sondern nach dem Höchstzahlverfahren (welches nachgewiesenermaßen identische Ergebnisse liefert) implementiert wurde. Die Implementierung beruht zu 100% auf SQL, und ist deshalb auch sehr performant, sowohl auf aggregierten als auch auf nicht-aggregierten Daten. Die Daten werden in einem Materialized View gespeichert, und auf Anforderung neu aggregiert.
Die implementierung ist im Quellcode dokumentiert [hier](https://github.com/AlexBiederer/SEDBRepo/blob/master/generator/backend/sql/bundestagsmitglieder17_setup.sql) zu finden.

### Berechnung aller weiteren Daten
Alle Anfrage (Knappste Sieger, etc.) wurden in SQL modelliert, und können im Backend mithilfe von statischem Routing durch REST-APIs abgerufen werden: *localhost:3000/db/query/Name_der_Query* . Bei Anfragen mit Parametern (z.B. Wahlkeisübersicht) wurde die SQL Anfrage in einem .js mit Variablem Parameter gespeichert. Diese sind dann unter *localhost:3000/db/customquery/Name_der_Query/?params=Parameter*.
Die Implementierungen der Weiteren Queries sind [hier](https://github.com/AlexBiederer/SEDBRepo/tree/master/generator/backend/sql), bzw. [hier](https://github.com/AlexBiederer/SEDBRepo/tree/master/generator/backend/js/query). 

### Messen der Backend-Performance
Die Performance des Backends wurde mithilfe des Tools [JMeter](http://jmeter.apache.org/) nach den gegebenen Vorgaben gemessen.
Getestet wurde auf einem Rechner mit Intel i7 6600K, auf einer Samsung EVO 500 SSD.
Nach der intialen Messung, welche [hier](https://github.com/AlexBiederer/SEDBRepo/tree/master/Aufgabenblatt_7) zu finden sind, wurde die Datenbank weiter optimiert, und noch bessere Ergebnisse erreicht:

Für t = 1s, n = 10, Wahrscheinlichkeitsverteilung wie gegeben, Testdauer 60s:

|  | Durchschnitt in ms | Mittel in ms | 
| --- |:---:| :---:|
| nicht optimiert | 757 | 43 |
| optimiert      | 367 | 92 |

Detailierte Testergebnisse:

| Query | Durchschnitt in ms |
| --- | --- |
| Q1 | 768 |
| Q2 | 834 |
| Q3 | 97 |
| Q4 | 18 |
| Q5 | 538 |
| Q6 | 42 |

# Dokumentation des Stimmabgabesystems

## Beschreibung der Benutzer-Schnittstelle des Stimmabgabesystems

### Stimmabgabe
![alt text](https://github.com/AlexBiederer/SEDBRepo/blob/master/Abschlusspr%C3%A4sentation/Wahl.png "Stimmabgabe")
Die Darstellung des Digitalen Wahlscheins ist dem realen Wahlschein nachempfunden.
So werden auf der Linken Seite alle im Wahlkreis kandidierenden Erstkandidaten, auf der Linken Seite alle im Wahlkreis antretenden Parteien angezeigt.
Beim Klick auf eine der Möglichkeiten wird diese ausgewählt, und die vorher getroffene Wahl wieder entfernt. So werden versehentliche Invalidierungen des Stimmzettels vermieden.
Falls ein Wähler dennoch eine ungültige Erst- oder Zweitstimme abgeben möchte, kann er dies durch die Auswahl von *Ungültig stimmen* tun.
Um seine Stimme abzugeben, muss der Wähler dann noch *Bestätigen* auswählen.
Im Falle von ungültigen Stimmen (bewusst oder unbewusst) wird der Wähler noch einmal gewarnt.
![Bild konnte nicht geladen werden](https://github.com/AlexBiederer/SEDBRepo/blob/master/Abschlusspr%C3%A4sentation/Stimmabgabe%20-%20ung%C3%BCltig.png "Stimmabgabe")


