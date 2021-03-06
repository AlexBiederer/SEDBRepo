# Wahlsystem - Dokumentation
Felix Schwarzmeier und Alex Biederer.

## Inhaltsverzeichnis
1. [Zielsetzung](#zielsetzung)
2. [Highlights](#highlights)
3. [Zielsetzung](#zielsetzung)
4. [Lastenheft](#lastenheft)
5. [Pflichtenheft](#pflichtenheft)
6. [Dokumentation des Wahlinformationssystems](#dokumentation-des-wahlinformationssystems)
    1. [Beschreibung der Benutzer-Schnittstelle](#beschreibung-der-benutzer-schnittstelle)
    2. [Technische Umsetzung](#technische-umsetzung)
7. [Dokumentation des Stimmabgabesystems](#dokumentation-des-stimmabgabesystems)
    1. [Beschreibung der Benutzer-Schnittstelle](#beschreibung-der-benutzer-schnittstelle-1)
    2. [Technische Umsetzung](#technische-umsetzung-1)
8. [Installation](#installation)


## Zielsetzung
Das Wahlinformationssystem soll prototypisch mehrere Anwendungsfälle explorieren: 
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

<kbd><img src="https://github.com/AlexBiederer/SEDBRepo/blob/master/Abschlusspr%C3%A4sentation/Bundestag.png"/></kbd>

Oben rechts ist die Option zum Umschalten zwischen voraggregierten und nicht-aggregierten Daten angezeigt (Rohdaten verwenden).
Wenn auf den Aggregierten Daten gearbeitet wird, so werden die Anfragen auf bereits voraggregierten Wahldaten ausgeführt.
Sobald auf die nicht-aggregierten Daten gewechselt wird, werden die Anfragen auf nicht-aggregierten Daten ausgeführt. Dies führt dazu, dass diese auch deutlich länger für die Berechnung der Ergebnisse benötigen.

<kbd><img src="https://github.com/AlexBiederer/SEDBRepo/blob/master/Abschlusspr%C3%A4sentation/Rohdaten2.png"/></kbd>

<kbd><img src="https://github.com/AlexBiederer/SEDBRepo/blob/master/Abschlusspr%C3%A4sentation/Rohdaten1.png"/></kbd>

In den Listen kann nach beliebigen Einträgen gefiltert und sortiert werden, sowie die Anzahl der angezeigten Einträge angepasst werden. 

### Bundesland
<kbd><img src="https://github.com/AlexBiederer/SEDBRepo/blob/master/Abschlusspr%C3%A4sentation/Bundesland2.png"/></kbd>

Auf dem Tab Bundesland eine Navigierbare und Zoombare Karte mit den Bundesländern Deutschlands, sowie daneben eine Liste mit allen Wahlkreisen angezeigt. Die Liste ist wie immer filter-, sortier- und in der Größe anpassbar. Diese Seite dient dazu, einen bestimmten Wahlkreis für die Wahlkreis-Ansicht auszuwählen. Dazu wird in der Liste auf der rechten Seite der gewünschte Wahlkreis ausgewählt. Daraufhin erfolgt automatisch der Übergang zur Wahlkreis-Ansicht.

### Wahlkreis
In der Wahlkreis-Ansicht (Tab Wahlkreis) werden alle Daten bezüglich eines gewählten Wahlkreises, wie der gewählte Direktkandidat, die Gewinnerparteien, die Anzahl der berechtigten Wähler, die Anzahl der gültigen und ungültigen Erst-und Zweitstimmen tabellarisch dargestellt. Außerdem werden die Ergebnisse der Wahl, sowie der Vergleich der Ergebnisse mit den Ergebnissen der Vorperiode in Form zweier Balkendiagramme für die Erst- und Zweitstimmen angezeigt.

<kbd><img src="https://github.com/AlexBiederer/SEDBRepo/blob/master/Abschlusspr%C3%A4sentation/Wahlkreis.png"/></kbd>

Für genauere Details zu den Wahlergebnissen einer Partei kann in den Balkgendiagrammen per Tooltip das Wahlergebnis der jeweiligen Partei in % und Anzahl der Stimmen jeweils wieder im Vergleich zur Vorperiode entnommen werden.

Auch auf der Wahlkreis-Ansicht findet sich oben rechts wieder ein Umschalter, der auch hier wieder zwischen der Berechnung aus aggregierten und nicht-aggregierten Daten umschaltet. 

### Knappste Sieger
<kbd><img src="https://github.com/AlexBiederer/SEDBRepo/blob/master/Abschlusspr%C3%A4sentation/Knappste%20Sieger.png"/></kbd>

Auf dem Tab Knappste Sieger werden die (bis zu) 10 Knappsten Sieger einer Partei mit der Anzahl der Stimmen Vorsprung (-) angezeigt. Für den Fall dass eine Partei keine 10 Kandidaten im Bundestag hat, wird mit knappsten Verlierern (+) aufgefüllt.
Über der Liste findet sich ein Feld, wo eine Partei (gesucht und) ausgewählt werden kann.
Wieder kann in der Liste sortiert und gefiltert werden.

### Sonstiges
<kbd><img src="https://github.com/AlexBiederer/SEDBRepo/blob/master/Abschlusspr%C3%A4sentation/Sonstiges.png"/></kbd>

Auf dem Tab Sonstiges finden sich die Ergebnisse der Zusatzaufgaben. Dafür ist oben eine Liste, welche die Auswertung der Fragestellungen über das vorhandenseien eines Frauenbonus, den/die "ökonimischste/n" Kandidat/in (welche/r es mit dem geringsten Vorsprung in den Bundestag geschafft hat), sowie den Wahlkreis mit der größten Diskrepanz zwischen Erst- und Zweitstimme pro Partei, vorhanden.

## Technische Umsetzung
### Verwendete Technologien
Für das Frontend wurde Javascript und D3 zur Darstellung der Grafiken, für das Backend Node.js verwendet.
Die Daten werden in einer Postgres-Datenbank gespeichert.

### Verwendetes Datenschema
<kbd><img src="https://github.com/AlexBiederer/SEDBRepo/blob/master/Aufgabenblatt_1/umlDiagram.png"/></kbd>

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

## Datenschutz

Stimmdaten werden anonymisiert und ohne Zusammenhang zwischen Erst- und Zweitstimme gespeichert, sodass keine Rückschlüsse auf einzelne Wähler gemacht werden können.
Zudem werden keinerlei weitere Wählerdaten gespeichert.
Die Kandidaten, welche im Wahlinformationssystem angezeigt werden, müssen diese beim Kandidieren öffentlich machen, also sind diese Datenschutztechnisch unbedenklich.  

# Dokumentation des Stimmabgabesystems

Das Wahlinformationssystem soll zum Sammeln von Stimmen ähnlich dem Herkömmlichen Verfahren angewendet werden.
Dafür bekommt jedem Wähler ein 64-stelliger Code (codiert als QR-Code), welcher informationen zum Wahlkreis entählt,
und dessen Hash garantiert eindeutig ist zugeteilt.
Die Zuteilung ist zufällig, nur der Wahlkreis muss für jeden Bürger stimmen.
Alle gültigen (und eindeutigen) Hashwerte werden vor der Verteilung der Codes auf Personen gespeichert, um keinen Rückschluss auf diese treffen zu können.
Für den realen Einsatz ist angedacht, pro Wahlkreis eine Datenbank mit Hashes zu generieren.
Wählen funkioniert nun auf 2 Arten: Konventionell und Online:

## Konventionelle Stimmabgabe

Der Wähler betritt das Wahllokal, und muss sich mit Ausweis wie bei dem bisherigen Wahlsystem ausweisen.
Dann bekommt er zufällig einen Code (kann selbst aus einer Urne ziehen), in Papierform ausgeteilt (wie bei Wahlunterlagen auch).
Mit diesem Code kann beim Wahlsystem eine Stimme abgeben: Er scannt den Code ein, und bekommt alle für seinen Wahlkreis gültigen Kandidaten und Parteien
angezeigt. Mit der Abgabe seiner Stimme wird der Hashwert seines Codes ungültig, sodass er nicht noch einmal wählen kann. 

## Online Stimmabgabe

Zusätzlich zur konventionellen Wahl besteht die Möglichkeit, die Wahl online durchzuführen.
Der dafür nötige Code wird (wie bisher), per Brief oder auch online angefordert.
Der Wähler erhält dann wieder einen zufälligen Code zugesandt, mit welchem er Online von Zuhause genau einmal wählen kann.
Der Wahlprozess ist dann der Selbe.

## Beschreibung der Benutzer-Schnittstelle

### Stimmabgabe
<kbd><img src="https://github.com/AlexBiederer/SEDBRepo/blob/master/Abschlusspr%C3%A4sentation/Wahl.png"/></kbd>

Die Darstellung des Digitalen Wahlscheins ist dem realen Wahlschein nachempfunden.
So werden auf der linken Seite alle im Wahlkreis kandidierenden Erstkandidaten, auf der rechten Seite alle im Wahlkreis antretenden Parteien angezeigt. 
Beim Klick auf eine der Möglichkeiten wird diese ausgewählt, und die vorher getroffene Wahl wieder entfernt. So werden versehentliche Invalidierungen des Stimmzettels vermieden.
Falls ein Wähler dennoch eine ungültige Erst- oder Zweitstimme abgeben möchte, kann er dies durch die Auswahl von *Ungültig stimmen* tun.
Um seine Stimme abzugeben, muss der Wähler dann noch *Bestätigen* auswählen.
Im Falle von ungültigen Stimmen (bewusst oder unbewusst) wird der Wähler noch einmal gewarnt.

<kbd><img src="https://github.com/AlexBiederer/SEDBRepo/blob/master/Abschlusspr%C3%A4sentation/Stimmabgabe%20-%20ung%C3%BCltig.png"/></kbd>

Im Falle eines ungültigen Wahlschlüssels (Mehrfachwahl oder Wahlbetrug) wird dem Wähler die Wahl verweigert.

<kbd><img src="https://github.com/AlexBiederer/SEDBRepo/blob/master/Abschlusspr%C3%A4sentation/Stimmabgabe%20-%20schl%C3%BCssel.png"/></kbd>

## Technische Umsetzung

Die Implementierung des Stimmabgabesystems beruht auf den selben Technologien wie die Implementierung des Wahlinformationssystems. Die md5-hashes der gültigen Schlüssel werden in einer Tabelle gespeichert.
Beim Wahlversuch wird eine Datenbank-Funktion- Aufgerufen, welche den Wahlkreis, Wahldaten und einen Schlüssel fordert.
Der Schlüssel wird dann in der Datenbank gehashed, und mit der Liste der gültigen Schlüssel-Hashes verglichen. Im Falle eines Treffers wird in einer Transaktion der Schlüssel zuerst aus der Datenbank gelöscht, und dann die Stimmen eingefügt.
Im *Wahlinformationssystem* werden die aktuellen Stimmdaten nach dem neuaggregieren der Stimmdaten aktualisiert.

## Datenschutz

Alle gültigen (und eindeutigen) Hashwerte werden vor der Verteilung der Codes auf Personen gespeichert, um keinen Rückschluss auf diese treffen zu können.
Zudem werden die Hashes alle gleichzeitig generiert, sodass auch keine Rückschlüsse basierend auf der Erstellungsreihenfolge gemacht werden können.
Wenn ein Schlüssel benutzt und damit ungültig gemacht wird, wird er komplett aus der Datenbank entfernt. Auch damit lässt sich über das Timing kein Rückschluss auf den Wähler herstellen.
Die Codes werden zufällig ausgegeben, bei der Onlinewahl sowie bei der Wahl im Lokal. Theoretisch kann zwar eine Zuordnung von Wählern zu Wahlcodes hergestellt werden, doch dies kann auch mit Markierten Wahlscheinen im bisherigen System erfolgen, und müsste von Seiten des Staates passieren, wovon wir jetzt mal nicht ausgehen.    

## Sicherheitsaspekte
### Schutz vor Wahlbetrug

Ein Code enspricht einem Bogen mit Wahlunterlagen, und wird exakt genau so wie diese bisher verteilt. 
Deshalb gibt es faktisch keine Unterschiede zur konventionellen Wahl, der Schutz vor Wahlbetrug ist genauso hoch. 

### Mehrfache Stimmabgabe

Da ein Code nur 1- Mal verwendet werden kann (und Änderungen am Datenbestand in der richtigen Reihenfolge passieren
, d.h. erst wird ein Hashwert als ungültig gewertet, dann erst die Stimme eingefügt), kann ein Benutzer mit nur einem Code nur 1 mal abstimmen.
Codes zu stehlen entpräche dem Diebstahl von Wahlunterlagen, was im Lokal genauso schwierig ist wie bei der Konventionellen Wahl.
Codes aus der Post von Mitbürgern zu stehlen entspräche dem Diebstahl von Briefwahlunterlagen und dem Fälschen von Unterschriften, 
ist so also sicherheitstechnisch etwas bedenklicher.

### Stimmabgabe duch nicht-autorisierte Personen

Siehe [Mehrfache Stimmabgabe](#mehrfache-stimmabgabe)

### SQL-Injection

Alle Interaktion mit dem System passiert auf Browser-Ebene, dem Wähler stehen keine Freitextfelder zur Verfügung. SQL-Injection ist somit unmöglich.

### Ausspähen / Manipulation der Kommunikation

Mithilfe eines Man-in-the-middle Angriffes könnten Betrüger einen Gültigen Stimmbefehl abfangen, und die Stimmdaten verändern, den Schlüssel aber gleich lassen, oder einfach das Paket blockieren (damit der Schlüssel nicht invalidiert wird) und den Schlüssel auslesen. Alternativ könnten Angreifer einfach die Kommunikation auslesen, und so Rückschlüsse auf die Wähler machen, die zu der Zeit z.B. im Wahllokal waren. Um dies zu verhindern muss die Kommunikation mit dem Wahlserver verschlüsselt erfolgen. Damit sind diese Art von Angriffen ausgeschlossen.

### Manipulation des Wahlcomputers

Selbst bei einer Manipulation des Wahlrechners kann die Datenbasis nur mit einem gültigen Code verändert werden. 
Diese Codes sind von keinem System aus abrufbar, und werden nur intern zur Validierung verwendet.
Die Wahlrechner sind für die Wahl nichts weiter als Browser.
Dennoch müssen diese vor Manipulation geschützt werden, da ansonsten z.B. die Kommunikation einfach Manipuliert werden kann (siehe [Ausspähen / Manipulation der Kommunikation](#sicherheitsaspekte).)

# Installation

Um das Wahlsystem zu installieren, wird das Repository gecloned, dann im *backend* Ordner:

`npm install` (um alle Dependencies herunterzuladen)

`npm run start` (um den Node-Webserver zu starten)

Das System ist dann unter *localhost:3000* erreichbar.

Damit Änderungen im Frontend wirksam werden, müssen im *frontend* Ordner folgende Befehle ausgeführt werden:

`npm install` (um alle Dependencies herunterzuladen)

`npm run buildProduction` (um eine neue "bundle"-app.js zu erstellen, die vom Node-Server an den Client geschickt wird)


Um das System verwenden zu können, muss dann noch die Datenbank aufgesetzt werden.
Dafür wird mit *pg-admin* eine neue Datenbank angelegt, und dann über *restore* das file [wahlschema](https://1drv.ms/u/s!AthH0l5R8rvUjJZag-4Ig6bWQr30MA) als .tar in die Datenbank geladen.
Im [db-connector](https://github.com/AlexBiederer/SEDBRepo/blob/master/generator/backend/js/dbConnector.js) werden dann die Zugangsdaten entsprechend angepasst. 
