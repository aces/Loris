#!/bin/bash
set -e

if [ "$DEBUG" == "true" ]
then
    CONTAINER=unit-tests-debug
else
    CONTAINER=unit-tests
fi

docker-compose run -T --rm ${CONTAINER} vendor/bin/phpunit --configuration test/phpunit.xml --testsuite LorisUnitTests $*
