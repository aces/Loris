#!/usr/bin/env bash
set -euo pipefail

# Run PHP -l on everything to ensure there's no syntax
# errors.
find docs modules htdocs php src -name '*.class.inc' -print0 -o -name '*.php' -print0 |xargs -0 -n1 php -l >/dev/null 

# Run PHPCS on the entire libraries directory.
vendor/bin/phpcs --standard=docs/LorisCS.xml php/libraries php/exceptions php/installer || exit $?;
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php htdocs || exit $?;

# Run PHPCS on some scripts  -- fixing the files format later
# vendor/bin/phpcs --standard=docs/LorisCS.xml tools/CouchDB_Confirm_Integrity.php

# Run PHPCS on all modules
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php modules/ || exit $?;

# Run PHPCS on src/ directory using a different ruleset conforming to PSR2.
vendor/bin/phpcs --standard=docs/SrcCS.xml --extensions=php/php src/ || exit $?;

vendor/bin/phpmd php/libraries text docs/LorisPHPMD.xml || exit $?;
