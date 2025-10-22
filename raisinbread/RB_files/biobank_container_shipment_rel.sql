SET FOREIGN_KEY_CHECKS=0;
LOCK TABLE biobank_container_shipment_rel WRITE;
TRUNCATE TABLE biobank_container_shipment_rel;
LOAD DATA LOCAL INFILE 'biobank_container_shipment_rel.tsv' INTO TABLE biobank_container_shipment_rel
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
