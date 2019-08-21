#!/usr/bin/env bash

# Wrapper script which waits until MySQL and Selenium are up and serving requests.

set -euo pipefail

cmd="$@"

echo "Waiting for mysqld..."
while ! mysqladmin ping -h db -u SQLTestUser --password="TestPassword" --silent ; do
  sleep 1
done

if [ "$SELENIUM_REQUIRED" = true ]  ; then
  echo "Waiting for Selenium..."
  until $(curl --output /dev/null --silent --head --fail http://selenium:4444/wd/hub); do
    sleep 1
  done
  echo "Selenium is alive"
fi

exec $cmd
