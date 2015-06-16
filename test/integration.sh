#!/usr/bin/env bash
# This script can be used to run integration tests

# set environment variable LORIS_DB_CONFIG to test config.xml file
LORIS_DB_CONFIG=/var/www/loris/test/config.xml

php -S localhost:8000 -t htdocs 2>1 > /dev/null &

# Start Selenium and redirect Selenium WebDriver
# output to /dev/null so that it doesn't flood the
# screen in the middle of our other tests
#java -jar /home/kmarasinska/Selenium_server/selenium-server-standalone-2.45.0.jar > /dev/null &

mysql -D LorisTest -u SQLTestUser -pkarolina -e "UPDATE Config SET Value='http://localhost:8000' WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='url')"


# set environment variable LORIS_DB_CONFIG to test config.xml file
LORIS_DB_CONFIG=/var/www/loris/test/config.xml

# Run integration tests
vendor/bin/phpunit --configuration /var/www/loris/test/phpunit.xml modules/candidate_list/test