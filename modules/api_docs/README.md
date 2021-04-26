# API Documentation

## Purpose

The API Documentation module leverages the Swagger UI structure to document the LORIS
core and module specific REST APIs and offer an easy-to-use interface for users to 
learn more about them, test them and integrate them in their own work. The module 
offers textual explanations combined with code examples and interactive sections 
designed to give users the full experience of using the APIs.

## Intended Users

The module's intended users are those looking to learn more about the LORIS REST
API in order to integrate it in their own work or demonstrate its capabilities 
to others. 

## Scope

This module is designed to be used for documentation and demonstration purposes only.

## Permissions

The `api_docs` permission is required to access this module.

## Configurations

This module is not affected by any configurations

## Interactions with LORIS

- Any module can now provide a specification for its own API by writing an 
OpenAPI specification in a schema.yml file under its static directory. 
ex: modules/api/static/schema.yml

