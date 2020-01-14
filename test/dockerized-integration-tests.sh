#!/usr/bin/env bash
set -euo pipefail

if [ -v DEBUG ];
then
    CONTAINER=integration-tests-debug
else
    CONTAINER=integration-tests
fi

# Core integration tests
docker-compose run -T -e HEADLESS=true --rm ${CONTAINER} vendor/bin/phpunit --configuration test/phpunit.xml
