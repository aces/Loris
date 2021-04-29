# Electrophysiology Browser

## Purpose

The Electrophysiology Browser is intended to allow users to view candidate
electrophysiology (EEG, MEG...) sessions collected for a study and any associated
annotations (derivatives) for each recording.

## Intended Users

The primary types of users are:
1. Electrophysiology researchers who want to know details about the inserted datasets.
2. Site coordinators or researchers ensuring the uploaded electrophysiology data have
been correctly inserted into LORIS.

## Scope

The Electrophysiology Browser displays electrophysiology datasets that have been
inserted into LORIS from a BIDS-format collection. Derived or processed electrophysiology
datasets can also be accessed and annotated via this module.

## Permissions

The Electrophysiology Browser uses the following permissions. Either of the first two is 
sufficient to provide access to view data in the module. The third permission provides editing
permissions for derivative datasets.

electrophysiology_browser_view_allsites
  - This permission gives the user access to all electrophysiology datasets present in the database.
  
electrophysiology_browser_view_site
  - This permission gives the user access to electrophysiology datasets from their own site(s) only.
  
electrophysiology_browser_edit_annotations
  - This permission allows the user to add, edit, and delete annotations for raw or derived datasets

## Download

You can download all the files related to a recording (channel information,
electrode information, task event information, the actual recording) -- as well as its derivatives (annotations and their metadata).

## Installation requirements to use the visualization features
The visualization component requires Protocol Buffers v3.0.0 or higher.
For install instructions, you can refer to the Protocol Buffers GitHub page: https://github.com/protocolbuffers/protobuf

In order to automatically generate the protoc compiled files, add the following block in `modules/electrophysiology_browser/jsx/react-series-data-viewer/package.json`: 
``` 
"scripts": {
  "postinstall": "protoc protocol-buffers/chunk.proto --js_out=import_style=commonjs,binary:./src/"
}
```
and run `npm run install` from the loris root directory.
