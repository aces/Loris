#!/usr/bin/env bash

# Wrapper script which waits until MySQL and Selenium are up and serving requests.

set -euo pipefail

cmd="$@"

echo "Waiting for mysqld..."
while ! mysqladmin ping -h db -u SQLTestUser --password="TestPassword" --silent ; do
  sleep 1
done

check_selenium() {
    local url=$1
    until $(curl --output /dev/null --silent --head --fail "$url"); do
        printf 'Waiting for Selenium server on %s...\n' "$url"
        sleep 5
    done
    printf 'Selenium server is up and running on %s!\n' "$url"
}

# Check on localhost

# Check on Docker internal network (service name)

# Check on localhost
check_selenium http://localhost:4444/wd/hub &

# Check on Docker internal network (service name)
check_selenium http://selenium:4444/wd/hub &

# Check on 127.0.0.1
check_selenium http://127.0.0.1:4444/wd/hub &


# Check on 127.0.0.1

# Wait for any check to complete
wait

exec $cmd
