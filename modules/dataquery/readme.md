# Data Query Tool

## Purpose
The Data Query Tool (“The DQT”) is used to query and export data stored in LORIS. Designed as a front-end tool, it is located within the Reports drop-down menu. 

A variety of filters allow users to define parameters and query the exact data fields desired. The extracted data can be downloaded as a single CSV file, and imaging files can also be downloaded as a zipped package of files. Users can visualize or see basic statistical measures from a query. Users can load a previously saved query, and can make saved queries visible to other users.

## Intended Users
The DQT module is intended for researchers who wish to download data stored in LORIS. Users can access only internal data that belongs to their LORIS instance. 

## Scope
The module implements a proxy to pass through queries to the Loris CouchDB DQT backend, which must be setup independently (see Configuration section).

It does NOT alter data in any way other than that required to convert the data from the MySQL to the CouchDB format. In particular, it does no anonymization or filtering of participant data that is already in LORIS. This must be done independently, before distributing data externally.

## Other Notes
The most closely related module to the DQT is the Data Release module, which is used to store snapshots of data for any given release. 

## Permissions
Users must have `dataquery_view` permission to use the DQT. 

It’s important to note that more granular permissions do not exist for this module, to restrict access to a subset of the data. Anyone with the `dataquery_view` permission has access to view, query and download data from the DQT, and therefore has access to all data loaded in the DQT from this LORIS instance.

## Interactions with LORIS
Before the DQT can be used, the CouchDB import scripts must be run to load data from LORIS' MySQL tables into CouchDB. These scripts are found in the `tools/` directory, named `CouchDB_Import_*.php`.

It is recommended to set up a cronjob to execute these scripts to refresh the data on a regular basis. 

## Configuration
Use of the DQT module requires setting up the CouchDB server and credentials:

[CouchDB](http://couchdb.apache.org)

Once CouchDB is installed, follow these steps to complete setup:

1. Create a database on your local CouchDB instance

2. Clone the code from our server:

`
curl -H 'Content-Type: application/json' -X POST http://$YOURCOUCHDBADMIN:$YOURCOUCHADMINPASS@$YOURSERVERNAME:5984/_replicate -d '{"source":"http://couchdb.loris.ca:5984/dataquerytool-1_0_0", "target":"$YOURDATABASENAME"}'
`

3. Amend the `<CouchDB>` section of your LORIS `project/config.xml` as follows:

```
<CouchDB>
    <database>dqg</database>
    <hostname>localhost</hostname>
    <port>5984</port>
    <admin>adminuser</admin>
    <adminpass>adminpass</adminpass>
</CouchDB>
```

4. To load the Data Query Tool with data stored in LORIS, run the `CouchDB_Import_*` scripts, in the `tools/` directory: 

`cd $lorisroot/tools`

##### Import the base candidate data

`php CouchDB_Import_Demographics.php`

##### Import the LORIS instrument data
This step is optional and not required if only the MRI portion of LORIS is used:

`php CouchDB_Import_Instruments.php`

##### Import the LORIS MRI data
This step is optional and not required if the MRI portion of LORIS isn't installed:

`php CouchDB_Import_MRI.php`


