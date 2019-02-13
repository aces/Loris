#!/usr/bin/env bash
set -e

# Run PHP -l on everything to ensure there's no syntax
# errors.
for i in `ls php/libraries/*.class.inc modules/*/php/* modules/*/ajax/* htdocs/*.php htdocs/*/*.php`;
do
  php -l $i >/dev/null || exit $?;
done

# Run PHPCS on the entire libraries directory.
vendor/bin/phpcs --standard=docs/LorisCS.xml php/libraries php/exceptions php/installer || exit $?;
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php htdocs || exit $?;

# Run PHPCS on some scripts  -- fixing the files format later
# vendor/bin/phpcs --standard=docs/LorisCS.xml tools/CouchDB_Confirm_Integrity.php

# Run PHPCS on all modules
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php modules/ || exit $?;

# Run PHPCS on src/ directory using a different ruleset
# FIXME Currently the files in the src/ directory do not meet the standards of
# PSR2. Until they are cleaned up we cannot include this test in our static
# analysis without breaking Travis. This is not a priority issue but at some
# point the issues should be remedied and the following line uncommented.
#vendor/bin/phpcs --standard=docs/SrcCS.xml --extensions=php/php,inc/php src/ || exit $?;

vendor/bin/phpmd php/libraries text docs/LorisPHPMD.xml || exit $?;
