#!/bin/bash
set -e

if [ "$DEBUG" == "true" ]
then
    CONTAINER=integration-tests-debug
else
    CONTAINER=integration-tests
fi

docker-compose run -T --rm integration-tests vendor/bin/phpunit --configuration test/phpunit.xml  $*
