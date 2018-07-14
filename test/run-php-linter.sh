#!/usr/bin/env bash
set -e

# Run PHP -l on everything to ensure there's no syntax
# errors.
for i in `ls php/libraries/*.class.inc modules/*/php/* modules/*/ajax/* htdocs/*.php htdocs/*/*.php src/Data/*.php src/Data/Filters/* src/Data/Provisioners/* src/Http/*.php src/Middleware/*.php src/Router/*.php`;
do
  php -l $i || exit $?;
done

# Run PHPCS on the entire libraries directory.
vendor/bin/phpcs --standard=docs/LorisCS.xml php/libraries php/exceptions php/installer src || exit $?;
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php htdocs || exit $?;

# Run PHPCS on some scripts  -- fixing the files format later
# vendor/bin/phpcs --standard=docs/LorisCS.xml tools/CouchDB_Confirm_Integrity.php

# Run PHPCS on all modules
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php modules/ || exit $?;

vendor/bin/phpmd php/libraries text docs/LorisPHPMD.xml || exit $?;
