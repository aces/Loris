#!/usr/bin/env bash
set -euo pipefail

if [ -v DEBUG ];
then
    CONTAINER=unit-tests-debug
else
    CONTAINER=unit-tests
fi
docker-compose up --build db

