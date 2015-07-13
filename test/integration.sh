#!/usr/bin/env bash
# This script can be used to run integration tests

# Test databse and test config.xml have to be created before running tests. This is a one time setup.
#   1 - create a LorisTest DB from the default schema (lori/SQL/0000-00-00-schema.sql)
#   2 - create a MySQL user SQLTestUser with password TestPassword & specify the password in the mysql commands (with option -p) below
#   3 - Create a config.xml file in loris/test/ folder.
#       Changes to make in this config.xml file:
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

# Set config values in LorisTest DB
mysql -D LorisTest -u SQLTestUser -pTestPassword -e "UPDATE Config SET Value='http://localhost:8000' WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='url')"

mysql -D LorisTest -u SQLTestUser -pTestPassword -e "UPDATE Config SET Value='$(pwd | sed "s#test##")' WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='base')"
#mysql -D LorisTest -u SQLTestUser -pkarolina -e "UPDATE Config INNER JOIN ConfigSettings ON (`Config`.`ConfigID`=`ConfigSettings`.`ID`) SET Config.V1alue='http://localhost:8000' WHERE ConfigSettings.Name='url'"


# Run integration tests per module
../vendor/bin/phpunit --configuration phpunit.xml ../modules/brainbrowser/test
../vendor/bin/phpunit --configuration phpunit.xml ../modules/candidate_list/test
../vendor/bin/phpunit --configuration phpunit.xml ../modules/candidate_parameters/test
../vendor/bin/phpunit --configuration phpunit.xml ../modules/configuration/test
../vendor/bin/phpunit --configuration phpunit.xml ../modules/conflict_resolver/test
../vendor/bin/phpunit --configuration phpunit.xml ../modules/create_timepoint/test
../vendor/bin/phpunit --configuration phpunit.xml ../modules/dashboard/test
../vendor/bin/phpunit --configuration phpunit.xml ../modules/data_integrity_flag/test
../vendor/bin/phpunit --configuration phpunit.xml ../modules/data_team_helper/test
../vendor/bin/phpunit --configuration phpunit.xml ../modules/datadict/test
../vendor/bin/phpunit --configuration phpunit.xml ../modules/dicom_archive/test
../vendor/bin/phpunit --configuration phpunit.xml ../modules/document_repository/test
../vendor/bin/phpunit --configuration phpunit.xml ../modules/examiner/test
../vendor/bin/phpunit --configuration phpunit.xml ../modules/final_radiological_review/test
../vendor/bin/phpunit --configuration phpunit.xml ../modules/genomic_browser/test
../vendor/bin/phpunit --configuration phpunit.xml ../modules/help_editor/test
../vendor/bin/phpunit --configuration phpunit.xml ../modules/imaging_browser/test
../vendor/bin/phpunit --configuration phpunit.xml ../modules/instrument_builder/test
../vendor/bin/phpunit --configuration phpunit.xml ../modules/instrument_list/test
../vendor/bin/phpunit --configuration phpunit.xml ../modules/instrument_manager/test
../vendor/bin/phpunit --configuration phpunit.xml ../modules/mri_upload/test
../vendor/bin/phpunit --configuration phpunit.xml ../modules/mri_violations/test
../vendor/bin/phpunit --configuration phpunit.xml ../modules/new_profile/test
../vendor/bin/phpunit --configuration phpunit.xml ../modules/next_stage/test
../vendor/bin/phpunit --configuration phpunit.xml ../modules/reliability/test
../vendor/bin/phpunit --configuration phpunit.xml ../modules/statistics/test
../vendor/bin/phpunit --configuration phpunit.xml ../modules/survey_accounts/test
../vendor/bin/phpunit --configuration phpunit.xml ../modules/timepoint_flag/test
../vendor/bin/phpunit --configuration phpunit.xml ../modules/timepoint_list/test
../vendor/bin/phpunit --configuration phpunit.xml ../modules/training/test
../vendor/bin/phpunit --configuration phpunit.xml ../modules/user_accounts/test