ALTER TABLE genotyping_platform ADD UNIQUE (Name);
ALTER TABLE genome_loc ADD UNIQUE KEY (Chromosome, StartLoc, EndLoc);
ALTER TABLE genome_loc ADD INDEX (Chromosome, EndLoc);

DROP TABLE IF EXISTS `genomic_sample_candidate_rel`;
CREATE TABLE `genomic_sample_candidate_rel` (
  `sample_label` varchar(100) NOT NULL,
  `CandID` int(6) NOT NULL,
  PRIMARY KEY (sample_label, CandID),
  UNIQUE KEY `sample_label` (`sample_label`),  
  FOREIGN KEY (CandID)
    REFERENCES candidate(CandID)
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8
COMMENT = '';

DROP TABLE IF EXISTS `genomic_cpg_annotation`;
CREATE TABLE `genomic_cpg_annotation` (
  `cpg_name` varchar(100) NOT NULL,
  `location_id` bigint(20) NOT NULL,
  `address_id_a` int unsigned NULL,
  `probe_seq_a` varchar(100) NULL, 
  `address_id_b` int unsigned NULL,
  `probe_seq_b` varchar(100) NULL,
  `design_type` varchar(20) NULL,
  `color_channel` enum ('Red', 'Grn') NULL,
  `genome_build` varchar(40) NULL,
  `probe_snp_10` varchar(40) NULL,
  `gene_name` text NULL,
  `gene_acc_num` text NULL,
  `gene_group` text NULL,
  `island_loc` varchar(100) NULL,
  `island_relation` enum ('island', 'n_shelf', 'n_shore', 's_shelf', 's_shore') NULL, 
  `fantom_promoter_loc` varchar(100) NULL,
  `dmr` enum ('CDMR', 'DMR', 'RDMR') NULL,
  `enhancer` tinyint(1) NULL,
  `hmm_island_loc` varchar(100) NULL,
  `reg_feature_loc` varchar(100) NULL,
  `reg_feature_group` varchar(100) NULL,
  `dhs` tinyint(1) NULL,
  `platform_id` bigint(20) NULL,
  PRIMARY KEY (cpg_name),
  FOREIGN KEY (location_id)
    REFERENCES genome_loc(`GenomeLocID`)
    ON DELETE RESTRICT,
  FOREIGN KEY (platform_id)
    REFERENCES genotyping_platform(`PlatformID`)
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8
COMMENT = '';

DROP TABLE IF EXISTS `genomic_cpg`;
CREATE TABLE `genomic_cpg` (
  `sample_label` varchar(100) NOT NULL,
  `cpg_name` varchar(100) NOT NULL,
  `beta_value` decimal(4,3) DEFAULT NULL,
  PRIMARY KEY (sample_label, cpg_name),
  FOREIGN KEY (sample_label)
    REFERENCES genomic_sample_candidate_rel(sample_label)
    ON DELETE RESTRICT,
  FOREIGN KEY (cpg_name)
    REFERENCES genomic_cpg_annotation(cpg_name)
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8
COMMENT = '';
