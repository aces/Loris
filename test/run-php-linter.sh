#!/usr/bin/env bash
set -e

# Run PHP -l on everything to ensure there's no syntax
# errors.
for i in `ls php/libraries/*.class.inc modules/*/php/* modules/*/ajax/* htdocs/*.php htdocs/*/*.php`;
do
  php -l $i >/dev/null || exit $?;
done

# Run PHPCS on all .php and .inc files in folders: 
#  php/, htdocs/, modules/
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php,inc php/ htdocs/ modules/ --ignore=htdocs/api/*|| exit $?;

vendor/bin/phpmd php/libraries text docs/LorisPHPMD.xml || exit $?;
