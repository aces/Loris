#!/usr/bin/env bash
set -euo pipefail
shopt -s globstar nullglob
GLOBIGNORE="vendor*:node_modules*"

declare -a script_list=(
    'tools/install.sh'
)

shellcheck "${script_list[@]/}" || exit $?;
