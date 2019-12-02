#!/usr/bin/env bash
# This script can be used to run integration tests
# To run:
#   - to run all integration tests, run script with no arguments:
#       example: bash integration.sh
#   - to run integration test for a specific module specify module name as script's 1st argument
#       example: bash integration.sh configuration

# Test database and test config.xml have to be created before running tests. This is a one time setup.
#   1 - create a test DB and source the default schemas (SQL/0000-00-*.sql)
#   2 - create a MySQL test user with a test password.
#   3 - Modify config.xml file in test/ folder if necessary.
#       Some changes to verify in this test/config.xml file:
#       *  Database connection credentials: specify credentials to the test DB which you create in step 1
#       *  Set sandbox mode to 1: <sandbox>1</sandbox>

set -euo pipefail

host="127.0.0.1"
database="LorisTest"
username="SQLTestUser"
password="TestPassword"
url="http://localhost:8000"

# Custom DB variables specified by optional commandline arguments
while getopts ":m:h:D:u:p:l:" opt; do
  case $opt in
    m) module="$OPTARG"
    ;;
    h) host="$OPTARG"
    ;;
    D) database="$OPTARG"
    ;;
    u) username="$OPTARG"
    ;;
    p) password="$OPTARG"
    ;;
    l) url="$OPTARG"
    ;;
    \?) echo "Invalid option -$OPTARG" >&2
    ;;
  esac
done

# set environment variable LORIS_DB_CONFIG which is the path to test config.xml file
sed -i \
    -e "s/%HOSTNAME%/$host/g" \
    -e "s/%USERNAME%/$username/g" \
    -e "s/%PASSWORD%/$password/g" \
    -e "s/%DATABASE%/$database/g" \
    config.xml
export LORIS_DB_CONFIG=$(pwd)/config.xml

#start PHP's built in webserver
php -S localhost:8000 -t ../htdocs ../htdocs/router.php  > /dev/null 2>&1 &
php_pid=$!

# Start Selenium and redirect Selenium WebDriver
# output to /dev/null so that it doesn't flood the
# screen in the middle of our other tests
# java -jar selenium-server-standalone-2.45.0.jar > /dev/null &
echo "******************************************************************
  REMINDER: Selenium needs to be running to run integration tests
******************************************************************";

# Set config values in the test DB
mysql -h $host -D $database -u $username -p$password -e "UPDATE Config SET Value='http://localhost:8000' WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='url')"

mysql -h $host -D $database -u $username -p$password -e "UPDATE Config SET Value='$(pwd | sed "s#test##")' WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='base')"


if [ ! -z "$module" ]; then
  # Run integration tests for a sepecific module
  echo Running integration test for module: $module;
  ../vendor/bin/phpunit --configuration phpunit.xml ../modules/$module/test
else
 # Run all integration tests
 ../vendor/bin/phpunit --configuration phpunit.xml --testsuite 'LorisCoreIntegrationTests'
 ../vendor/bin/phpunit --configuration phpunit.xml --testsuite 'LorisModuleIntegrationTests'
fi

kill $php_pid
