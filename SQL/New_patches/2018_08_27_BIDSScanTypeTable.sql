DROP TABLE IF EXISTS bids_mri_scan_type_rel;
DROP TABLE IF EXISTS bids_category;

CREATE TABLE `bids_category` (
 `BIDSCategoryID` int(3) NOT NULL AUTO_INCREMENT,
 `ImagingCategory` varchar(10) NOT NULL UNIQUE,
 PRIMARY KEY (`BIDSCategoryID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `bids_category` (ImagingCategory) VALUES
      ('anat'),
      ('func'),
      ('dwi'),
      ('fmap');

CREATE TABLE `bids_mri_scan_type_rel` (
  `MRIScanTypeID` int(10) unsigned NOT NULL,
  `BIDSCategory`varchar(10) DEFAULT NULL,
  `BIDSScanTypeSubCategory`varchar(255) DEFAULT NULL,
  `BIDSScanType` varchar(255) DEFAULT NULL,
  `BIDSMultiEcho`varchar(255) DEFAULT NULL,
  PRIMARY KEY  (`MRIScanTypeID`),
  KEY `FK_bids_mri_scan_type_rel` (`MRIScanTypeID`),
  CONSTRAINT `FK_bids_mri_scan_type_rel` FOREIGN KEY (`MRIScanTypeID`) REFERENCES `mri_scan_type` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_bids_category` FOREIGN KEY (`BIDSCategory`) REFERENCES `bids_category`(`ImagingCategory`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- Default schema scan types; make some of them named in a BIDS compliant manner
INSERT INTO bids_mri_scan_type_rel (MRIScanTypeID, BIDSCategory, BIDSScanTypeSubCategory, BIDSScanType, BIDSMultiEcho) SELECT mst.ID, 'func', 'rest', 'bold', NULL FROM mri_scan_type mst WHERE mst.Scan_type = 'fMRI';
INSERT INTO bids_mri_scan_type_rel (MRIScanTypeID, BIDSCategory, BIDSScanTypeSubCategory, BIDSScanType, BIDSMultiEcho) SELECT mst.ID, 'anat', NULL, 'FLAIR', NULL FROM mri_scan_type mst WHERE mst.Scan_type = 'flair';
INSERT INTO bids_mri_scan_type_rel (MRIScanTypeID, BIDSCategory, BIDSScanTypeSubCategory, BIDSScanType, BIDSMultiEcho) SELECT mst.ID, 'anat', NULL, 'T1w', NULL FROM mri_scan_type mst WHERE mst.Scan_type = 't1';
INSERT INTO bids_mri_scan_type_rel (MRIScanTypeID, BIDSCategory, BIDSScanTypeSubCategory, BIDSScanType, BIDSMultiEcho) SELECT mst.ID, 'anat', NULL, 'T2w', NULL FROM mri_scan_type mst WHERE mst.Scan_type = 't2';
INSERT INTO bids_mri_scan_type_rel (MRIScanTypeID, BIDSCategory, BIDSScanTypeSubCategory, BIDSScanType, BIDSMultiEcho) SELECT mst.ID, 'dwi', NULL, 'dwi', NULL FROM mri_scan_type mst WHERE mst.Scan_type = 'dti';
