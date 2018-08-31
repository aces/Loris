# Electrophysiology Browser

## Purpose

The Electrophysiology Browser is intended to allow users to view candidate
electrophysiology (EEG, MEG...) sessions collected for a study.

## Intended Users

The primary types of users are:
1. Electrophysiology researchers who want to know details about the inserted datasets
2. Site coordinators or researchers ensuring the uploaded electrophysiology data have
been correctly inserted into LORIS.

## Scope

The Electrophysiology Browser displays electrophysiology datasets that have been
inserted into LORIS from a BIDS-format collection. Derived or processed electrophysiology
datasets can also be accessed via this module.

NOT in scope at the moment:

Visualization of channel signal data and electrode positions for each electrophysiology dataset. 
(These are in development and will be added in future.)

## Permissions

The Electrophysiology Browser uses the following permissions. Any of them is 
sufficient to provide access to view data in the module.

electrophysiology_browser_view_allsites
  - This permission gives the user access to all electrophysiology datasets present in the database
  
electrophysiology_browser_view_site
  - This permission gives the user access to electrophysiology datasets from their own site(s) only

## Download

You can download all the files related to a recording (channel information,
electrode information, task event information, the actual recording...)