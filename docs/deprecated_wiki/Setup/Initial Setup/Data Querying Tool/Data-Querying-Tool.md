**[[HOME|Home]]** > **[[SETUP|Setup]]** > **[[DATA QUERY TOOL|Data-Querying-Tool]]**

The [Data Query Tool](http://github.com/aces/Data-Query-Tool) is an open-source extension of LORIS which enables users to query and download datasets. Front-end users can design and store queries to extract any data available in LORIS, including imaging data. 

_Note: SSL is not fully supported for the Data Querying Tool_.  Individual Loris instances should set up their own SSL. 

### Installing the Data Query Tool

Quick setup: 
* Ubuntu:  apt-get install couchdb (needs sudo)
* in CouchDB: set up an admin credential and create a new database  
* replicate our public couchbase using curl - see [Data Query Tool Readme](http://github.com/aces/Data-Query-Tool)
* run the data loading scripts (below) 

Please see the [Data Query Tool Readme](http://github.com/aces/Data-Query-Tool) (in beta) for more complete installation instructions.  Detailed instructions for some systems are available in the [DQT repository wiki](https://github.com/aces/Data-Query-Tool/wiki) 

### Loading the Data Query Tool

Custom php scripts are provided in the LORIS codebase for loading data into the Data Query Tool.  
Before attempting to load data into the Data Query Tool, the [Data Dictionary](https://github.com/aces/Loris/wiki/LORIS-Modules#data-dictionary-tool) must be generated.  

In your LORIS tools/ directory, run the CouchDB_Import_* scripts to import each type of data  : 
* Base candidate data : CouchDB_Import_Demographics.php : Run first to import base candidate data
* Instrument data : CouchDB_Import_Instruments.php - omit if Behavioural data not used
* Imaging (MRI) data : CouchDB_Import_MRI.php - omit if Imaging data not used
* Radiological review module data : CouchDB_Import_RadiologicalReview.php - omit unless module in use

> Note that the path is assumed to be var/www/loris however your own path may be var/www/`<project-name>`, depending on your setup. 

   ```
cd /var/www/loris/tools
php CouchDB_Import_Demographics.php
php CouchDB_Import_Instruments.php
php CouchDB_Import_MRI.php
php CouchDB_Import_RadiologicalReview.php
   ```

CouchDB_Import_*.php scripts are provided in the tools/ directory to push Demographic, Instrument, MRI and Radiological Review data from LORIS into the DQT. Note that CouchDB_Import_Demographics.php must be run first. 

Upon initial import of data, it may take between a few minutes and a few hours to build the initial indexes, depending on the size of your dataset.

#### Imaging files in the Data Query Tool 
The MRI import script may require some editing or configuration to find the exact path for all imaging data.  Note that only QC'd ("Selected") minc files (i.e. Selected as the best acquisition for a given scan type e.g. t1) for valid timepoints are automatically loaded in the DQT by this script.  

MRI file data is loaded in the DQT under the category _mri_data_, fieldname "Selected_$SCANTYPE" e.g. Selected_t1. Imaging files should then be available for download under the "View Data" tab either by clicking the link after running the query, or clicking on "Download all as Zip" button.

### Downloading data

In the View Data tab, click the "Run Query" button.  Then scroll down and click "Download as CSV" to retrieve the data table of results you see on the screen.  

Note that the "Download all as Zip" button works only if Imaging files have been loaded and selected.  

### Troubleshooting

* If queries do not run immediately after setting up the DQT, note that it may take between a few minutes and a few hours to build the initial indexes, depending on the size of your dataset
* [Futon](http://docs.couchdb.org/en/stable/intro/tour.html#welcome-to-futon), the built-in administrative interface for CouchDB, is highly useful for debugging

### User Help
 A User Guide is available within the DQT's Help section, by clicking on Question Mark icon in top menu bar.