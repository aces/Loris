# Imaging Browser

## Purpose

The imaging browser is intended to allow users to view candidate
scan sessions collected for a study.

## Intended Users

The three primary types of users are:
1. Imaging specialists using the modules to do online QC
2. Project radiologists viewing images to report incidental findings
3. Site coordinators or researchers ensuring their uploaded scans have
   been processed and inserted into LORIS.

## Scope

The imaging browser displays processed images which meet the study's
inclusion criteria. The inclusion criteria (for most images) is defined
and enforced in the LORIS imaging pipeline scripts.  Derived or
processed scan types are also included and have their own insertion
criteria.

NOT in scope:

The imaging browser module does not display raw DICOMs or perform automated
quality control on images. It only displays images that have already been
inserted into LORIS.

## <a name="imaging_browser_perm_link"></a> Permissions

The imaging browser module uses the following permissions. Any one of them
(except imaging_browser_qc) is sufficient to have access to the module.

imaging_browser_view_allsites
    - This permission gives the user access to all scans in the database

imaging_browser_view_site
    - This permission gives the user access to scans from their own site(s) only

imaging_browser_phantom_allsites
    - This permission gives the user access to phantom, but not candidate, scans
      across the database

imaging_browser_phantom_ownsite
    - This permission gives the user access to phantom, but not candidate, data
      at the user's site(s).

imaging_browser_qc
    - This permission gives the user access to modify the quality control data
      for the associated scans and timepoints.

## Configurations

The imaging browser has the following configurations that affect its usage

#### Database Configurations

tblScanTypes - This setting determines which scan types are considered "NEW" for
        QC purposes. It also determines which modalities are displayed on the
        main imaging browser menu page.

ImagingBrowserLinkedInstruments - This setting defines which instruments to 
        include a link to on the "View Session" page.

useEDC - This setting determines whether "EDC" filtering dropdowns exist
        on the menu page.

issue_tracker_url - This setting defines a URL for LORIS to include a link to the 
        bug reporting system on the "View Session" page.

#### Install Configurations

For downloading large DICOM files, it may be necessary to increase the
 value of the `memory_limit` configuration option within `php.ini`.

## Interactions with LORIS

- The "Selected" set by the imaging QC specialist is used by the dataquery
  module in order to determine which scan to insert when multiple scans of
  a modality type exist for a given session. (The importer exists in
  `$LORIS/tools/CouchDB_Import_MRI.php` alongside all other CouchDB
  import scripts, but should logically be considered part of this module.)
- The imaging browser module includes links to BrainBrowser to visualize data.
- The control panel on the "View Session" page includes links to instruments
  named "mri_parameter_form" and "radiologyreview" if they exist for the
  currently viewed session.
- The control panel on the "View Session" page includes links to the instruments
  as configured by the study.
- The control panel on the "View Session" page includes links to the DICOM Archive 
  and download capabilities for any DICOM tars associated with the given session.
  Note that DICOM downloads will be prepended with the `PatientName` field 
  though they are not actually stored this way on the filesystem.
