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
In den Listen kann nach beliebigen Einträgen gefiltert und sortiert werden.
