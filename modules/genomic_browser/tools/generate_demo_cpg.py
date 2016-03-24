#!/usr/bin/python3

import sys

max_num = 100 + int(sys.argv[1])
for num in range(100,max_num):
    sys.stdout.write("INSERT IGNORE INTO candidate (CandID, PSCID, Gender, UserID, CenterID) VALUES (" + str(num).zfill(6) + ", CONCAT('AAA', " + str((num - 53)).zfill(4) + " ), 'admin', '" + ('Male' if 0 == num%2 else 'Female') + "', 1); \n")

sys.stdout.write("INSERT IGNORE INTO genomic_sample_candidate_rel (sample_label, CandID) SELECT PSCID,CandID FROM candidate; \n")
sys.stdout.write("INSERT IGNORE INTO genomic_cpg (sample_label, cpg_name, beta_value) select gsc.sample_label, a.cpg_name, RAND() from genomic_sample_candidate_rel gsc, (SELECT gca.cpg_name FROM genomic_cpg_annotation gca JOIN genome_loc gl ON (gl.GenomeLocID = gca.location_id) WHERE gl.Chromosome = '14' AND gl.StartLoc/10000000 BETWEEN 5 AND 6) a; \n")
