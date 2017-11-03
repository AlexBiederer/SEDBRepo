## Pflichteneft - Wahlinformationssystem

### Zielsetzung - Musskriterien
 * Das System muss die Wahlergebnisse der Bundestagswahl 2017 analysieren können:
	* Anzeige der Direktmandate pro Bundesland/Wahlkreis
	* Anzahl Gültige/Ungültige Stimmen pro Bundesland/Wahlkreis
	* Sitzverteilung/Mitglieder im Bundestag
	
* Die Ergebnisse der Bundestagswahl 2017 müssen mit denen der Bundestagswahl 2013 verglichen werden können

* Die Korrektheit der Endergebnisse der Bundestagswahlen von 2017/2013 muss gewährleistet sein

* Juristische Ausnahmefälle müssen berücksichtigt werden:
	* Sperrklausel (“5%-Hürde“) oder mind. 3 Direktmandate
	* Überhangsmandate
	* Ausgleichsmandate

* Das System muss alle datenschutzrechtlichen Vorgaben erfüllen

* Die Urheber/Lizenzen aller Bilder (Parteilogos, Profilbilder der Direktkandidaten) müssen, fall notwenig, korrekt angegeben werden


### Zielsetzung - Sollkriterien 

* Eigene konfigurierbare Anfragen sollen an die Datenbank gestellt werden können

* Mögliche Szenarien (Bildung von möglichen Koalitionen, Auswirkung von neu hinzugefügten Wählerstimmen) sollen durchgespielt werden können

* Das System soll als Backend für die elektronische Stimmabgabe im Wahllokal in Zukunft verwendet werden können

* Die Benutzung und der Aufbau des Systems sollen ausreichend dokumentiert sein 

* Das System soll stets auf der aktuellsten Chrome-Version lauffähig sein/bleiben 

### Zielsetzung - Kannkriterien
* Weitere Szenarien (z.B. Wählerwanderung) können durchgespielt werden

### Abgrenzungskriterien
* Das System soll keine weiteren Endergebnisse von Bundestagswahlen (bis auf die Bundestagswahl 2013) als Vergleichswerte heranziehen

### Technische Umsetzung

* Datenbankmanagementsystem (DBMS): PostgreSQL
* Frontend: JavaScript mit [D3.js](https://d3js.org/) für Daten-Visualisierungen (Pie-charts etc.); [Bootstrap](http://getbootstrap.com/) als CSS frontend framework 
* Backend: Node.js als Webserver und zur Anbindung an das DBMS. 
* Benötigten Daten können vom Backend zum Frontend, eigene Anfragen vom Frontend zum Backend mittels REST-API geschickt werden. Der Node-Webserver schickt die HTML-Seite sowie die benötigten JavaScript Dateien an den Client. Alle zusätzlich benötigten Bibliotheken/Frameworks werden vom Client über ein Content Delivery Network (CDN) geladen.

### GUI-Mockups
@TODO

### UML-Diagram
![UML-Diagram](../Aufgabenblatt%201/umlDiagram.png)


