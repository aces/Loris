#!/usr/bin/env bash
set -euo pipefail
shopt -s globstar nullglob
GLOBIGNORE="vendor*:node_modules*:.git*"

declare -a excluded=(
    'test/dockerized-integration-tests.sh'
    'test/run-php-linter.sh'
    'test/unittests.sh'
    'test/run-shell-linter.sh'
    'test/dockerized-unit-tests.sh'
    'test/integration.sh'
    'test/run-js-linter.sh'
    'test/wait-for-services.sh'
    'tools/gen-version.sh'
    'tools/create-project.sh'
    'tools/deprecated/dump_all_tables_data_only.sh'
    'tools/package_files.sh'
)

#Build array of files
files=(**/*.{sh,ksh,bash})

#Delete array elements present in exclude
for exclude in "${excluded[@]}"; do
  files=( "${files[@]/${exclude}}" )
done

#Cleanup null array entries after delete
for i in "${!files[@]}"; do
  [[ -n "${files[$i]}" ]] || unset "files[$i]"
done

#Run shellcheck on files
shellcheck "${files[@]}"
