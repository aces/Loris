CREATE TABLE `bids_category` (
 `BIDSCategoryID`   int(3)      UNSIGNED NOT NULL AUTO_INCREMENT,
 `BIDSCategoryName` varchar(10)          NOT NULL UNIQUE,
 PRIMARY KEY (`BIDSCategoryID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `bids_category` (BIDSCategoryName) VALUES
      ('anat'),
      ('func'),
      ('dwi'),
      ('fmap');

CREATE TABLE `bids_scan_type_subcategory` (
  `BIDSScanTypeSubCategoryID` int(3)       UNSIGNED NOT NULL AUTO_INCREMENT,
  `BIDSScanTypeSubCategory`   varchar(100)          NOT NULL UNIQUE,
  PRIMARY KEY (`BIDSScanTypeSubCategoryID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `bids_scan_type_subcategory` (BIDSScanTypeSubCategory) VALUES
  ('task-rest');

CREATE TABLE `bids_scan_type` (
  `BIDSScanTypeID` int(3)       UNSIGNED NOT NULL AUTO_INCREMENT,
  `BIDSScanType`   varchar(100)          NOT NULL UNIQUE,
  PRIMARY KEY (`BIDSScanTypeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `bids_scan_type` (BIDSScanType) VALUES
  ('bold'),
  ('FLAIR'),
  ('T1w'),
  ('T2w'),
  ('dwi');

CREATE TABLE `bids_mri_scan_type_rel` (
  `MRIScanTypeID`             int(10) UNSIGNED NOT NULL,
  `BIDSCategoryID`            int(3)  UNSIGNED DEFAULT NULL,
  `BIDSScanTypeSubCategoryID` int(3)  UNSIGNED DEFAULT NULL,
  `BIDSScanTypeID`            int(3)  UNSIGNED DEFAULT NULL,
  `BIDSEchoNumber`            int(3)  UNSIGNED DEFAULT NULL,
  PRIMARY KEY  (`MRIScanTypeID`),
  KEY `FK_bids_mri_scan_type_rel` (`MRIScanTypeID`),
  CONSTRAINT `FK_bids_mri_scan_type_rel`     FOREIGN KEY (`MRIScanTypeID`)             REFERENCES `mri_scan_type` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_bids_category`              FOREIGN KEY (`BIDSCategoryID`)            REFERENCES `bids_category`(`BIDSCategoryID`),
  CONSTRAINT `FK_bids_scan_type_subcategory` FOREIGN KEY (`BIDSScanTypeSubCategoryID`) REFERENCES `bids_scan_type_subcategory` (`BIDSScanTypeSubCategoryID`),
  CONSTRAINT `FK_bids_scan_type`             FOREIGN KEY (`BIDSScanTypeID`)            REFERENCES `bids_scan_type` (`BIDSScanTypeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- Default schema scan types; make some of them named in a BIDS compliant manner
INSERT INTO bids_mri_scan_type_rel
  (MRIScanTypeID, BIDSCategoryID, BIDSScanTypeSubCategoryID, BIDSScanTypeID, BIDSEchoNumber)
  VALUES
  (
    (SELECT ID FROM mri_scan_type WHERE Scan_type = 'flair'),
    (SELECT BIDSCategoryID FROM bids_category WHERE BIDSCategoryName='anat'),
    NULL,
    (SELECT BIDSScanTypeID FROM bids_scan_type WHERE BIDSSCanType='FLAIR'),
    NULL
  ),
  (
    (SELECT ID FROM mri_scan_type WHERE Scan_type = 'fMRI'),
    (SELECT BIDSCategoryID FROM bids_category WHERE BIDSCategoryName='func'),
    (SELECT BIDSScanTypeSubCategoryID FROM bids_scan_type_subcategory WHERE BIDSScanTypeSubCategory='task-rest'),
    (SELECT BIDSScanTypeID FROM bids_scan_type WHERE BIDSSCanType='bold'),
    NULL
  ),
  (
    (SELECT ID FROM mri_scan_type WHERE Scan_type = 't1'),
    (SELECT BIDSCategoryID FROM bids_category WHERE BIDSCategoryName='anat'),
    NULL,
    (SELECT BIDSScanTypeID FROM bids_scan_type WHERE BIDSSCanType='T1w'),
    NULL
  ),
  (
    (SELECT ID FROM mri_scan_type WHERE Scan_type = 't2'),
    (SELECT BIDSCategoryID FROM bids_category WHERE BIDSCategoryName='anat'),
    NULL,
    (SELECT BIDSScanTypeID FROM bids_scan_type WHERE BIDSSCanType='T2w'),
    NULL
  ),
  (
    (SELECT ID FROM mri_scan_type WHERE Scan_type = 'dti'),
    (SELECT BIDSCategoryID FROM bids_category WHERE BIDSCategoryName='dwi'),
    NULL,
    (SELECT BIDSScanTypeID FROM bids_scan_type WHERE BIDSSCanType='dwi'),
    NULL
  );
