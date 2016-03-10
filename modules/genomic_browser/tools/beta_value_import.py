#!/usr/bin/python3
import csv
import re

print("INSERT IGNORE INTO genotyping_platform (Name, Description, TechnologyType, Provider) VALUES ( 'HumanMethylation450k', 'Infinium® HumanMethylation450 BeadChip','Bisulfite conversion', 'Illumina');")
platform_subquery = "(SELECT PlatformID FROM genotyping_platform WHERE Name = 'HumanMethylation450k')"

annotation_file = '/data/loris/data/methylation/top10.txt'

with open(annotation_file, 'r') as f:
    #reader = csv.reader(f, delimiter='\t')
    reader = csv.DictReader(f, delimiter='\t')
    for line in reader:

        if 0 == len(line["NAME"]) or 0 == len(line["CHR"]) or 0 == len(line["MAPINFO"]):
            continue;

        print("INSERT IGNORE INTO genome_loc (Chromosome, EndLoc, StartLoc, Strand) VALUES ")
        print("  ('" + line["CHR"] + "'," + line["MAPINFO"] + "," + line["MAPINFO"] + ",'" + line["STRAND"] + "');")
        genome_loc_subquery = "(SELECT GenomeLocID FROM genome_loc WHERE Chromosome = '" + line["CHR"] + "' AND StartLoc = " + line["MAPINFO"] + " AND EndLoc = " + line["MAPINFO"] + ")"

        print("INSERT IGNORE INTO genomic_cpg_annotation (cpg_name, location_id, probe_id_a, address_id_a, peobe_seq_a, probe_id_b, address_id_b, probe_seq_b, design_type, color_channel, genome_build, probe_snp_10, gene_name, gene_acc_num, gene_group, island_loc, island_relation, fantom_promoter_loc, dmr, enhancer, hmm_island_loc, reg_feature_loc, reg_feature_group, dhs, platform_id) VALUES")

        cpg_name            = "'" + line["NAME"] + "'"          
        probe_id_a          = "'" + line["ProbeID_A"] + "'"
        location_id         = genome_loc_subquery
        address_id_a        = line["ADDRESSA_ID"]
        peobe_seq_a         = "'" + line["ALLELEA_PROBESEQ"] + "'"
        probe_id_b          = "'" + line["ProbeID_B"] + "'" if 0 < len(line["ProbeID_B"]) else 'null'
        address_id_b        = line["ADDRESSB_ID"] if 0 < len(line["ADDRESSB_ID"]) else 'null'
        probe_seq_b         = "'" + line["ALLELEB_PROBESEQ"] + "'" if 0 < len(line["ALLELEB_PROBESEQ"]) else 'null'
        design_type         = "'" + line["INFINIUM_DESIGN_TYPE"] + "'" if 0 < len(line["INFINIUM_DESIGN_TYPE"]) else 'null'
        color_channel       = "'" + line["COLOR_CHANNEL"] + "'" if 0 < len(line["COLOR_CHANNEL"]) else 'null'
        genome_build        = "'" + line["GENOME_BUILD"] + "'" if 0 < len(line["GENOME_BUILD"]) else 'null'
        probe_snp_10        = "'" + line["PROBE_SNPS_10"] + "'" if 0 < len(line["PROBE_SNPS_10"]) else 'null'
        gene_name           = "'" + line["UCSC_REFGENE_NAME"] + "'" if 0 < len(line["UCSC_REFGENE_NAME"]) else 'null'
        gene_acc_num        = "'" + line["UCSC_REFGENE_ACCESSION"] + "'" if 0 < len(line["UCSC_REFGENE_ACCESSION"]) else 'null'
        gene_group          = "'" + line["UCSC_REFGENE_GROUP"] + "'" if 0 < len(line["UCSC_REFGENE_GROUP"]) else 'null'
        island_loc          = "'" + line["UCSC_CPG_ISLANDS_NAME"] + "'" if 0 < len(line["UCSC_CPG_ISLANDS_NAME"]) else'null'
        island_relation     = "'" + line["RELATION_TO_UCSC_CPG_ISLAND"] + "'" if 0 < len(line["RELATION_TO_UCSC_CPG_ISLAND"]) else 'null'
        fantom_promoter_loc = "'" + line["PHANTOM"] + "'" if 0 < len(line["PHANTOM"]) else 'null'
        dmr                 = "'" + line["DMR"] + "'" if 0 < len(line["DMR"]) else 'null'
        enhancer            = line["ENHANCER"] if 0 < len(line["ENHANCER"]) else 'null'
        hmm_island_loc      = "'" + line["HMM_ISLAND"] + "'" if 0 < len(line["HMM_ISLAND"]) else 'null'
        reg_feature_loc     = "'" + line["REGULATORY_FEATURE_NAME"] + "'" if 0 < len(line["REGULATORY_FEATURE_NAME"]) else 'null'
        reg_feature_group   = "'" + line["REGULATORY_FEATURE_GROUP"] + "'" if 0 < len(line["REGULATORY_FEATURE_GROUP"]) else 'null'
        dhs                 = line["DHS"] if 0 < len(line["DHS"]) else 'null'
        platform_id         = platform_subquery
        
        print("(", ','.join([cpg_name, location_id, probe_id_a, address_id_a, peobe_seq_a, probe_id_b, address_id_b, probe_seq_b, design_type, color_channel, genome_build, probe_snp_10, gene_name, gene_acc_num, gene_group, island_loc, island_relation, fantom_promoter_loc, dmr, enhancer, hmm_island_loc, reg_feature_loc, reg_feature_group, dhs, platform_id]),  ");")

f.closed

