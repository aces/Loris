#!/bin/bash
set -e

source /etc/apache2/envvars
# if [ ! -e project/config.xml.tmp ]; then
if [ ! -e project/config.xml ]; then
    IPAddress=`ip addr | grep 'eth0' | tail -n1 | awk '{print $2}' | cut -f1  -d'/'`

    RANDOMPASS=`date | md5sum | head -c 16`
    if [ -z "$LORIS_SQL_DB" ]; then
         echo >&2 "WARNING: LORIS_SQL_DB not set. Assuming \"LorisDB\""
         LORIS_SQL_DB="LorisDB"
     fi
    if [ -z "$LORIS_SQL_HOST" ]; then
         echo >&2 "WARNING: LORIS_SQL_HOST not set. Assuming \"mysql\""
         LORIS_SQL_HOST="mysql"
     fi

     if [ -z "$LORIS_SQL_PASSWORD" ]; then
         echo >&2 "error: Loris is uninitialized and LORIS_SQL_PASSWORD not set. Please specify LORIS_SQL_PASSWORD";
         exit 1
     fi

     if [ -z "$LORIS_SQL_USER" ]; then
         echo >&2 "LORIS_SQL_USER not specified. Assuming \"loris\""
         LORIS_SQL_USER="loris"
     fi

     sed -e "s#%USERNAME%#$LORIS_SQL_USER#g" \
         -e "s#%PASSWORD%#$LORIS_SQL_PASSWORD#g" \
         -e "s#%DATABASE%#$LORIS_SQL_DB#g" \
         -e "s#%HOSTNAME%#$LORIS_SQL_HOST#g" \
         < docs/config/config.xml > project/config.xml

     echo "Configuring Loris to be accessible at http://$IPAddress. Please update configuration through admin module using admin user and password $RANDOMPASS."
     mysql $LORIS_SQL_DB -h$LORIS_SQL_HOST --user=$LORIS_SQL_USER --password="$LORIS_SQL_PASSWORD" -A -e "UPDATE Config SET Value='/var/www/loris/' WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='base')"
     mysql $LORIS_SQL_DB -h$LORIS_SQL_HOST --user=$LORIS_SQL_USER --password="$LORIS_SQL_PASSWORD" -A -e "UPDATE Config SET Value='$IPAddress' WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='host')"
     mysql $LORIS_SQL_DB -h$LORIS_SQL_HOST --user=$LORIS_SQL_USER --password="$LORIS_SQL_PASSWORD" -A -e "UPDATE Config SET Value='http://$IPAddress' WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='url')"

     # Update the password
     mysql $LORIS_SQL_DB -h$LORIS_SQL_HOST --user=$LORIS_SQL_USER --password="$LORIS_SQL_PASSWORD" -A -e "UPDATE users SET Password_md5=CONCAT('ab', md5('ab$RANDOMPASS')), Password_hash=null, UserID='admin' WHERE ID=1";


fi

exec "$@"
