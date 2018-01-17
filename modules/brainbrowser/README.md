# Brainbrowser

## Purpose

Brainbrowser is intended to allow users to visualize candidate scan session MINC 
volumes collected for a study.

## Intended Users

The two primary types of users are:
- Imaging specialists doing online QC
- Project radiologists reporting incidental findings.


## Scope

Brainbrowser allows navigating volumes in sagittal, coronal, and transverse 
slices. Multiple volumes can be displayed simultaneously and coordinates
synchronized across the multiple volumes, if desired. Image brightness and 
intensity can be set by the user.
A `Play` button is also available to make feasible the navigation through the 
time dimension of a 4-Dimensional image (such as resting state fMRI scan). 
A measurement tool is also available allowing radiologist to report measurements
of an incidental finding.


## Permissions

Since Brainbrowser is accessible from Imaging Browser, its permissions are 
directly linked to those of Imaging Browser. Please consult the Imaging Browser 
[Permissions](https://github.com/aces/Loris/blob/minor/modules/imaging_browser/README.md#imaging_browser_perm_link) 
for access details.

## Configurations

For Brainbrowser to load the MINC images successfully, the `config.xml` option 
`MINCToolsPath` should point to the path where the MINC toolkit is installed.