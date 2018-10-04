FROM mysql:5.7

COPY SQL/0000-00-00-schema.sql /0000-00-00-schema.sql
COPY SQL/0000-00-01-Permission.sql /0000-00-01-Permission.sql
COPY SQL/0000-00-02-Menus.sql /0000-00-02-Menus.sql
COPY SQL/0000-00-03-ConfigTables.sql /0000-00-03-ConfigTables.sql
COPY SQL/0000-00-04-Help.sql /0000-00-04-Help.sql
COPY test/RBdata.sql /RBdata.sql
COPY test/test_instrument/testtest.sql /test_instrument.sql
COPY test/test_instrument/medical_history.sql  /medical_history.sql

ADD docs/Docker/LorisDB-EntryPoint.sh /entrypoint.sh

VOLUME /var/lib/mysql
CMD ["mysqld_safe", "--datadir=/var/lib/mysql"]
ENTRYPOINT ["/bin/bash", "/entrypoint.sh"]
