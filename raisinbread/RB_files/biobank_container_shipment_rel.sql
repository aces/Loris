SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE biobank_container_shipment_rel;
LOCK TABLE biobank_container_shipment_rel WRITE;
LOAD DATA LOCAL INFILE 'biobank_container_shipment_rel.tsv' INTO TABLE biobank_container_shipment_rel
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
