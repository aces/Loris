-- This patch adds min & max columns for every field in `mri_protocol` & `mri_protocol_checks` which presently can hold range values.
ALTER TABLE
	`mri_protocol`
		ADD COLUMN `TR_min` DECIMAL(10,4) DEFAULT NULL AFTER `Scan_type`,
		ADD COLUMN `TR_max` DECIMAL(10,4) DEFAULT NULL AFTER `TR_min`,
		ADD COLUMN `TE_min` DECIMAL(10,4) DEFAULT NULL AFTER `TR_max`,
		ADD COLUMN `TE_max` DECIMAL(10,4)  DEFAULT NULL AFTER `TE_min`,
		ADD COLUMN `TI_min` DECIMAL(10,4)  DEFAULT NULL AFTER `TE_max`,
		ADD COLUMN `TI_max` DECIMAL(10,4)  DEFAULT NULL AFTER `TI_min`,
		ADD COLUMN `slice_thickness_min` DECIMAL(7,4) DEFAULT NULL AFTER `TI_max`,
		ADD COLUMN `slice_thickness_max` DECIMAL(7,4) DEFAULT NULL AFTER `slice_thickness_min`,
		ADD COLUMN `xspace_min` int(4) DEFAULT NULL AFTER `slice_thickness_max`,
		ADD COLUMN `xspace_max` int(4) DEFAULT NULL AFTER `xspace_min`,
		ADD COLUMN `yspace_min` int(4) DEFAULT NULL AFTER `xspace_max`,
		ADD COLUMN `yspace_max` int(4) DEFAULT NULL AFTER `yspace_min`,
		ADD COLUMN `zspace_min` int(4) DEFAULT NULL AFTER `yspace_max`,
		ADD COLUMN `zspace_max` int(4) DEFAULT NULL AFTER `zspace_min`,
		ADD COLUMN `xstep_min` DECIMAL(9,4) DEFAULT NULL AFTER `zspace_max`,
		ADD COLUMN `xstep_max` DECIMAL(9,4) DEFAULT NULL AFTER `xstep_min`,
    ADD COLUMN `ystep_min` DECIMAL(9,4) DEFAULT NULL AFTER `xstep_max`,
    ADD COLUMN `ystep_max` DECIMAL(9,4) DEFAULT NULL AFTER `ystep_min`,
    ADD COLUMN `zstep_min` DECIMAL(9,4) DEFAULT NULL AFTER `ystep_max`,
    ADD COLUMN `zstep_max` DECIMAL(9,4) DEFAULT NULL AFTER `zstep_min`,
		ADD COLUMN `time_min` int(4) DEFAULT NULL AFTER `zstep_max`,
		ADD COLUMN `time_max` int(4) DEFAULT NULL AFTER `time_min`,
		DROP `FOV_x_range`,
		DROP `FOV_y_range`,
		DROP `FOV_z_range`;

ALTER TABLE
  `mri_protocol_checks`
    ADD COLUMN `ValidMin` int(4) DEFAULT NULL AFTER `Header`,
    ADD COLUMN `ValidMax` int(4) DEFAULT NULL AFTER `ValidMin`;

