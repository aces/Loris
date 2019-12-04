# API

## Purpose

The api module is intended to provide a stable, versioned REST interface
for interacting with the core LORIS functionality without requiring backend
SQL access.

## Intended Users

The module has 2 intended use cases:
1. Users (or creators) of LORIS data that are external to the LORIS core
   software that must extract or import data from LORIS.
2. Internal LORIS modules which retrieve data from the API.

## Scope

The API only provides information about concepts that are cross-module
or data that is of general concern to users. 

NOT in scope:

- Data and functionality that is specific to a single module, and not of general
  nature.
- A graphical frontend for interacting with the API.

## Permissions

The `api` module is a public module so that the `login` endpoint can be accessed,
but otherwise all requests require a token (retrieved from the `login` endpoint)
or the user accessing the API to be logged in to LORIS.

The following permissions affect accessing data from the API:
????

## Configurations

The following configuration settings affect the format of data returned from
the API:

useEDC - This configuration setting determines whether the EDC is returned
  or required for creating/retrieving candidates with the API.

## Interactions with LORIS

- A token retrieved from the login endpoint bypasses the normal cookie based
  authentication of LORIS when provided in as "Authorization" bearer token. See
  API documentation for details.

- ??? (describe other interactions here)
