# API

## Purpose

The api module is intended to provide a stable, versioned REST interface
for interacting with the core LORIS functionality without requiring backend
SQL access.

## Intended Users

The module has 2 intended users:
1. Users (or creators) of LORIS data that are external to the LORIS core
   software that must extract or import data from LORIS.
2. Internal LORIS modules.

## Scope

The API only provides information about concepts that are cross-module
or data that is of general concern to users. 

NOT in scope:

- Data and functionality that is specific to a single module, and not of general
  nature.
- A graphical frontend for interacting with the API.

## Permissions

????

## Configurations

useEDC - This configuration setting determines whether the EDC is returned
  or required for creating/retrieving candidates with the API.

## Interactions with LORIS

???
