# Dashboard

## Purpose

The Dashboard serves as a landing page for all users logging into LORIS.  It provides introductory information and a primary quick-access interface for user workflows, including outstanding tasks and notifications of recent activity/additions in LORIS.  

The Dashboard also provides at-a-glance live visual summaries of the data stored in LORIS, and dynamically plots data breakdowns that can be used in reporting. 

## Intended Users

All LORIS users can view the dashboard.  

## Scope

??

## Permissions

Components of the Dashboard are governed by permissions related to module-specific privileges. For example, the _Document Repository_ notifications panel is displayed if a user has been granted either the `document_repository_view` or `document_repository_delete` permission. Site access privileges are also enforced. 

## Configurations

Many aspects of the Dashboard are configured in the Configuration module, under the Admin menu. 

Under the _Dashboard_ section of the Configuration module, you can edit 2 settings: 
* _Project Description_ : the blurb that appears at the top of the Dashboard. This text cannot contain HTML characters (such as line breaks), for security reasons.  
* _Target number of Participants_ : this value is used in the _Recruitment_ panel of the Dashboard. 

In the _Projects_ page of the Configuration module, you can also modify project-specific recruitment targets - these are used in the Project breakdown View in the Dashboard's _Recruitment_ charts panel.  
