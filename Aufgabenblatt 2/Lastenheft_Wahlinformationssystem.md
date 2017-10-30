## Lastenheft - Wahlinformationssystem

### Benutzer-Schnittstelle
* Interaktives Web-Interface
* Graphische Daten-Visualisierung der Wahlergebnisse (Pie-charts, D3.js)

### Funktionale Anforderungen
* Ermöglicht effiziente Analysen des Wahlergebnisses der Bundestagswahl 2017:
	* Anzeige der Direktmandate pro Bundesland/Wahlkreis
	* Anzahl Gültige/Ungültige Stimmen pro Bundesland/Wahlkreis
	* Sitzverteilung/Mitglieder im Bundestag
	* Eigene konfigurierbare Anfragen (z.B. über SQL)
* Korrektheit der Ergebnisse
	* Ergebnisse identisch zu den offiziellen Auswertungen
* Berücksichtichtigung von juristischen Ausnahmefällen:
	* Sperrklausel (“5%-Hürde“) oder mind. 3 Direktmandate
	* Überhangsmandate
	* Ausgleichsmandate
* Verwendung des Systems als Backend für die elektronische Stimmabgabe im Wahllokal
	* Einfügen neuer Stimmen
* Ermöglicht die Ergebnisse der Wahl 2017 mit den der Wahl 2013 zu vergleichen
* Ermöglicht das Durchspielen von möglichen Szenarien (Bildung von möglichen Koalitionen, Wählerwanderung, Auswirkungen von neu hinzugefügten Wählerstimmen)
* Datenschutzrechtlich unbedenklich
	* Stimmen werden anonymisiert und Erst-und Zweitstimme getrennt gespeichert
* Systemdokumentation

### Nicht-funktionale Anforderungen
* Sicherheit/Manipulationsschutz
* Verwendung der offiziellen Endergebnisse der Wahlen von 2017/2013 auf [bundeswahlleiter.de](https://www.bundeswahlleiter.de/)
* Lauffähig auf der aktuellen Chrome-Version
* Intuitiv zu bedienendes User-Interface (evtl. Usability-Test)
* Performance
* Bildrechte

### Abnahmekriterien
* Ein Benutzer kann bestehende Daten auf alle oben Genannten aspekte hin analysieren.
* Dabei sind die Resultate konform zu den offiziellen Ergebnissen.
* Auch alle Ausnahmefälle, wie die Sperrklasuel, Überhangs- oder Ausgleichsmandate werden berücksichtigt.
* Das Wahlinformationssystem kann als Backend für die elektronische Stimmabgabe im Wahllokal verwendet werden.
* Dabei Können einfach neue Stimmen zum System hinzugefügt werden.
* Die Wahlergebnisse und alle Abfragen können mit den Ergebnissen von der Wahl 2013 verglichen werden.
* Mögliche Szenarien wie Koalitionen usw. können durchgespielt werden.
* Dabei erfüllt das System auch alle Datenschutzrechtlichen Vorgaben.
* Die Benutzung und der Aufbau des Systems muss ausreichend dokumentiert sein.
* Das System soll auf die offiziellen Wahlergebnisse vom Bundeswahlleiter zurückgreifen.
* Das System muss auf der aktuellsten Chrome-version laufen.
* Ein Benutzer muss die Bedienung des Sytems nach dem Lesen der Dokumentation oder intuitiv verstanden haben.
* Das System muss auf der aktuellsten Chrome-Version Abfragen in unter 2000ms beantworten können.
* Das System muss alle Anforderungen bezüglich Copyright erfüllen.

