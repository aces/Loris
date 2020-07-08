#!/usr/bin/env bash
# This script can be used to run PHP unittests
# To run:
#   - to run all unit tests, run script with no arguments:
#       example: bash unittests.sh
#   - to run a specific unittest specify the test name and the path to test script
#       example: bash unittests.sh 'NDB_BVL_FeedbackTest' ./unittests/NDB_BVL_FeedbackTest.php

# Test database and test config.xml have to be created before running tests. This is a one time setup.
#   1 - create a LorisTest DB from the default schema (SQL/0000-00-00-*.sql)
#   2 - create a MySQL user SQLTestUser with password TestPassword & specify the password in the mysql commands (with option -p) below
#   3 - Create a config.xml file in test/ folder.
#       Changes to make in this config.xml file:
#       *  Database connection credentials: specify credentials to LorisTest DB which you create in step 1
#       *  Set sandbox mode to 1: <sandbox>1</sandbox>

set -euo pipefail

# set environment variable LORIS_DB_CONFIG to test config.xml file
host="127.0.0.1"
database="LorisTest"
username="SQLTestUser"
password="TestPassword"
sed -i \
    -e "s/%HOSTNAME%/$host/g" \
    -e "s/%USERNAME%/$username/g" \
    -e "s/%PASSWORD%/$password/g" \
    -e "s/%DATABASE%/$database/g" \
    config.xml
export LORIS_DB_CONFIG=$(pwd)/config.xml

if [ $# -eq 2 ]; then
  # Run specific unit test by specifying test name and file path
  echo Running Unit test: $1 in file $2;
  ../vendor/bin/phpunit --configuration phpunit.xml $1 $2
elif [ $# -eq 1 ]; then
  # Run specific unit test by specifying only the test name
  echo Running Unit test: $1;
  ../vendor/bin/phpunit --configuration phpunit.xml   $1 ./unittests/$1.php
else
 # Run all unittest
../vendor/bin/phpunit --debug --configuration phpunit.xml --testsuite 'LorisUnitTests'
fi
