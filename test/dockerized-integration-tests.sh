#!/bin/bash
set -e

if [ "$DEBUG" == "true" ]
then
    CONTAINER=integration-tests-debug
else
    CONTAINER=integration-tests
fi
docker-compose run -T --rm ${CONTAINER} npm run lint:php && npm run lint:javascript && vendor/bin/phpunit --configuration test/phpunit.xml  $*
docker-compose run -T --rm ${CONTAINER} vendor/bin/phpunit --configuration test/phpunit.xml --testsuite LorisModuleIntegrationTests $*
