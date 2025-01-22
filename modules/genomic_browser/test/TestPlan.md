## Genomic Browser - Test Plan

### Table of Contents  

#### [Permissions](#permissions_link)
#### [Navigation](#navigation_link)
#### [Features](#features_link)
#### [Filtering](#data_filtering_link)  
#### [Datatable](#datatable_link)
#### [Download](#data_download_link)  
#### [Upload](#data_upload_link)  
#### [Help content](#help_content_link)
<br>

<a name="permissions_link">
</a>

## Permissions

The following permissions should be available in the database

| code | description |
| :---: | --- |
| genomic_browser_view_site | View Genomic Browser data from own site |
| genomic_browser_view_allsites | View Genomic Browser data across all sites |
| genomic_data_manager | Upload genomic files |


#### For a user without neither genomic_browser_view_allsites nor genomic_browser_view_site

- The Loris menu should not contain a *Genomic Browser* item.
- Accessing the http://your-base-url/genomic_browser/ should present the following error message: 

> **You do not have access to this page.**  

***
#### For a user with genomic_browser_view_allsites only

- There should be a *Genomic Browser* item in the Loris Menu under tools.
- Accessing the http://your-base-url/genomic_browser/ should load the Genomic Browser Profile tab.  

***
#### For a user with genomic_browser_view_site only

- There should be a *Genomic Browser* item in the Loris Menu under tools.
- Accessing the http://your-base-url/genomic_browser/ should load the Genomic Browser Profile tab.
- The Datatable that appears in the Profiles, CNV, SNP and Methylation tabs should only contain data having the same site(s) as this user's site(s).

***
#### For a user with genomic_data_manager and one of genomic_browser_view_site or genomic_browser_view_allsites

- In the File tab of the Genomic Browser, there should be a *Upload File* button. For users with permission genomic_data_manager, this button will allow a file to be uploaded. For users that do not have this permission, a message saying that the user does not have sufficient privileges is displayed when the button is clicked.

*** 

<a name="navigation_link">
</a>

## Page Navigation and Display

- There should be 6 tabs under the breadcrumbs: Profile, GWAS, SNP, CNV, Methylation and Files
- Clicking each tab should present it as active and the 5 other tabs should remain in the same order.

<a name="features_link">
</a>

## Features 
***
<a name="data_filtering_link">
</a>

### Data Filtering

#### Profile tab
- Filters should filter data presented in the Datatable according to the selected/entered values on the fly (i.e as values are selected or characters are typed).
        - *Site* dropdown should present all sites for a user with the genomic_browser_view_allsites permission
        - *Site* dropdown should present only the user's own site for a user with the genomic_browser_view_site permission

- The datatable should display the following columns:

| No. | PSCID | Sex | Cohort | Files | SNPs | CNVs | CPGs |
| ---| --- | ---| --- | ---| --- | ---| ---|
| | | | | | | | |

- Clicking the *Clear Form* button should reset the filter.
- Clicking on column headers should sort data in ascending order on the first click then descending order on the second click.


*** 

#### GWAS tab

- Filters should filter data presented in the Datatable on the fly (i.e as values are selected or characters are typed).
- Clicking the *Clear Form* button should reset the filters.
- Clicking on column headers should sort data in ascending order on the first click then descending order on the second click.

*** 

#### SNP tab
- Filters should filter data presented in the Datatable on the fly (i.e as values are selected or characters are typed).
    - Candidate filters
        - *Site* dropdown should present all sites for a user with the genomic_browser_view_allsites permission
        - *Site* dropdown should present only the user's own site for a user with the genomic_browser_view_site permission
    - Genomic Range filters
        - *Genomic Range* filter should filter SNP to present only SNP for which  *StartLoc* is contained within the range (i.e. chr14:100000-200000 should present all the SNP on the chromosome 14 between position 1000000 and 2000000 inclusively.
        - By entering only the chromosome name in the *Genomic Range*, all the SNP on that chromosome should appear.

- The datatable should display the following columns (Summary fields)

|No.|PSCID|Sex|Cohort|Build|Platform|Allele A|Allele B|Reference Base|Minor Allele|Function Prediction|Damaging|Genotype Quality|
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---|
| | | | | | | | | | | | | |

- Clicking the *Clear Form* button should reset the filter.
- Clicking on column headers should sort data in ascending order on the first click then descending order on the second click.

*** 

#### CNV tab

- Filters should filter data presented in the Datatable on the fly (i.e as values are selected or characters are typed). 
        - *Site* dropdown should present all sites for a user with the genomic_browser_view_allsites permission
        - *Site* dropdown should present only the user's own site for a user with the genomic_browser_view_site permission
        - By entering only the chromosome name in the *Genomic Range*, all the SNP on that chromosome should appear.

- The datatable should display the following columns:

|No.|PSCID|Sex|Cohort|Location|Type|Common|Characteristics|Inheritance|Platform|
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | | | |

- Clicking the *Clear Form* button should reset the filter.
- Clicking on column headers should sort data in ascending order on the first click then descending order on the second click.

*** 

#### Methylation tab

- Filters should filter data presented in the Datatable on the fly (i.e as values are selected or characters are typed).
        - *Site* dropdown should present all sites for a user with the genomic_browser_view_allsites permission
        - *Site* dropdown should present only the user's own site for a user with the genomic_browser_view_site permission
        - *Genomic Range* filter should filter SNP to prensent only SNP that *StartLoc* is contain within the range (i.e. chr14:100000-200000 should prensent all the SNP on the chromosome 14 between position 1000000 and 2000000 inclusively.
- The datatable should display the following columns (Summary fields)

|No.|PSCID|Sex|Sample|Probe Seq A|Probe Loc B|Probe Seq B|Infinium Design|Color|Gene|Accession Number|Position|DMR|DHS|
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | | | | | | | |

- Clicking the *Clear Form* button should reset the filter.
- Clicking on column headers should sort data in ascending order on the first click then descending order on the second click.

***

#### Files tab

- Filters should filter data presented in the Datatable on the fly (i.e as values are selected or characters are typed).

The following columns should be presented

|No.|GenomicFileID|FileName|Description|FileType|Date Inserted|InsertedByUserID|Caveat|Notes|
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | | |

- Clicking the *Clear Form* button should reset the filters

*** 

##### Across tab filters


***
<a name="datatable_link"> 
</a>

## Datatable

 - For each of the 6 tabs, the Datatable should present the total of records found.
 - For each of the 6 tabs, the Datatable should present the number of row  displayed.
 - For each of the 6 tabs, the Datatable should present a pagination if there is more records to display then the actual *row per page* value.
 - Changing the *row per page* drop-down value should be reflected on the pagination and on the number of row displayed.

### Special formated columns

#### Profile tab
 - The *PSCID* column should provide links to the timepoint_list module filtered to this candidate.
 - If there is at least one file for a candidate, the *Files* column should provide links to the **viewGenomicFile** submenu filtered for all files concerning this candidate. There can be multiple files displayed. 
 - If there is at least one SNP for this candidate, the SNPs column should provide links to the SNP tab filtered for this candidate.
 - If there is at least one CNV for this candidate, the CNVs column should provide links to the CNV tab filtered for this candidate.
 - If there is at least one CPG for this candidate, the CPGs column should provide links to the Methylation tab filtered for this candidate.

#### GWAS tab
 - None
***
#### SNP tab
- The *PSCID* column should provide links to the timepoint_list module filtered to this candidate.
- The *RsID* column should provide link to the [dbSNP](http://www.ncbi.nlm.nih.gov/SNP/) http://www.ncbi.nlm.nih.gov/SNP/
***
#### CNV tab
- The *PSCID* column should provide links to the timepoint_list module filtered to this candidate.
***
#### Methylation tab
- The *PSCID* column should provide links to the timepoint_list module filtered to this candidate.
- The *Cpg Name* column should provide links to the [UCSC Genome Browser](https://genome.ucsc.edu/cgi-bin/hgTracks) https://genome.ucsc.edu/cgi-bin/hgTracks at the location centered on that cpg 1000bp wide. 
- The *Gene* column should provide links to the [UCSC Genome Browser](https://genome.ucsc.edu/cgi-bin/hgTracks) https://genome.ucsc.edu/cgi-bin/hgTracks at the location centered on that gene. There can be many gene name. The links should open new window. 
- The *Accession Number* column should provide links to the [UCSC Genome Browser](https://genome.ucsc.edu/cgi-bin/hgTracks) https://genome.ucsc.edu/cgi-bin/hgTracks at the location centered on that gene. There can be many gene name. The links should open new window. 
- The *Island Loc* column should provide links to the [UCSC Genome Browser](https://genome.ucsc.edu/cgi-bin/hgTracks) https://genome.ucsc.edu/cgi-bin/hgTracks at the location centered on that cPG island.
***
#### Files tab

- The FileName column should provide links to the **viewGenomicFile** page showing this file only.


<a name="data_download_link"> 
</a>

## Data Download 
### CSV
- The 6 tab Datatables should provide a *Download as CSV* button.
- Clicking on the *Download as CSV* button should trigger a file download.
- The file content should follow the filtered values of the tab.

### View Genomic File
- The "Files" tab (or Genomic File Uploader subpage) should provide a *Download* button for each file.
- Clicking on the *Download* button should trigger a file download.

<a name="data_upload_link">
</a>

## Data Upload

Files may be uploaded under the Files tab (Genomic File Uploader subpage) IFF the Genomic Browser back-end is properly customized/configured and sample files of the appropriate format are available for upload testing.
. 
Currently this will only work for methylation beta-values files formatted for the Illumina 450k platform, and only once certain probe metadata is already loaded into the database.  

<a name="help_content_link">
</a>

## Help section content

- The help panel should appear when clicking on the question mark in the LORIS menu bar.  
- The help text should be accurate at formatted properly.
- Help text should be appropriate to each subpage (tab) displayed, e.g SNP tab. 
