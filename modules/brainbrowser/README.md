# Brainbrowser

## Purpose

Brainbrowser allows visualization and navigation of the MINC images of a 
candidate's imaging session.


## Intended Users

The two primary types of users are:
- Imaging specialists doing online quality control (QC)
- Project radiologists reporting incidental findings.


## Scope

Brainbrowser allows visualization of MINC images directly within its browser.
The user can navigate those images with sagittal, coronal, and transverse 
slices displayed.  In addition, a `Play` button is available to make feasible 
the navigation through a 4-Dimensional image (such as time in the case of 
resting state fMRI scans, and directions in the case of DWI scans). 
Multiple volumes can be displayed simultaneously with the possibility to 
synchronize the coordinates across the different volumes when moving the cursor 
across any one of them. 
Image brightness and intensity can be adjusted by the user.
Finally, a measurement tool is also available allowing radiologists to report 
measurements on an incidental finding.


## Permissions

Since Brainbrowser is accessible from the Imaging Browser, its permissions are 
directly linked to those of the Imaging Browser module. Please consult the 
Imaging Browser 
[Permissions](../imaging_browser/README.md#imaging_browser_perm_link) 
for access details.

## Configurations

For Brainbrowser to load the MINC images successfully, the configuration path option 
`MINCToolsPath` should point to the path where the MINC toolkit is installed.