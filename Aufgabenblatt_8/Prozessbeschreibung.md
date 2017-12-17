# Prozessbeschreibung

Das Wahlinformationssystem soll zum Sammeln von Stimmen ähnlich dem Herkömmlichen Verfahren angewendet werden.
Dafür bekommt jedem Wähler ein 64-stelliger Code (codiert als QR-Code), welcher informationen zum Wahlkreis entählt,
und dessen Hash garantiert eindeutig ist zugeteilt.
Die Zuteilung ist zufällig, nur der Wahlkreis muss für jeden Bürger stimmen.
Alle gültigen (und eindeutigen) Hashwerte werden vor der Verteilung der Codes auf Personen gespeichert, um keinen Rückschluss auf diese treffen zu können.
Wählen funkioniert nun auf 2 Arten: Konventionell und Online:

## Konventionelle Stimmabgabe

Der Wähler betritt das Wahllokal, und muss sich mit Ausweis wie bei dem bisherigen Wahlsystem ausweisen.
Dann bekommt er zufällig einen Code, in Papierform ausgeteilt (wie bei Wahlunterlagen auch).
Mit diesem Code kann beim Wahlsystem eine Stimme abgeben: Er scannt es ein, und bekommt alle für seinen Wahlkreis gültigen Kandidaten und Parteien
angezeigt. Mit der Abgabe seiner Stimme wird der Hashwert seines Codes als ungültig markiert, sodass er nicht noch einmal wählen kann. 

## Online Stimmabgabe

Zusätzlich zur konventionellen Wahl besteht die Möglichkeit, die Wahl online durchzuführen.
Der dafür nötige Code wird (wie bisher), per Brief oder auch online angefordert.
Der Wähler erhält dann wieder einen zufälligen Code zugesandt, mit welchem er Online von zuhause 1 mal wählen kann.

## Schutz vor Wahlbetrug

Ein Code enspricht einem Bogen mit Wahlunterlagen, und wird exakt genau so wie diese bisher verteilt. 
Deshalb gibt es faktisch keine Unterschiede zur konventionellen Wahl, der Schutz vor Wahlbetrug ist genauso hoch. 

### Mehrfache Stimmabgabe

Da ein Code nur 1- Mal verwendet werden kann (und Änderungen am Datenbestand in der richtigen Reihenfolge passieren
, d.h. erst wird ein Hashwert als ungültig gewertet, dann erst die Stimme eingefügt), kann ein Benutzer mit nur einem Code nur 1 mal abstimmen.
Codes zu stehlen entpräche dem Diebstahl von Wahlunterlagen, was im Lokal genauso schwierig ist wie bei der Konventionellen Wahl.
Codes aus der Post von Mitbürgern zu stehlen entspräche dem Diebstahl von Briefwahlunterlagen und dem Fälschen von Unterschriften, 
ist so also sicherheitstechnisch etwas bedenklicher.

### Stimmabgabe duch nicht-autorisierte Personen

Siehe Mehrfache Stimmabgabe

### SQL-Injection

Alle Interaktion mit dem System passiert auf Browser-Ebene, dem Wähler stehen keine Freitextfelder zur Verfügung. SQL-Injection ist somit unmöglich.

### Manipulation des Wahlcomputers

Selbst bei einer Manipulation des Wahlrechners kann die Datenbasis nur mit einem gültigen Code verändert werden. 
Diese Codes sind von keinem System aus abrufbar, werden nur intern zur Validierung verwendet. 
