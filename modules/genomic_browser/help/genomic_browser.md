# Genomic Browser

This module is intended to allow users to visualize the results of already analyzed genetic tests cross-linked with behavioral and imaging candidate data.

The intended users are researchers and study personnel browsing and reviewing summary data. This module is a beta version which aims to present summary genomic data of several types so that researchers can usefully review and explore data available for study participants in a cross-modal context. SNP, CNV, and methylation (epigenomic) data are example types of data supported.

Utilities are included for uploading and visualizing data, and these functions can be extended for additional data types. This module is not designed to replace existing databases designed for storing genomic data.

### Usage
You can switch between the different tabs to view different types of genomic data. The tabs are:
- Profile, GWAS, SNP, CNV, Methylation and Files
- **Profiles**: This tab allows you to get a brief summary of the data available for each participant, including whether SNPs, CNVs and CPGs were found or not.
- **GWAS**: This tab allows you to visualize the results of a genome-wide association study (GWAS) for each participant.
- **SNP**: This tab allows you to visualize the results of a single nucleotide polymorphism (SNP) analysis for each participant.
- **CNV**: This tab allows you to visualize the results of a copy number variation (CNV) analysis for each participant.
- **Methylation**: This tab allows you to visualize the results of a methylation analysis for each participant.
- **Files**: This tab allows you to upload and download files related to the genomic data.

### Uploading Data
To upload data, you can use the "Upload" button in the "Files" tab. This will allow you to select a file from your computer and upload it to the server. The file should be in a format that is compatible with the module, such as CSV.
