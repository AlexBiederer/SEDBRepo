# SEDBRepo
Hier liegen alle Daten für das Wahlinformattionssystem von Felix und Alex.

## Dokumentation
Dies ist die Benutzerdokumentation für das Wahlinformationssystem.
In dieser Version sind der Übersichtlichkeit alle Systemteile über die selbe Benutzerüberfläche verfügbar.
In einer kommerziellen Version werden beide Teile natürlich strikt getrennt werden.

### Angebotene Funktionalität
* Interaktives Web-Interface
* Graphische Daten-Visualisierung der Wahlergebnisse (Pie-charts, D3.js)
* Ermöglicht effiziente Analysen des Wahlergebnisses der Bundestagswahl 2017:
	* Anzeige der Direktmandate pro Bundesland/Wahlkreis
	* Anzahl Gültige/Ungültige Stimmen pro Bundesland/Wahlkreis
	* Sitzverteilung/Mitglieder im Bundestag
	* Eigene konfigurierbare Anfragen (z.B. über SQL)
* Korrektheit der Ergebnisse
  * Verwendung der offiziellen Stimmdaten der Wahlen von 2017/2013 auf [bundeswahlleiter.de](https://www.bundeswahlleiter.de/)
	* Ergebnisse identisch zu den offiziellen Auswertungen
* Berücksichtichtigung von juristischen Ausnahmefällen:
	* Sperrklausel (“5%-Hürde“) oder mind. 3 Direktmandate
	* Überhangsmandate
	* Ausgleichsmandate
* Verwendung des Systems als Backend für die elektronische Stimmabgabe im Wahllokal
	* Einfügen neuer Stimmen
* Ermöglicht die Ergebnisse der Wahl 2017 mit den der Wahl 2013 zu vergleichen
* Datenschutzrechtlich unbedenklich
	* Stimmen werden anonymisiert und Erst-und Zweitstimme getrennt gespeichert
* Sicherheit / Manipulationsschutz bei der Stimmabgabe

### Beschreibung der Benutzer-Schnittstelle
Das Wahlinformationssystem ist aufgegliedert auf 5 Seiten, welche von der Navigationsbar oben auf der Seite navigierbar sind:
1. Bundestag
2. Bundesland
3. Wahlkreis
4. Knappste Sieger
5. Sonstiges

#### Bundestag
Auf der Startseite des Wahlsystems (im Tab Bundestag) ist die Auswertung der vorliegenden Stimmdaten zu sehen.
Dabei werden angezeigt: 
1. Ein Kuchendiagramm zur Darstellung der Sitzplatzverteilung und der Zusammensetzung des Bundestags, gruppiert nach Parteien
2. Eine Detailansicht zur Darstellung der Sitzplatzverteilung und der Zusammensetzung des Bundestags, gruppiert nach Parteien
3. Eine Liste mit allen gewählten Abgeordneten
4. Eine Liste mit der Anzahl aller Vergebenen Überhangmandate gruppoert nach Parteien und Bundesland

Oben rechts ist die Option zum Umschalten zwischen voraggregierten und nicht-aggregierten Daten angezeigt (Rohdaten verwenden).
Wenn auf den Aggregierten Daten gearbeitet wird, so werden die Anfragen auf bereits voraggregierten Wahldaten ausgeführt.
Sobald auf die nicht-aggregierten Daten gewechselt wird, werden die Anfragen auf nicht-aggregierten Daten ausgeführt. Dies führt dazu, dass diese auch deutlich länger für die Berechnung der Ergebnisse benötigen.

In den Listen kann nach beliebigen Einträgen gefiltert und sortiert werden, sowie die Anzahl der angezeigten Einträge angepasst werden. 

#### Bundesland
Auf dem Tab Bundesland eine Navigierbare und Zoombare Karte mit den Bundesländern Deutschlands, sowie daneben eine Liste mit allen Wahlkreisen angezeigt. Die Liste ist wie immer filter-, sortier- und in der Größe anpassbar. Diese Seite dient dazu, einen bestimmten Wahlkreis für die Wahlkreis-Ansicht auszuwählen. Dazu wird in der Liste auf der rechten Seite der gewünschte Wahlkreis ausgewählt. Daraufhin erfolgt automatisch der Übergang zur Wahlkreis-Ansicht.

#### Wahlkreis
In der Wahlkreis-Ansicht (Tab Wahlkreis) werden alle Daten bezüglich eines gewählten Wahlkreises, wie der gewählte Direktkandidat, die Gewinnerparteien, die Anzahl der berechtigten Wähler, die Anzahl der gültigen und ungültigen Erst-und Zweitstimmen tabellarisch dargestellt. Außerdem werden die Ergebnisse der Wahl, sowie der Vergleich der Ergebnisse mit den Ergebnissen der Vorperiode in Form eines Balkendiagramms angezeigt.

Für genauere Details zu den Wahlergebnissen einer Partei kann im Balkgendiagramm per Tooltip das Wahlergebnis der jeweiligen Partei in % und Anzahl der Stimmen jeweils wieder im Vergleich zur Vorperiode entnommen werden.

Auch auf der Wahlkreis-Ansicht findet sich oben rechts wieder ein Umschalter, dir auch hier wieder zwischen der Berechnung aus aggregierten und nicht-aggregierten Daten umschaltet. 

#### Knappste Sieger
Auf dem Tab Knappste Sieger werden die (bis zu) 10 Knappsten Sieger einer Partei mit der Anzahl der Stimmen Vorsprung (-) angezeigt. Für den Fall dass eine Partei keine 10 Kandidaten im Bundestag hat, wird mit knappsten Verlierern (+) aufgefüllt.
Über der Liste findet sich ein Feld, wo eine Partei (gesucht und) ausgewählt werden kann.
Wieder kann in der Liste sortiert und gefiltert werden.

#### Sonstiges
Auf dem Tab Sonstiges finden sich die Ergebnisse der Zusatzaufgaben. Dafür ist oben eine Liste, welche die Auswertung der Fragestellungen über das vorhandenseien eines Frauenbonus, den/die "ökonimischste/n" Kandidat/in (welche/r es mit dem geringsten Vorsprung in den Bundestag geschafft hat), sowie den Wahlkreis mit der größten Diskrepanz zwischen Erst- und Zweitstimme pro Partei, vorhanden.

### Beschreibung der Implementierung
#### Verwendete Technologien
Für das Frontend wurde Javascript und D3 zur Darstellung der Grafiken, für das Backend Node.js verwendet.
Die Daten werden in einer Postgres-Datenbank gespeichert.

#### Verwendetes Datenschema
![alt text] (https://github.com/AlexBiederer/SEDBRepo/blob/master/Aufgabenblatt_1/umlDiagram.png "Verwendetes Datenbankschema")

Um das Schema in der Datenbank gut umzusetzen, wurde das Schema in der Datenbank 2 mal angelegt, einmal für die Ergebnisse von 2013, und einmal für die Ergebnisse von 2017. Die Stimmen sind sowohl aggregiert, als auch nicht-aggregiert abgespeichert.

Um Berechnungen im Rahmen der erlaubten Möglichkeiten zu beschleunigen, wurden 
* keine Indexe verwendet!
* speichereffiziente Datentypen verwendet
* nur speichereffiziente Datentypen für Referenzen anstatt Strings in den Wahlergebnistabellen verwendet
* Erst- und Zweitstimmen getrennt, aufgeteilt bezüglich der Wahlperiode und reduziert auf kurze Partei- und Wahlkreisreferenzen gespeichert (Um die aggregation zu beschleunigen)


#### Verwendete Daten
Als Grundlage für die Berechnung der Zusammensetzung des Bundestags wurden die [offiziellen Wahlergebnisse des Bundeswahlleiters von 2017](https://www.bundeswahlleiter.de/dam/jcr/72f186bb-aa56-47d3-b24c-6a46f5de22d0/btw17_kerg.csv) verwendet.
Hier liegen die Wahlergebnisse in bereits aggergierter Form vor.

Um die Performance der Datenbanken testen zu können

#### Berechnung der Sitzplatzverteilung
Die Berechnung der Sitzplatzverteilung und der Zusammensetzung des Bundestags funkioniert nach dem [Sainte-Laguë/Schepers-Verfahren](https://www.bundeswahlleiter.de/dam/jcr/992a9841-b869-49a6-b7b9-0b1366bf2589/btw17_erl_sitzzuteilung.pdf), welches allerdings nicht nach dem Divisorverfahren, sondern nach dem Höchstzahlverfahren (welches nachgewiesenermaßen identische Ergebnisse liefert) implementiert wurde. Die Implementierung beruht zu 100% auf SQL, und ist sehr performant. 

