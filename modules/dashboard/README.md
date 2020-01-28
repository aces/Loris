# Dashboard

## Purpose

The Dashboard serves as a landing page for all users logging into LORIS.  It provides introductory information and a primary quick-access interface for user workflows, including outstanding tasks and notifications of recent activity/additions in LORIS.  

The Dashboard also provides at-a-glance live visual summaries of the data stored in LORIS, and dynamically plots data breakdowns that can be used in reporting. 

## Intended Users

All LORIS users can view the dashboard.

## Scope

The Dashboard provides entrypoints to various workflows, but does not provide any tools for directly modifying data in the dashboard. All users, regardless of site or project affiliation, can see data summaries across sites and projects. 

The Study Progression chart views at bottom may or may not count `excluded` candidates, and this should be clearly verified and documented/presented for the use of your LORIS users. 

## Permissions

Components of the Dashboard are governed by permissions related to module-specific privileges. For example, the _Document Repository_ notifications panel is displayed if a user has been granted either the `document_repository_view` or `document_repository_delete` permission. 
Site access and Project access privileges are not currently enforced in the display of data. 

## Configurations

Many aspects of the Dashboard are configured in the Configuration module, under the Admin menu. 

Under the _Dashboard_ section of the Configuration module, you can edit 2 settings: 
* `projectDescription` Project Description: the blurb that appears at the top of the Dashboard. 
* `recruitmentTarget` Target number of Participants: this value is used in the _Recruitment_ panel of the Dashboard. 

In both the _Projects_ and _Subprojects_ pages of the Configuration module, you can modify (sub)project-specific recruitment targets - these are used in the Project breakdown View in the Dashboard's _Recruitment_ charts panel.   

Note there is currently no relationship enforced between the subproject and parent project recruitment targets -- the former can be larger than the latter. 
