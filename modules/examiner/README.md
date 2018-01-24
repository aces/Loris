# Examiner

## Purpose

The Examiner module displays the list of examiners in the study and allows 
for additions and removal of certifications for each examiner listed.

## Intended Users

The primary type of users is:
1. Site coordinators adding examiners and adding certifications to examiners


## Scope

This module displays information about examiners as well as certifications and 
sites to which the examiners are affiliated. It also allows to add examiners 
to sites, to give or remove certifications for instruments and set them as 
radiologists.

NOT in scope:

Management of the certification instruments and of the sites is external to 
this module.
The Examiner architecture is completely separate from the User 
architecture intentionally; examiners may or may not be users.


## Permissions

The Examiner module uses the following permissions. Any one of them 
is sufficient to have access to the module.

examiner_view
 - This permission gives the user viewing and editing access to all 
 examiners and certifications within their own site

examiner_multisite
 - This permission gives the user viewing and editing access to all 
 examiners and certifications at all sites.

## Configurations

The examiner module has the following configurations that affect its usage

EnableCertification (Config.xml)
 - Binary option enables/disables the use of certification for 
 projects defined in "CertificationProjects" or all projects if none are 
 explicitly stated

CertificationProjects (Config.xml)
 - Projects for which certification is enabled, should match entries in 
 `Project` table in the database

CertificationInstruments
 - Instruments which require certification to be able to administer. 
 This allows for examiners to be populated or not in the dropdown 
 list shown at the front page of instruments.

startYear
 - Min date of certification

endYear
 - Max date of certification

## Interactions with LORIS

- The list of examiners displayed at the top page of instruments is 
highly dependent on entries in this module. The list is populated 
with examiners that exist in the database, are at the correct site 
and have the appropriate certifications (if need be); failure to 
match these 3 criteria would result in the examiner not being displayed.

- The user_accounts module allows for quick activation/deactivation of 
an examiner as well as setting their sites and their radiologist status.
When an examiner is added from the user_accounts module, an additional 
field in the database is populated to associate the examiner to the user.

- The Training module allows the study users to undergo proper 
training and automatically assigns certifications upon completion. 
The module starts by verifying that the user is indeed an examiner 
before beginning the training. The certifications should appear 
in the examiner module once obtained by an examiner and it should 
be dated with the date of completion of the training process.
