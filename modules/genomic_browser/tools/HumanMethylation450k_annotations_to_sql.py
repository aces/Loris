#!/usr/bin/python3
import csv
import re
import sys

# TODO Chack why there is only 485512 on 485577 annotation inserted 
# TODO Make this script work using the Illumina ftp available file
# TODO Benchmark for index creation after commit

def to_mysql_string(string):
    return "'" + string.replace("'","`") + "'" if 0 < len(string) else 'null'
annotation_file = sys.argv[1]

sys.stdout.write("SET @old_autocommit = @@autocommit, autocommit = 0;")
sys.stdout.write("START TRANSACTION;")
sys.stdout.write("INSERT IGNORE INTO genotyping_platform (Name, Description, TechnologyType, Provider) VALUES ( 'HumanMethylation450k', 'Infinium® HumanMethylation450 BeadChip','Bisulfite conversion', 'Illumina');")
platform_subquery = "(SELECT PlatformID FROM genotyping_platform WHERE Name = 'HumanMethylation450k')"

with open(annotation_file, 'r') as f:
    #reader = csv.reader(f, delimiter='\t')
    reader = csv.DictReader(f, delimiter='\t')
    for line in reader:

        if 0 == len(line["NAME"]) or 0 == len(line["CHR"]) or 0 == len(line["MAPINFO"]):
            continue;

        sys.stdout.write("INSERT IGNORE INTO genome_loc (Chromosome, EndLoc, StartLoc, Strand) VALUES ")
        sys.stdout.write("  ('" + line["CHR"] + "'," + line["MAPINFO"] + "," + line["MAPINFO"] + ",'" + line["STRAND"] + "');")
        genome_loc_subquery = "(SELECT GenomeLocID FROM genome_loc WHERE Chromosome = '" + line["CHR"] + "' AND StartLoc = " + line["MAPINFO"] + " AND EndLoc = " + line["MAPINFO"] + ")"

        sys.stdout.write("INSERT IGNORE INTO genomic_cpg_annotation (cpg_name, location_id, probe_id_a, address_id_a, peobe_seq_a, probe_id_b, address_id_b, probe_seq_b, design_type, color_channel, genome_build, probe_snp_10, gene_name, gene_acc_num, gene_group, island_loc, island_relation, fantom_promoter_loc, dmr, enhancer, hmm_island_loc, reg_feature_loc, reg_feature_group, dhs, platform_id) VALUES")

        cpg_name            = to_mysql_string(line["NAME"])
        probe_id_a          = to_mysql_string(line["ProbeID_A"])
        location_id         = genome_loc_subquery
        address_id_a        = line["ADDRESSA_ID"] if 0 < len(line["ADDRESSA_ID"]) else 'null'
        peobe_seq_a         = to_mysql_string(line["ALLELEA_PROBESEQ"])
        probe_id_b          = to_mysql_string(line["ProbeID_B"])
        address_id_b        = line["ADDRESSB_ID"] if 0 < len(line["ADDRESSB_ID"]) else 'null'
        probe_seq_b         = to_mysql_string(line["ALLELEB_PROBESEQ"])
        design_type         = to_mysql_string(line["INFINIUM_DESIGN_TYPE"])
        color_channel       = to_mysql_string(line["COLOR_CHANNEL"])
        genome_build        = to_mysql_string(line["GENOME_BUILD"])
        probe_snp_10        = to_mysql_string(line["PROBE_SNPS_10"])
        gene_name           = to_mysql_string(line["UCSC_REFGENE_NAME"])
        gene_acc_num        = to_mysql_string(line["UCSC_REFGENE_ACCESSION"])
        gene_group          = to_mysql_string(line["UCSC_REFGENE_GROUP"])
        island_loc          = to_mysql_string(line["UCSC_CPG_ISLANDS_NAME"])
        island_relation     = to_mysql_string(line["RELATION_TO_UCSC_CPG_ISLAND"])
        fantom_promoter_loc = to_mysql_string(line["PHANTOM"])
        dmr                 = to_mysql_string(line["DMR"])
        enhancer            = line["ENHANCER"] if 0 < len(line["ENHANCER"]) else 'null'
        hmm_island_loc      = to_mysql_string(line["HMM_ISLAND"])
        reg_feature_loc     = to_mysql_string(line["REGULATORY_FEATURE_NAME"])
        reg_feature_group   = to_mysql_string(line["REGULATORY_FEATURE_GROUP"])
        dhs                 = line["DHS"] if 0 < len(line["DHS"]) else 'null'
        platform_id         = platform_subquery
        
        sys.stdout.write("(" + ','.join([cpg_name, location_id, probe_id_a, address_id_a, peobe_seq_a, probe_id_b, address_id_b, probe_seq_b, design_type, color_channel, genome_build, probe_snp_10, gene_name, gene_acc_num, gene_group, island_loc, island_relation, fantom_promoter_loc, dmr, enhancer, hmm_island_loc, reg_feature_loc, reg_feature_group, dhs, platform_id]) + ");")

sys.stdout.write("COMMIT;")
sys.stdout.write("SET autocommit = @old_autocommit;")
f.closed

