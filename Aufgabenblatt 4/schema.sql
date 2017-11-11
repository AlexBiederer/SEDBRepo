DROP TABLE IF EXISTS bundesland;
DROP TABLE IF EXISTS wahlkreis;
DROP TABLE IF EXISTS partei;
DROP TABLE IF EXISTS wahlkreis13;
DROP TABLE IF EXISTS wahlkreis17;
DROP TABLE IF EXISTS partei13;
DROP TABLE IF EXISTS partei17;
DROP TABLE IF EXISTS kandidat13;
DROP TABLE IF EXISTS kandidat17;
DROP TABLE IF EXISTS liste13;
DROP TABLE IF EXISTS liste17;
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
  name text NOT NULL
);

CREATE TABLE wahlkreis13 (
  id integer PRIMARY KEY,
  name text NOT NULL,
  bundesland integer references bundesland(id),
  numWahlb integer NOT NULL,
  numGueltige integer NOT NULL,
  numUngueltige integer NOT NULL
);

CREATE TABLE wahlkreis17 (
  id integer PRIMARY KEY,
  name text NOT NULL,
  bundesland integer references bundesland(id),
  numWahlb integer NOT NULL,
  numGueltige integer NOT NULL,
  numUngueltige integer NOT NULL
);

CREATE TABLE partei13 (
  id integer PRIMARY KEY,
  name text NOT NULL,
  abk text NOT NULL,
  fraktion text
);

CREATE TABLE partei17 (
  id integer PRIMARY KEY,
  name text NOT NULL,
  abk text NOT NULL,
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
  wahlkreis integer references wahlkreis13(id),
);

CREATE TABLE direkt17 (
  kandidat integer references kandidat17(id),
  wahlkreis integer references wahlkreis17(id),
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
