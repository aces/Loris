#!/usr/bin/env bash
set -euo pipefail
shopt -s globstar nullglob
GLOBIGNORE="vendor*:node_modules*"

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
    'tools/install.sh'
    'tools/create-project.sh'
    'tools/deprecated/dump_all_tables_data_only.sh'
    'tools/package_files.sh'
)

# Get all files ending with .sh that are not in the following folders:
#   - vendor
#   - node_modules
#   - tools/deprecated
#scripts=$(find . -not -path "./.git/*" -not -path "./node_modules/*" -not -path "./vendor/*" -not -path "./tools/deprecated/*" -name '*.sh')
#scripts=$(find . -not -path "./.git/*" -not -path "./node_modules/*" -not -path "./vendor/*" -not -path "./tools/deprecated/*" -name '*.sh')

scripts=()
while IFS= read -d $'\0' -r file ; do
    scripts=("${scripts[@]}" "$file")
done < <(find . -not -path "./.git/*" -not -path "./node_modules/*" -not -path "./vendor/*" -not -path "./tools/deprecated/*" -name '*.sh' -print0)

echo "${scripts[@]}"
shellcheck "${scripts[@]}"
