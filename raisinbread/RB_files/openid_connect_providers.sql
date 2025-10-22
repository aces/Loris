SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE openid_connect_providers;
LOCK TABLE openid_connect_providers WRITE;
LOAD DATA LOCAL INFILE 'openid_connect_providers.tsv' INTO TABLE openid_connect_providers
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
