FROM mysql:5.7

ARG BASE_DIR

COPY SQL/0000-00-00-schema.sql /0000-00-00-schema.sql
COPY SQL/0000-00-01-Permission.sql /0000-00-01-Permission.sql
COPY SQL/0000-00-02-Menus.sql /0000-00-02-Menus.sql
COPY SQL/0000-00-03-ConfigTables.sql /0000-00-03-ConfigTables.sql
COPY SQL/0000-00-04-Help.sql /0000-00-04-Help.sql
COPY test/test_instrument/testtest.sql /test_instrument.sql
COPY test/RBdata.sql /RBdata.sql
COPY test/test_instrument/medical_history.sql /medical_history.sql
COPY docs/instruments/radiology_review.sql /radiology_review.sql

RUN echo "Use LorisTest;" | cat - \
    0000-00-00-schema.sql \
    0000-00-01-Permission.sql \
    0000-00-02-Menus.sql \
    0000-00-03-ConfigTables.sql \
    0000-00-04-Help.sql \
    test_instrument.sql \
    RBdata.sql \
    medical_history.sql \
    radiology_review.sql > /docker-entrypoint-initdb.d/0000-compiled.sql 

RUN echo "Use LorisTest;" >> /docker-entrypoint-initdb.d/0001-paths.sql
RUN echo "UPDATE Config SET Value='${BASE_DIR}/' WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='base');" >> /docker-entrypoint-initdb.d/0001-paths.sql
RUN echo "UPDATE Config SET Value='http://web:8000' WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='url');" >> /docker-entrypoint-initdb.d/0001-paths.sql

RUN echo "INSERT INTO test_names (Test_name, Full_name, Sub_group, IsDirectEntry) VALUES ('testtest', 'testtest', '1','1');" >> /docker-entrypoint-initdb.d/0003-instrument.sql
RUN echo "INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, SubprojectID, Visit_label, CenterID) VALUES ('testtest', '1', '99999', 'Y', 'V1', '1', '2', NULL);" >> /docker-entrypoint-initdb.d/0003-instrument.sql
RUN echo "GRANT UPDATE,INSERT,SELECT,DELETE,DROP,CREATE TEMPORARY TABLES ON LorisTest.* TO 'SQLTestUser'@'%' IDENTIFIED BY 'TestPassword' WITH GRANT OPTION;" >> /docker-entrypoint-initdb.d/0004-sql-user.sql
