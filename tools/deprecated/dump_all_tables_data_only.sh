#!/usr/bin/env bash

set -euo pipefail

GIT_MYSQL=/[BACKUP_LOCATION]
DATABASE="Demo"

DIR="${0%/*}"
cd "$DIR"

for T in `mysql -N -B -e 'show tables'`;
do
    echo "Backing up $T"
    mysqldump $DATABASE --complete-insert --no-create-db --no-create-info --skip-opt --verbose --compact --add-locks $T | sed -E 's/LOCK TABLES (`[^`]+`)/TRUNCATE TABLE \1;\nLOCK TABLES \1/g' > ../../test/RBfiles/RB_$T.sql
done;

