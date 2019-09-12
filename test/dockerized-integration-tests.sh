#!/bin/bash
set -e

if [ "$DEBUG" == "true" ]
then
    CONTAINER=integration-tests-debug
else
    CONTAINER=integration-tests
fi

export MOZ_HEADLESS=1

docker-compose run -T --rm ${CONTAINER} vendor/bin/phpunit --configuration test/phpunit.xml --testsuite LorisCoreIntegrationTests $*
docker-compose run -T --rm ${CONTAINER} vendor/bin/phpunit --configuration test/phpunit.xml --testsuite LorisModuleIntegrationTests $*
