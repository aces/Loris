#!/bin/sh
GIT_MYSQL=/[BACKUP_LOCATION]
for T in `mysql -N -B -e 'show tables'`;
do
    echo "Backing up $T"
    mysqldump Demo --complete-insert --no-create-db --no-create-info --skip-add-drop-table --verbose $T | sed -r 's/INSERT INTO (`[^`]+`)/TRUNCATE TABLE \1; INSERT INTO \1/g' > /data/demo_database_backups/split/demo-19-1_$T.sql
done;

