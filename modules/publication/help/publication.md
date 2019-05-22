# Publication

The publication module allows users to propose research projects based on LORIS 
data, upload publication media, and allows study PIs to review the project 
proposals.

## Intended Users

Publication module is intended for users to propose specific research projects
and for PIs to review them. When proposing a project, PIs may also specify 
other LORIS users to help with editing and maintaining their project proposals.

## Scope

The publication module is intended to view and manage research project proposals.
Users who are proposing a project are able to specify which specific variables of 
interest that are relevant to their research. However, gathering and releasing this 
data remains within the scope of the DQT and Data Release modules respectively.
Realizing and implementing the proposals are also outside the scope; this module 
is intended solely for tracking the status and metadata of the proposals, as well as 
storing the resulting publication media.


## Permissions

There are three main permissions for the publication module:

- `publication_view`: grants the user access to viewing the module and pending 
or approved project proposals, as well as downloading publication media which may 
be included in the proposals.
- `publication_propose`: grants the user access to proposing their research projects
and uploading relevant publication media.
- `publication_approve`: grants the user access to reviewing (accepting or rejecting)
project proposals.

## Configurations

- `publication_uploads`: This configuration determines the directory where file uploads
 get stored. By default, this directory will be `/data/publication_uploads/` but
  it is not automatically created.

## Interactions with LORIS

The publication module creates foreign key relations between its primary `publication` 
 table, the `parameter_type` table, the `test_names` table, and the `users` table.
 There is also a link to the Data Dictionary in the project proposal / editing view
 in order to assist in finding variables of interest.
