#!/usr/bin/env bash
set -euo pipefail
shopt -s globstar nullglob
GLOBIGNORE="vendor*:node_modules*"

shellcheck **/*.{sh,ksh,bash}
