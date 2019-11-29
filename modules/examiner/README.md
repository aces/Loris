# Examiner

## Purpose

The Examiner module displays the list of examiners in the study and allows 
for additions and removal of certifications for each examiner listed.

## Intended Users

The primary type of users is:
1. Site coordinators adding examiners and adding certifications to examiners


## Scope

This module displays information about examiners as well as certifications and 
sites to which the examiners are affiliated. It also allows adding examiners 
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

EnableCertification
 - Binary entry for sub-tag `<EnableCertification>` under the tag 
 `<Certification>` in the config.xml file. Options `1` or `0` enable or 
 disable, respectively, the use of certification for projects defined 
 in the `<CertificationProjects>` section or all projects if none are 
 explicitly stated.
   

CertificationProjects (Config.xml)
 - Projects for which certification is enabled, should match entries in 
 `Project` table in the database. The project identifier should be placed 
 within the `<CertificationProject>` tags as such 
 `<CertificationProject>1</CertificationProject>`.

CertificationInstruments
 - Instruments which require certification to be able to administer. 
 When an instrument is added to this list, the examiner dropdown found 
 at the top page this instrument is populated only with examiners having 
 obtained a certification for it.

startYear
 - Min date of certification. This is entry is also the start year of the study.

endYear
 - Max date of certification. This is entry is also the end year of the study.

## Interactions with LORIS

- The list of examiners displayed at the top page of instruments is 
dependent on entries in this module. The list is populated 
with examiners that exist in the database, are at the same site 
and have the appropriate certifications (if configured); failure to 
match these 3 criteria will result in the examiner not being displayed.

- The user_accounts module allows for quick activation/deactivation of 
an examiner as well as setting their sites and their radiologist status.
When an examiner is added from the user_accounts module, the `userID` field of 
the `examiners` table in the database is populated to associate the examiner 
to the user.
