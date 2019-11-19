#!/usr/bin/env bash
# Creates the VERSION file in the LORIS root folder.
set -euo pipefail

# The name of the version file
VERSION='VERSION'

if [ -d '.git/' ] && [ -n $(command -v git) ]; then
    git describe --tags --always > $VERSION
else
    echo 'Unknown' > $VERSION
fi
