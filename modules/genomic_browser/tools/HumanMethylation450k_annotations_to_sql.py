#!/usr/bin/python3
#
# Usage :
# python3 HumanMethylation450k_annotations_to_sql.py <annotation_file> | mysql -u <user> -p <database>
#
# This script is a workaround when LOAD DATA INFILE can't be used.
# LOAD DATA INFILE is much faster and should be used if possible.

import csv
import re
import sys

def to_mysql_string(string):
    return "'" + string.replace("'","`") + "'" if 0 < len(string) else 'null'
annotation_file = sys.argv[1]

sys.stdout.write("WARNINGS;\n")
sys.stdout.write("SET @old_foreign_key_checks = @@foreign_key_checks, foreign_key_checks = 0;\n")
sys.stdout.write("SET @old_unique_checks = @@unique_checks, unique_checks = 0;\n")
sys.stdout.write("SET @old_autocommit = @@autocommit, autocommit = 0;\n")
sys.stdout.write("START TRANSACTION;\n")
sys.stdout.write("INSERT IGNORE INTO genotyping_platform (Name, Description, TechnologyType, Provider) VALUES ( 'HumanMethylation450k', 'Infinium HumanMethylation450 BeadChip','Bisulfite conversion', 'Illumina');\n")
sys.stdout.write("SET @platform_id = (SELECT PlatformID FROM genotyping_platform WHERE Name = 'HumanMethylation450k');\n")

line_counter = 0
with open(annotation_file, 'r') as f:
    # Read line until the [Assay] section starts. (Skip headers)
    for line in f:
       if re.search('^\[Assay\]', line) :
          break

    reader = csv.DictReader(f, delimiter=',')
    for line in reader:
      
        
        if line["Name"] == '':
            sys.stdout.write('-- Parser encoutered a line with an unexpected format.\n')
            sys.stdout.write('-- Closing file.\n')
            break

        if 0 == len(line["Name"]) or 0 == len(line["CHR"]) or 0 == len(line["MAPINFO"]):
            continue

        if line_counter % 500 == 0:
            sys.stdout.write("INSERT IGNORE INTO genomic_cpg_annotation (cpg_name, address_id_a, probe_seq_a, address_id_b, probe_seq_b, design_type, color_channel, genome_build, probe_snp_10, gene_name, gene_acc_num, gene_group, island_loc, island_relation, fantom_promoter_loc, dmr, enhancer, hmm_island_loc, reg_feature_loc, reg_feature_group, dhs, platform_id, Chromosome, Strand, EndLoc, Size, StartLoc) VALUES\n")

        cpg_name            = to_mysql_string(line["Name"])
        address_id_a        = line["AddressA_ID"] if 0 < len(line["AddressA_ID"]) else 'null'
        probe_seq_a         = to_mysql_string(line["AlleleA_ProbeSeq"])
        address_id_b        = line["AddressB_ID"] if 0 < len(line["AddressB_ID"]) else 'null'
        probe_seq_b         = to_mysql_string(line["AlleleA_ProbeSeq"])
        design_type         = to_mysql_string(line["Infinium_Design_Type"])
        color_channel       = to_mysql_string(line["Color_Channel"])
        genome_build        = to_mysql_string(line["Genome_Build"])
        probe_snp_10        = to_mysql_string(line["Probe_SNPs_10"])
        gene_name           = to_mysql_string(line["UCSC_RefGene_Name"])
        gene_acc_num        = to_mysql_string(line["UCSC_RefGene_Accession"])
        gene_group          = to_mysql_string(line["UCSC_RefGene_Group"])
        island_loc          = to_mysql_string(line["UCSC_CpG_Islands_Name"])
        island_relation     = to_mysql_string(line["Relation_to_UCSC_CpG_Island"])
        fantom_promoter_loc = to_mysql_string(line["Phantom"])
        dmr                 = to_mysql_string(line["DMR"])
        enhancer            = line["Enhancer"] if 0 < len(line["Enhancer"]) else 'null'
        hmm_island_loc      = to_mysql_string(line["HMM_Island"])
        reg_feature_loc     = to_mysql_string(line["Regulatory_Feature_Name"])
        reg_feature_group   = to_mysql_string(line["Regulatory_Feature_Group"])
        dhs                 = line["DHS"] if 0 < len(line["DHS"]) else 'null'
        chromosome          = to_mysql_string("chr" + line["CHR"])
        strand              = to_mysql_string(line["Strand"])
        endloc              = str(int(line["MAPINFO"]) + 1)
        size                = '1'
        startloc            = line["MAPINFO"]
        
        sys.stdout.write("(" + ','.join([cpg_name, address_id_a, probe_seq_a, address_id_b, probe_seq_b, design_type, color_channel, genome_build, probe_snp_10, gene_name, gene_acc_num, gene_group, island_loc, island_relation, fantom_promoter_loc, dmr, enhancer, hmm_island_loc, reg_feature_loc, reg_feature_group, dhs, '@platform_id', chromosome, strand, endloc, size, startloc]) + ")")

        line_counter += 1
        if line_counter % 500 == 0:
          sys.stdout.write(";\n")
        else:
          sys.stdout.write(",\n")

# INSERT A LAST LINE TO ADD A ; AT THE END. (INSERT IGNORE WILL SEND A WARNING)
sys.stdout.write("(" + ','.join([cpg_name, address_id_a, probe_seq_a, address_id_b, probe_seq_b, design_type, color_channel, genome_build, probe_snp_10, gene_name, gene_acc_num, gene_group, island_loc, island_relation, fantom_promoter_loc, dmr, enhancer, hmm_island_loc, reg_feature_loc, reg_feature_group, dhs, '@platform_id', chromosome, strand, endloc, size, startloc]) + ");\n")

sys.stdout.write("COMMIT;\n")
sys.stdout.write("SET autocommit = @old_autocommit;\n")
sys.stdout.write("SET unique_checks = @old_unique_checks;\n")
sys.stdout.write("SET foreign_key_checks = @old_foreign_key_checks;\n")
f.closed

