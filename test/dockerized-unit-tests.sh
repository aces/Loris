#!/usr/bin/env bash
set -euo pipefail

if [ "$DEBUG" == "true" ]
then
    CONTAINER=unit-tests-debug
else
    CONTAINER=unit-tests
fi

docker-compose run -T --rm ${CONTAINER} vendor/bin/phpunit --configuration test/phpunit.xml --testsuite LorisUnitTests $*
