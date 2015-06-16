#!/usr/bin/env bash
# This script can be used to run PHP unittests

# set environment variable LORIS_DB_CONFIG to test config.xml file
export LORIS_DB_CONFIG=/var/www/loris/test/config.xml

# run unit tests
vendor/bin/phpunit --configuration test/phpunit.xml test/unittests
