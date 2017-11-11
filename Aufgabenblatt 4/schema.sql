DROP TABLE IF EXISTS bundesland;
DROP TABLE IF EXISTS wahlkreis;
DROP TABLE IF EXISTS partei;

CREATE TABLE bundesland (
  id integer PRIMARY KEY,
  name text NOT NULL
);

CREATE TABLE wahlkreis (
  id integer PRIMARY KEY,
  name text NOT NULL
);

CREATE TABLE partei (
  id integer PRIMARY KEY,
  name text NOT NULL
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
