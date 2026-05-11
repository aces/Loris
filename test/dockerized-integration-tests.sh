#!/usr/bin/env bash
set -euo pipefail

if [ -v DEBUG ];
then
    CONTAINER=integration-tests-debug
else
    CONTAINER=integration-tests
fi

if [[ -z "${CI_NODE_TOTAL-}" || -z "${CI_NODE_INDEX-}" ]]; then
  FILTER=""
else
  SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
  classes=($(cd ${SCRIPTPATH} && ../vendor/bin/phpunit --list-tests  --testsuite LorisCoreIntegrationTests,LorisModuleIntegrationTests | awk -F'[: ]' '!seen[$5]++ && /^ \-/ { print "::"$5"$"}'))
  
  n=$((${#classes[@]} / CI_NODE_TOTAL + 1))
  slice=(${classes[@]:CI_NODE_INDEX * $n:$n})
  slicestr=$(IFS="|" ; echo "${slice[*]}")
  FILTER="--filter '/|${slicestr}|/'"
fi

# Core integration tests
docker compose run -T --rm ${CONTAINER} vendor/bin/phpunit --configuration test/phpunit.xml --testsuite LorisCoreIntegrationTests,LorisModuleIntegrationTests ${FILTER} $*
