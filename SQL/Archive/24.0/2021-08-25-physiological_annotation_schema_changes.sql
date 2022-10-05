ALTER TABLE `physiological_annotation_label`
MODIFY COLUMN LabelDescription TEXT;

ALTER TABLE `physiological_annotation_label`
ADD COLUMN AnnotationFileID INT(10) UNSIGNED DEFAULT NULL AFTER AnnotationLabelID;

DROP INDEX LabelName ON `physiological_annotation_label`;

ALTER TABLE `physiological_annotation_parameter`
MODIFY COLUMN Author VARCHAR(255);

CREATE TABLE `physiological_annotation_rel` (
    `AnnotationTSV`  INT(10)    UNSIGNED NOT NULL,
    `AnnotationJSON` INT(10)    UNSIGNED NOT NULL,
    PRIMARY KEY (`AnnotationTSV`, `AnnotationJSON`),
    CONSTRAINT `FK_AnnotationTSV`
        FOREIGN KEY (`AnnotationTSV`)
        REFERENCES `physiological_annotation_file` (`AnnotationFileID`),
    CONSTRAINT `FK_AnnotationJSON`
        FOREIGN KEY (`AnnotationJSON`)
        REFERENCES `physiological_annotation_file` (`AnnotationFileID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

