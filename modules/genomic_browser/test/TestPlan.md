## Genomic Browser - Test Plan

## Table of Contents  

### [Permissions](#permissions_link)
### [Navigation](#navigation_link)
### [Features](#features_link)
### [Filtering](#data_filtering_link)  
### [Datatable](#datatable_link)
### [Download](#data_download_link)  
### [Upload](#data_upload_link)  
### [Help](#help_link)
### [Help content](#help_content_link)
### [Tooltips](#tooltips_link)

<br>

<a name="permissions_link">
</a>

## Permissions

The following permissions should be available in the database

| code | description |
| :---: | --- |
| genomic_browser_view_site | View Genomic Browser data from own site |
| genomic_browser_view_allsites | View Genomic Browser data across all sites |
| genomic_data_manager | Manage the genomic files |


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
- The only candidate's data that should appear in the Datatable of the Profile, CNV,  SNP and Methylation tabs should be those of the same site as this user's site.  

***
#### For a user with genomic_data_manager and one of genomic_data_manager or genomic_browser_view_allsites

- In the File tab of the genomic browser, there should be a *Upload File* button  

*** 

<a name="navigation_link">
</a>

## Page Navigation and Display

- There should be 6 tabs unders the breadcrumb: Profile, GWAS, SNP, CNV, Methylation and Files
- Clicking each tab should present it as active and the 5 other tabs should remain in the same order.

<a name="features_link">
</a>

## Features 
***
<a name="data_filtering_link">
</a>

### Data Filtering

#### Profile tab
- Clicking on the *Candidate filters* block header should hide its content.
- Clicking on the *Genomic filters* block header should hide its content.
- Filters should filter data presented in the Datatable according to the selected values after clicking on the *Show Data* button.
    - Candidate filters
        - *Site* dropdown should present all sites for a user with the genomic_browser_view_allsites permission
        - *Site* dropdown should present only the user's own site for a user with the genomic_browser_view_site permission
        - *DCCID* filter is an exact filter (Shows only the record with this exact value)
        - *External ID* and *PSCID* are contains filters (Shows all records that contains this value)
    - Genomic filters
        * For the four filters, selecting 'Any' should only present record that have at least one, and selecting 'None' should present only record that don't have Files, SNP, CNV or CPG accordingly.

- The datatable should display the following columns (Summary fields)

| No. | PSCID | Sex | Subproject | Files | SNPs | CNVs | CPGs |
| ---| --- | ---| --- | ---| --- | ---| ---|
| | | | | | | | |

- Setting the Display filter to All fields and click in the *Show Data* button should present the following columns in the Datatable

No.|PSC|DCCID|PSCID|Sex|Subproject|DoB|ExternalID|Files|SNPs|CNVs|CPGs|
| ---| --- | --- | ---| --- | ---| --- | ---| ---| --- | ---| ---|
| | | | | | | | | | | |

- Clicking the *Clear Form* button should reset the filters and the Datatable should prensent the Summary fields columns only.
- Clicking on column headers should sort data in ascending order on the first click then descending order on the second click.


*** 

#### GWAS tab

- Clicking on the *GWAS filters* block header should hide its content.
- Filters should filter data presented in the Datatable according to the selected values after clicking on the *Show Data* button.
    - GWAS filters
        - *Chromosome* filter is an exact filter (Shows only the record with this exact value)
        - All other filters are contains filters (Shows all records that contains this value)

- Clicking the *Clear Form* button should reset the filters.
- Clicking on column headers should sort data in ascending order on the first click then descending order on the second click.

*** 

#### SNP tab
- Clicking on the *Candidate filters* block header should hide its content.
- Clicking on the *Genomic Range filters* block header should hide its content.
- Clicking on the *SNP filters* block header should hide its content.
- Filters should filter data presented in the Datatable according to the selected values after clicking on the *Show Data* button.
    - Candidate filters
        - *Site* dropdown should present all sites for a user with the genomic_browser_view_allsites permission
        - *Site* dropdown should present only the user's own site for a user with the genomic_browser_view_site permission
        - *DCCID* filter is an exact filter (Shows only the record with this exact value)
        - *External ID* and *PSCID* are contains filters (Shows all records that contains this value)
    - Genomic Range filters
        - *Genomic Range* filter should filter SNP to prensent only SNP that *StartLoc* is contain within the range (i.e. chr14:100000-200000 should prensent all the SNP on the chromosome 14 between position 1000000 and 2000000 inclusively.
        - By entering only the chromosome name in the *Genomic Range*, all the SNP on that chromosome should appear.
    - SNP filters
        - All the filters are contains filters (Shows all records that contains this value)
- The datatable should display the following columns (Summary fields)

|No.|PSCID|Sex|RsID|Observed Base|Reference Base|Function Prediction|Damaging|Exonic Function|
| ---| --- | ---| --- | ---| --- | ---| ---| ---|
| | | | | | | | | | |

- Setting the Display filter to All fields and click in the *Show Data* button should present the following columns in the Datatable

|No.|PSC|DCCID|PSCID|Sex|Subproject|DoB|ExternalID|Chromosome|Strand|StartLoc|EndLoc|Size|Gene Symbol|Gene Name|Platform|RsID|SNP|Name|SNP Description|External Source|Observed Base|Reference Base|Array Report|Markers|Validation Method|Validated|Function Prediction|Damaging|Genotype Quality|Exonic Function|
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---| --- | --- | --- |
| | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | |

- Clicking the *Clear Form* button should reset the filters and the Datatable should prensent the Summary fields columns only.
- Clicking on column headers should sort data in ascending order on the first click then descending order on the second click.

*** 

#### CNV tab

- Clicking on the *Candidate filters* block header should hide its content.
- Clicking on the *Genomic Range filters* block header should hide its content.
- Clicking on the *CNV filters* block header should hide its content.
- Filters should filter data presented in the Datatable according to the selected values after clicking on the *Show Data* button.
    - Candidate filters
        - *Site* dropdown should present all sites for a user with the genomic_browser_view_allsites permission
        - *Site* dropdown should present only the user's own site for a user with the genomic_browser_view_site permission
        - *DCCID* filter is an exact filter (Shows only the record with this exact value)
        - *External ID* and *PSCID* are contains filters (Shows all records that contains this value)
    - Genomic Range filters
        - *Genomic Range* filter should filter SNP to prensent only SNP that *StartLoc* is contain within the range (i.e. chr14:100000-200000 should prensent all the SNP on the chromosome 14 between position 1000000 and 2000000 inclusively.
        - By entering only the chromosome name in the *Genomic Range*, all the SNP on that chromosome should appear.
    - CNV filters
        - All the filters are contains filters (Shows all records that contains this value)
- The datatable should display the following columns (Summary fields)

|No.|PSCID|Sex|Location|CNV Description|CNV Type|Copy Num Change|Common CNV|Characteristics|Inheritance|
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | | | |

- Setting the Display filter to All fields and click in the *Show Data* button should present the following columns in the Datatable

|No.|PSC|DCCID|PSCID|Sex|Subproject|DoB|ExternalID|Chromosome|Strand|StartLoc|EndLoc|Size|Location|Gene Symbol|Gene Name|CNV Description|CNV Type|Copy Num Change|Event Name|Common CNV|Characteristics|Inheritance|Array Report|Markers|Validation Method|Platform|
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | 
| | | | | | | | | | | | | | | | | | | | | | | | | | | | 

- Clicking the *Clear Form* button should reset the filters and the Datatable should prensent the Summary fields columns only.
- Clicking on column headers should sort data in ascending order on the first click then descending order on the second click.

*** 

#### Methylation tab

- Clicking on the *Candidate filters* block header should hide its content.
- Clicking on the *Genomic Range filters* block header should hide its content.
- Clicking on the *CpG filters* block header should hide its content.
- Filters should filter data presented in the Datatable according to the selected values after clicking on the *Show Data* button.
    - Candidate filters
        - *Site* dropdown should present all sites for a user with the genomic_browser_view_allsites permission
        - *Site* dropdown should present only the user's own site for a user with the genomic_browser_view_site permission
        - *DCCID* filter is an exact filter (Shows only the record with this exact value)
        - *External ID* and *PSCID* are contains filters (Shows all records that contains this value)
    - Genomic Range filters
        - *Genomic Range* filter should filter SNP to prensent only SNP that *StartLoc* is contain within the range (i.e. chr14:100000-200000 should prensent all the SNP on the chromosome 14 between position 1000000 and 2000000 inclusively.
        - By entering only the chromosome name in the *Genomic Range*, all the SNP on that chromosome should appear.
    - CpG filters
        - *CPG namer* filter is an exact filter (Shows only the record with this exact value)
        - All other filters are contains filters (Shows all records that contains this value)
- The datatable should display the following columns (Summary fields)

|No.|PSCID|Sex|Cpg Name|Beta Value|Chromosome|Strand|Gene|
| --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | |

- Setting the Display filter to All fields and click in the *Show Data* button should present the following columns in the Datatable

|No.|PSC|DCCID|PSCID|Sex|Subproject|DoB|Sample|Cpg Name|Beta Value|Chromosome|Strand|StartLoc|Probe Loc A|Probe Seq A|Probe Loc B|Probe Seq B|Design|Color|Assembly|SNP 10|Gene|Accession Number|Gene Grp|Island Loc|Context|Fantom Prom|DMR|Enhancer|HMM Island|Reg Feature Loc|Reg Feature Grp|DHS|Platform|
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | |

- Clicking the *Clear Form* button should reset the filters and the Datatable should prensent the Summary fields columns only.
- Clicking on column headers should sort data in ascending order on the first click then descending order on the second click.

***

#### Files tab

- *Type* filter is an exact filter (Shows only the record with this exact value)
- All other filters are contains filters (Shows all records that contains this value)

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
- The view genomic file page should provide a *Download* button for each file.
- Clicking on the *Download* button should trigger a file download.

<a name="data_upload_link">
</a>

## Data Upload

> Under construction

<a name="help_link">
</a>

## Help

***

<a name="help_content_link">
</a>

## Help section content

- The help panel should appear when clicking on the question mark in the LORIS menu bar.  
- The help text should be accurate at formatted properly.

<a name="tooltips_link">
</a>

## Tooltips
> Under construction

