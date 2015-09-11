#!/usr/bin/env bash
# This script can be used to run integration tests
# To run:
#   - to run all integration tests, run script with no arguments:
#       example: bash integration.sh
#   - to run integration test for a specific module specify module name as script's 1st argument
#       example: bash integration.sh configuration

# Test database and test config.xml have to be created before running tests. This is a one time setup.
#   1 - create a LorisTest DB and source the default schema (lori/SQL/0000-00-00-schema.sql)
#   2 - create a MySQL user SQLTestUser with password TestPassword.
#   3 - Modify config.xml file in loris/test/ folder.
#       Some changes to make in this loris/test/config.xml file:
#       *  Database connection credentials: specify credentials to LorisTest DB which you create in step 1
#       *  Set sandbox mode to 1: <sandbox>1</sandbox>
#       *  Set SyncAccounts to false: <SyncAccounts>false</SyncAccounts>

# set environment variable LORIS_DB_CONFIG which is the path to test config.xml file
export LORIS_DB_CONFIG=$(pwd)/config.xml

#start PHP's built in webserver
php -S localhost:8000 -t ../htdocs 2>1 > /dev/null &

# Start Selenium and redirect Selenium WebDriver
# output to /dev/null so that it doesn't flood the
# screen in the middle of our other tests
#java -jar /home/kmarasinska/Selenium_server/selenium-server-standalone-2.45.0.jar > /dev/null &
echo "******************************************************************
  REMINDER: Selenium needs to be running to run integration tests
******************************************************************";

# Set config values in LorisTest DB
mysql -D LorisTest -u SQLTestUser -pTestPassword -e "UPDATE Config SET Value='http://localhost:8000' WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='url')"

mysql -D LorisTest -u SQLTestUser -pTestPassword -e "UPDATE Config SET Value='$(pwd | sed "s#test##")' WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='base')"


if [ ! -z "$1" ]; then
  # Run integration tests for a sepecific module
  echo Running integration test for module: $1;
  ../vendor/bin/phpunit --configuration phpunit.xml ../modules/$1/test
else
 # Run all integration tests
 ../vendor/bin/phpunit --configuration phpunit.xml --testsuite 'Loris Core Integration Tests'
 ../vendor/bin/phpunit --configuration phpunit.xml --testsuite 'Loris Module Integration Tests'
fi

