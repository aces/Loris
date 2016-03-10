-- ALTER TABLE genome_loc ADD Description text, MODIFY Strand enum ('forward', 'reverse');
ALTER TABLE genotyping_platform ADD UNIQUE (Name);

DROP TABLE IF EXISTS `genomic_sample_candidate_rel`;
CREATE TABLE `genomic_sample_candidate_rel` (
  `sample_label` varchar(100) NOT NULL,
  `candidate_id` int unsigned NOT NULL,
  PRIMARY KEY (sample_label, candidate_id),
  FOREIGN KEY (candidate_id)
    REFERENCES candidate(ID)
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8
COMMENT = '';

DROP TABLE IF EXISTS `genomic_cpg_annotation`;
CREATE TABLE `genomic_cpg_annotation` (
  `cpg_name` varchar(100) NOT NULL,
  `probe_id_a` varchar(45) NULL,
  `location_id` bigint(20) NOT NULL,
  `address_id_a` int unsigned NULL,
  `peobe_seq_a` varchar(100) NULL, 
  `probe_id_b` varchar(45) NULL,
  `address_id_b` int unsigned NULL,
  `probe_seq_b` varchar(100) NULL,
  `design_type` varchar(20) NULL,
  `color_channel` enum ('Red', 'Grn') NULL,
  `genome_build` varchar(40) NULL,
  `probe_snp_10` varchar(40) NULL,
  `gene_name` text NULL,
  `gene_acc_num` text NULL,
  `gene_group` text NULL,
  `island_loc_id` bigint(20) NULL,
  `island_relation` enum ('island', 'n_shelf', 'n_shore', 's_shelf', 's_shore') NULL, 
  `fantom_promoter_loc_id` bigint(20) NULL,
  `dmr` enum ('CDMR', 'DMR', 'RDMR') NULL,
  `enhancer` tinyint(1) NULL,
  `hmm_island_loc_id` bigint(20) NULL,
  `reg_feature_loc_id` bigint(20) NULL,
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
