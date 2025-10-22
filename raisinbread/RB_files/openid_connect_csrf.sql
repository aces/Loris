SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE openid_connect_csrf;
LOCK TABLE openid_connect_csrf WRITE;
LOAD DATA LOCAL INFILE 'openid_connect_csrf.tsv' INTO TABLE openid_connect_csrf
 IGNORE 1 LINES;
SET FOREIGN_KEY_CHECKS=1;
