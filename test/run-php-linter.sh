#!/usr/bin/env bash
set -euo pipefail

# Run PHP -l on everything to ensure there's no syntax
# errors.
find docs modules htdocs php src -name '*.class.inc' -print0 -o -name '*.php' -print0 |xargs -0 -n1 php -l >/dev/null  

# Run PHPCS on all .php and .inc files in folders:
# php/
# htdocs/
# modules/
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php,inc --colors php/ htdocs/ modules/ || exit $?;

# Run PHPCS on some scripts  -- fixing the files format later
# vendor/bin/phpcs --standard=docs/LorisCS.xml tools/CouchDB_Confirm_Integrity.php

vendor/bin/phpmd php/libraries text docs/LorisPHPMD.xml || exit $?;
