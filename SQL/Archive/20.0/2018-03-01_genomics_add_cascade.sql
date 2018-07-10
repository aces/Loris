ALTER TABLE genomic_cpg DROP FOREIGN KEY `genomic_cpg_ibfk_1`;
ALTER TABLE genomic_cpg DROP FOREIGN KEY `genomic_cpg_ibfk_2`;
ALTER TABLE genomic_cpg ADD CONSTRAINT `genomic_cpg_ibfk_1` FOREIGN KEY (`sample_label`) REFERENCES `genomic_sample_candidate_rel` (`sample_label`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE genomic_cpg ADD CONSTRAINT `genomic_cpg_ibfk_2` FOREIGN KEY (`cpg_name`) REFERENCES `genomic_cpg_annotation` (`cpg_name`) ON DELETE CASCADE ON UPDATE CASCADE;
