#!/usr/bin/env bash
# Creates a stub LORIS project directory at the location passed as the first argument
set -euo pipefail

for d in data libraries instruments templates tables_sql modules; do
    mkdir -p "${1}/${d}"
done

