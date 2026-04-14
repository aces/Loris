# Acknowledgements

## Purpose

The purpose of the Acknowledgements Generator is to aid in dynamically generating
an appropriate list of people to acknowledge for any given publication.

## Intended Users

- Researchers who publish
- Data coordinator who has knowledge of who collaborates on the project

## Scope

Example public facing link:

`https://<YOUR-BASE-STUDY-URL>/acknowledgements/acknowledgements.php?date=2017-11-17`

Given the publication date of `2017-11-17`, this will limit the list to people
who started on or before `2017-11-17`.
This list is intended to be used in any publication(s), so keep in mind it will
be shared in the wild without authentication.

## Permissions

There are two permissions associated to the module:
`acknowledgements_view` and `acknowledgements_edit`

`acknowledgements_view` allows regular LORIS users to view the module within LORIS.

`acknowledgements_edit` allows someone like the study coordinator to add members
related to their project to the list.

## Configurations

Use the `citation_policy` config setting to specify any additional details which
will be shown within the module.

Things like affiliations, degrees, and roles can be customized in the template
by a developer.

The code for the public side of things can be found within:
`htdocs/acknowledgements/acknowledgements.php`

The code can easily be customized to add more complex filtering as needed.

## Interactions with LORIS

Could be linked to the Data Release as a future feature.

Another future implementation: DOIs
