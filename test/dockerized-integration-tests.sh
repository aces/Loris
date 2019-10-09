#!/usr/bin/env bash
set -euo pipefail

if [ "$DEBUG" == "true" ]
then
    CONTAINER=integration-tests-debug
else
    CONTAINER=integration-tests
fi

docker-compose run -T --rm ${CONTAINER} vendor/bin/phpunit --configuration test/phpunit.xml --testsuite LorisCoreIntegrationTests $*
docker-compose run -T --rm ${CONTAINER} vendor/bin/phpunit --configuration test/phpunit.xml --testsuite LorisModuleIntegrationTests $*
