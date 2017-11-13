DROP TABLE IF EXISTS bundesland CASCADE;
DROP TABLE IF EXISTS wahlkreis CASCADE;
DROP TABLE IF EXISTS partei CASCADE;
DROP TABLE IF EXISTS wahlkreis13 CASCADE;
DROP TABLE IF EXISTS wahlkreis17 CASCADE;
DROP TABLE IF EXISTS partei13 CASCADE;
DROP TABLE IF EXISTS partei17 CASCADE;
DROP TABLE IF EXISTS kandidat13 CASCADE;
DROP TABLE IF EXISTS kandidat17 CASCADE;
DROP TABLE IF EXISTS liste13 CASCADE;
DROP TABLE IF EXISTS liste17 CASCADE;
DROP TABLE IF EXISTS direkt13 CASCADE;
DROP TABLE IF EXISTS direkt17 CASCADE;
DROP TABLE IF EXISTS aggErst13;
DROP TABLE IF EXISTS aggErst17;
DROP TABLE IF EXISTS aggZweit13;
DROP TABLE IF EXISTS aggZweit17;
DROP TABLE IF EXISTS erst13;
DROP TABLE IF EXISTS erst17;
DROP TABLE IF EXISTS zweit13;
DROP TABLE IF EXISTS zweit17;

CREATE TABLE bundesland (
  id integer PRIMARY KEY,
  name text NOT NULL,
  numEinwoehner integer NOT NULL
);

CREATE TABLE wahlkreis13 (
  id integer PRIMARY KEY,
  name text NOT NULL,
  bundesland integer references bundesland(id),
  numWahlb integer NOT NULL,
  numGueltigeErst integer NOT NULL,
  numGueltigeZweit integer NOT NULL,
  numUngueltigeErst integer NOT NULL,
  numUngueltigeZweit integer NOT NULL
);

CREATE TABLE wahlkreis17 (
  id integer PRIMARY KEY,
  name text NOT NULL,
  bundesland integer references bundesland(id),
  numWahlb integer NOT NULL,
  numGueltigeErst integer NOT NULL,
  numGueltigeZweit integer NOT NULL,
  numUngueltigeErst integer NOT NULL,
  numUngueltigeZweit integer NOT NULL
);

CREATE TABLE partei13 (
  id integer PRIMARY KEY,
  name text NOT NULL,
  abk text,
  fraktion text
);

CREATE TABLE partei17 (
  id integer PRIMARY KEY,
  name text NOT NULL,
  abk text,
  fraktion text
);

CREATE TABLE kandidat13 (
  id integer PRIMARY KEY,
  titel text,
  vorname text NOT NULL,
  name text NOT NULL,
  geschlecht text NOT NULL,
  gebjahr integer,
  gebort text,
  beruf text,
  wahlSlogan text,
  bildURL text,
  partei integer references partei13(id)
);

CREATE TABLE kandidat17 (
  id integer PRIMARY KEY,
  titel text,
  vorname text NOT NULL,
  name text NOT NULL,
  geschlecht text NOT NULL,
  gebjahr integer,
  gebort text,
  beruf text,
  wahlSlogan text,
  bildURL text,
  partei integer references partei17(id)
);

CREATE TABLE direkt13 (
  kandidat integer references kandidat13(id),
  wahlkreis integer references wahlkreis13(id)
);

CREATE TABLE direkt17 (
  kandidat integer references kandidat17(id),
  wahlkreis integer references wahlkreis17(id)
);

CREATE TABLE liste13 (
  kandidat integer references kandidat13(id),
  bundesland integer references bundesland(id),
  partei integer references partei13(id),
  platz integer NOT NULL
);

CREATE TABLE liste17 (
  kandidat integer references kandidat17(id),
  bundesland integer references bundesland(id),
  partei integer references partei17(id),
  platz integer NOT NULL
);

CREATE TABLE aggErst13 (
  partei integer references partei13(id),
  wahlkreis integer references wahlkreis13(id),
  numStimmen integer NOT NULL
);

CREATE TABLE aggErst17 (
  partei integer references partei17(id),
  wahlkreis integer references wahlkreis17(id),
  numStimmen integer NOT NULL
);

CREATE TABLE aggZweit13 (
  partei integer references partei13(id),
  wahlkreis integer references wahlkreis13(id),
  numStimmen integer NOT NULL
);

CREATE TABLE aggZweit17 (
  partei integer references partei17(id),
  wahlkreis integer references wahlkreis17(id),
  numStimmen integer NOT NULL
);

CREATE TABLE erst13 (
  partei integer references partei13(id),
  wahlkreis integer references wahlkreis13(id)
);

CREATE TABLE erst17 (
  partei integer references partei17(id),
  wahlkreis integer references wahlkreis17(id)
);

CREATE TABLE zweit13 (
  partei integer references partei13(id),
  wahlkreis integer references wahlkreis13(id)
);

CREATE TABLE zweit17 (
  partei integer references partei17(id),
  wahlkreis integer references wahlkreis17(id)
);
/* Einfügen aller bundesländer*/
INSERT INTO bundesland (id, name) VALUES (1, 'Schleswig-Holstein');
INSERT INTO bundesland (id, name) VALUES (13, 'Mecklenburg-Vorpommern');
INSERT INTO bundesland (id, name) VALUES (2, 'Hamburg');
INSERT INTO bundesland (id, name) VALUES (3, 'Niedersachsen');
INSERT INTO bundesland (id, name) VALUES (4, 'Bremen');
INSERT INTO bundesland (id, name) VALUES (12, 'Brandenburg');
INSERT INTO bundesland (id, name) VALUES (15, 'Sachsen-Anhalt');
INSERT INTO bundesland (id, name) VALUES (11, 'Berlin');
INSERT INTO bundesland (id, name) VALUES (5, 'Nordrhein-Westfalen');
INSERT INTO bundesland (id, name) VALUES (14, 'Sachsen');
INSERT INTO bundesland (id, name) VALUES (6, 'Hessen');
INSERT INTO bundesland (id, name) VALUES (16, 'Thüringen');
INSERT INTO bundesland (id, name) VALUES (7, 'Rheinland-Pfalz');
INSERT INTO bundesland (id, name) VALUES (9, 'Bayern');
INSERT INTO bundesland (id, name) VALUES (8, 'Baden-Württemberg');
INSERT INTO bundesland (id, name) VALUES (10, 'Saarland');

/* Einfügen aller Parteien von 2017*/
INSERT INTO partei17 (id, name) VALUES (0, 'Christlich Demokratische Union Deutschlands');
INSERT INTO partei17 (id, name) VALUES (1, 'Sozialdemokratische Partei Deutschlands');
INSERT INTO partei17 (id, name) VALUES (2, 'DIE LINKE');
INSERT INTO partei17 (id, name) VALUES (3, 'BÜNDNIS 90/DIE GRÜNEN');
INSERT INTO partei17 (id, name) VALUES (4, 'Christlich-Soziale Union in Bayern e.V.');
INSERT INTO partei17 (id, name) VALUES (5, 'Freie Demokratische Partei');
INSERT INTO partei17 (id, name) VALUES (6, 'Alternative für Deutschland');
INSERT INTO partei17 (id, name) VALUES (7, 'Piratenpartei Deutschland');
INSERT INTO partei17 (id, name) VALUES (8, 'Nationaldemokratische Partei Deutschlands');
INSERT INTO partei17 (id, name) VALUES (9, 'FREIE WÄHLER');
INSERT INTO partei17 (id, name) VALUES (10, 'PARTEI MENSCH UMWELT TIERSCHUTZ');
INSERT INTO partei17 (id, name) VALUES (11, 'Ökologisch-Demokratische Partei');
INSERT INTO partei17 (id, name) VALUES (12, 'Partei für Arbeit, Rechtsstaat, Tierschutz, Elitenförderung und basisdemokratische Initiative');
INSERT INTO partei17 (id, name) VALUES (13, 'Bayernpartei');
INSERT INTO partei17 (id, name) VALUES (14, 'Ab jetzt...Demokratie durch Volksabstimmung');
INSERT INTO partei17 (id, name) VALUES (15, 'Partei der Vernunft');
INSERT INTO partei17 (id, name) VALUES (16, 'Marxistisch-Leninistische Partei Deutschlands');
INSERT INTO partei17 (id, name) VALUES (17, 'Bürgerrechtsbewegung Solidarität');
INSERT INTO partei17 (id, name) VALUES (18, 'Sozialistische Gleichheitspartei, Vierte Internationale');
INSERT INTO partei17 (id, name) VALUES (19, 'DIE RECHTE');
INSERT INTO partei17 (id, name) VALUES (20, 'Allianz Deutscher Demokraten');
INSERT INTO partei17 (id, name) VALUES (21, 'Allianz für Menschenrechte, Tier- und Naturschutz');
INSERT INTO partei17 (id, name) VALUES (22, 'bergpartei, die überpartei');
INSERT INTO partei17 (id, name) VALUES (23, 'Bündnis Grundeinkommen');
INSERT INTO partei17 (id, name) VALUES (24, 'DEMOKRATIE IN BEWEGUNG');
INSERT INTO partei17 (id, name) VALUES (25, 'Deutsche Kommunistische Partei');
INSERT INTO partei17 (id, name) VALUES (26, 'Deutsche Mitte');
INSERT INTO partei17 (id, name) VALUES (27, 'Die Grauen – Für alle Generationen');
INSERT INTO partei17 (id, name) VALUES (28, 'Die Urbane. Eine HipHop Partei');
INSERT INTO partei17 (id, name) VALUES (29, 'Madgeburger Gartenpartei');
INSERT INTO partei17 (id, name) VALUES (30, 'Menschliche Welt');
INSERT INTO partei17 (id, name) VALUES (31, 'Partei der Humanisten');
INSERT INTO partei17 (id, name) VALUES (32, 'Partei für Gesundheitsforschung');
INSERT INTO partei17 (id, name) VALUES (33, 'V-Partei³ - Partei für Veränderung, Vegetarier und Veganer');
INSERT INTO partei17 (id, name) VALUES (34, 'Bündnis C - Christen für Deutschland');
INSERT INTO partei17 (id, name) VALUES (35, 'DIE EINHEIT');
INSERT INTO partei17 (id, name) VALUES (36, 'Die Violetten');
INSERT INTO partei17 (id, name) VALUES (37, 'Familien-Partei Deutschlands');
INSERT INTO partei17 (id, name) VALUES (38, 'Feministische Partei DIE FRAUEN');
INSERT INTO partei17 (id, name) VALUES (39, 'Mieterpartei');
INSERT INTO partei17 (id, name) VALUES (40, 'Neue Liberale – Die Sozialliberalen');
INSERT INTO partei17 (id, name) VALUES (41, 'UNABHÄNGIGE für bürgernahe Demokratie');
INSERT INTO partei17 (id, name) VALUES (42, 'Übrige');
