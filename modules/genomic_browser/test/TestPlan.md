## Genomic Browser - Test Plan

### Table of Contents  

#### [Permissions](#permissions_link)
#### [Navigation](#navigation_link)
#### [Features](#features_link)
#### [Filtering](#data_filtering_link)  
#### [Datatable](#datatable_link)
#### [Download](#data_download_link)  
#### [Upload](#data_upload_link)  
#### [Help Content](#help_content_link)
<br>

<a name="permissions_link"></a>

## Permissions

The following permissions should be available in the database:

| code | description |
| :---: | --- |
| genomic_browser_view_site | View Genomic Browser data from own site |
| genomic_browser_view_allsites | View Genomic Browser data across all sites |
| genomic_data_manager | Upload genomic files |

#### For a user with neither `genomic_browser_view_allsites` nor `genomic_browser_view_site`:

- The Loris menu should not contain a *Genomic Browser* item.
- Accessing `http://your-base-url/genomic_browser/` should present the following error message:

> **You do not have access to this page.**

***

#### For a user with `genomic_browser_view_allsites` only:

- There should be a *Genomic Browser* item in the Loris Menu under Tools.
- Accessing `http://your-base-url/genomic_browser/` should load the Genomic Browser Profile tab.

***

#### For a user with `genomic_browser_view_site` only:

- There should be a *Genomic Browser* item in the Loris Menu under Tools.
- Accessing `http://your-base-url/genomic_browser/` should load the Genomic Browser Profile tab.
- The datatable that appears in the Profiles, CNV, SNP, and Methylation tabs should only contain data from the same site(s) as the user.

***

#### For a user with `genomic_data_manager` and one of `genomic_browser_view_site` or `genomic_browser_view_allsites`:

- In the Files tab of the Genomic Browser, there should be an *Upload File* button.
  - For users with the `genomic_data_manager` permission, this button allows file upload.
  - For users without this permission, a message indicating insufficient privileges is shown when the button is clicked.

***

<a name="navigation_link"></a>

## Page Navigation and Display

- There should be 6 tabs under the breadcrumbs: Profile, GWAS, SNP, CNV, Methylation, and Files.
- Clicking each tab should activate it, while the other 5 tabs remain in the same order.

<a name="features_link"></a>

## Features
***

<a name="data_filtering_link"></a>

### Data Filtering

#### Profile tab

- Filters should update data in the datatable on the fly (i.e., as values are selected or characters are typed).
  - *Site* dropdown should list all sites for users with `genomic_browser_view_allsites`.
  - *Site* dropdown should show only the user's site for users with `genomic_browser_view_site`.

- The datatable should display the following columns:

| No. | PSCID | Sex | Cohort | Files | SNPs | CNVs | CPGs |
| ---| --- | ---| --- | ---| --- | ---| ---|
| | | | | | | | |

- Clicking the *Clear Form* button should reset the filter.
- Clicking on column headers should sort data in ascending order on the first click and descending order on the second.

***

#### GWAS tab

- Filters should update data in the datatable on the fly.
- Clicking the *Clear Form* button should reset the filters.
- Column headers should toggle sort order on click.

***

#### SNP tab

- Filters should update data in the datatable on the fly.
  - Candidate filters:
    - *Site* dropdown behavior follows the same rules as above.
  - Genomic Range filters:
    - *Genomic Range* filter should show SNPs whose *StartLoc* is within the specified range (e.g., `chr14:100000-200000` includes SNPs on chromosome 14 between 100000 and 200000 inclusive).
    - Entering only a chromosome name should display all SNPs on that chromosome.

- The datatable should display:

| No.|PSCID|Sex|Cohort|Build|Platform|Allele A|Allele B|Reference Base|Minor Allele|Function Prediction|Damaging|Genotype Quality|
| ---|---|---|---|---|---|---|---|---|---|---|---|--- |
| | | | | | | | | | | | | |

- *Clear Form* resets filters.
- Column sorting works as above.

***

#### CNV tab

- Filters should update data in the datatable on the fly.
  - *Site* and *Genomic Range* filters behave as previously described.
  - Entering only the chromosome name should display all CNVs on that chromosome.

- Datatable columns:

| No.|PSCID|Sex|Cohort|Location|Type|Common|Characteristics|Inheritance|Platform |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | | | |

- *Clear Form* resets filters.
- Sorting applies to column headers.

***

#### Methylation tab

- Filters should update data in the datatable on the fly.
  - *Site* and *Genomic Range* filters behave as previously described.
  - *Genomic Range* filter should show SNPs with *StartLoc* within range (e.g., `chr14:100000-200000`).  

> Fixed typo: "prensent" → "present", "contain" → "contained"

- Datatable columns:

|No.|PSCID|Sex|Sample|Probe Seq A|Probe Loc B|Probe Seq B|Infinium Design|Color|Gene|Accession Number|Position|DMR|DHS|
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|     |     |     |     |     |     |     |     |     |     |     |     |     |     |

- *Clear Form* resets filters.
- Clicking on column headers should sort data in ascending order on the first click then descending order on the second click.

***

#### Files tab

- Filters should filter data presented in the Datatable on the fly (i.e as values are selected or characters are typed).

Datatable columns:

| No. | GenomicFileID | FileName | Description | FileType | Date Inserted | InsertedByUserID | Caveat | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | | |

- *Clear Form* resets filters.

***

<a name="datatable_link"></a>  

## Datatable

- Each tab should display:
  - Total records found  
  - Number of rows displayed  
  - Pagination (if total records exceed *rows per page*)
  - Changing *rows per page* should update pagination and visible rows

### Special formatted columns

#### Profile tab
- *PSCID* links to `timepoint_list` filtered to the candidate  
- *Files*, *SNPs*, *CNVs*, *CPGs* columns link to corresponding filtered tabs  

#### GWAS tab
- None

***

#### SNP tab
- *PSCID* links to `timepoint_list`  
- *RsID* links to [dbSNP](http://www.ncbi.nlm.nih.gov/SNP/)

***

#### CNV tab
- *PSCID* links to `timepoint_list`

***

#### Methylation tab
- *PSCID* links to `timepoint_list`  
- *Cpg Name*, *Gene*, *Accession Number*, *Island Loc* link to [UCSC Genome Browser](https://genome.ucsc.edu/cgi-bin/hgTracks)  
- Multiple gene names should open in new tabs/windows  

***

#### Files tab
- *FileName* links to **viewGenomicFile** page for that file only

<a name="data_download_link"></a>  

## Data Download

### CSV
- All 6 tab datatables should provide a *Download as CSV* button  
- Clicking it triggers file download  
- Downloaded file should reflect current filtered values

### View Genomic File
- The "Files" tab (or Genomic File Uploader subpage) should provide a *Download* button per file  
- Clicking it triggers a download
