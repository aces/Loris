# Candidate Identifiers

## Purpose

The `candidate_identifiers` module allows users to view and manage
identifiers associated with candidates in LORIS.

## Intended Users

The module is intended for data entry staff and other authorized users
who need to manage candidate identifiers.

## Scope

The module provides a filterable table of candidate identifiers,
including identifier type, value, and dates added or edited.

Users can add, edit, and delete candidate identifiers.

## Permissions

Access to the module requires either the `access_all_profiles` permission
or the `data_entry` permission with an assigned study site.

Users with `access_all_profiles` can access candidates across sites.
Users with `data_entry` are subject to LORIS's existing site-permission
filtering.

## Configurations

Candidate identifier types are managed through the Configuration module.

Each identifier type has settings indicating whether it is required
or automatically generated. The `candidate_identifiers` module retrieves
these settings for use in its identifier forms.

## Interactions with LORIS

The module displays candidate identifiers in a filterable data table.
Users can filter identifiers by type, value, date added, and date edited.

Users can add new identifiers, edit existing identifiers, and delete
identifiers through the module's interface.

Identifier types and their settings are retrieved from the Configuration
module. Candidate visibility is controlled by LORIS's existing site
permissions and project filtering.