#!/usr/bin/env bash
# This script can be used to run integration tests

# The following needs to be set up for the test to work:
#   - create a LorisTest DB from the default schema (SQL/0000-00-00-schema.sql)
#   - create a MySQL user SQLTestUser with password ??????

# set environment variable LORIS_DB_CONFIG which should be the path to test config.xml file
export LORIS_DB_CONFIG=/var/www/loris/test/config.xml

#start PHP's built in webserver
php -S localhost:8000 -t htdocs 2>1 > /dev/null &

# Start Selenium and redirect Selenium WebDriver
# output to /dev/null so that it doesn't flood the
# screen in the middle of our other tests
#java -jar /home/kmarasinska/Selenium_server/selenium-server-standalone-2.45.0.jar > /dev/null &

# Set config values in LorisTest DB
#mysql -D LorisTest -u SQLTestUser -pkarolina -e "UPDATE Config SET Value='http://localhost:8000' WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='url')"
mysql -D LorisTest -u SQLTestUser -pkarolina -e
"UPDATE Config
INNER JOIN ConfigSettings ON Config.`ConfigID` = ConfigSettings.ID
SET Config.Value='http://localhost:8000'
WHERE ConfigSettings.Name='url"


# set environment variable LORIS_DB_CONFIG to test config.xml file
#LORIS_DB_CONFIG=/var/www/loris/test/config.xml

# Run integration tests
vendor/bin/phpunit --configuration /var/www/loris/test/phpunit.xml ../modules/candidate_list/test