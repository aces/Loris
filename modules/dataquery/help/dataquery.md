# Data Querying Module

## Purpose

The LORIS data querying module ("the DQT") provides a graphical
frontend for scientists to query and extract arbitrary data from a
LORIS instances without backend SQL access.

## Intended Users

The DQT is intended for scientists who are internal to the LORIS
project to extract data.

## Scope

The Data Querying Module implements a proxy to pass through queries
to the Loris CouchDB DQT backend, which must be setup independently
(see Configuration section).

It does **NOT** alter data in any way other than that required to
convert the data from the MySQL to the CouchDB format. In particular,
it does no anonymization or filtering of participant data that is
already in LORIS. This must be done independently before distributing
data externally.

## Permission

The DQT requires the `dataquery_view` permission.

## Configuration

CouchDB must be independently setup, and the relevant CouchDB views
installed following the directions at
https://github.com/aces/Data-Query-Tool.

Importer scripts must be set up to import data into CouchDB. (The
instructions are also in the README of the above repository.)

## Interactions with LORIS

The CouchDB import scripts (those named `CouchDB_Import_*.php` in
the LORIS tools directory) must be run to import data from MySQL
to CouchDB before the DQT can be used.

