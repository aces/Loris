#!/usr/bin/env bash
set -euo pipefail

# Run PHP -l on everything to ensure there's no syntax
# errors.
find docs modules htdocs php src -name '*.class.inc' -print0 -o -name '*.php' -print0 |xargs -0 -n1 php -l >/dev/null  

# Run PHPCS on all .php and .inc files in folders: 
#  php/, htdocs/, modules/
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php,inc --colors php/ htdocs/ modules/ --ignore=htdocs/api/*|| exit $?;

# Run PHPCS on src/ directory using a different ruleset conforming to PSR2.
vendor/bin/phpcs --standard=docs/SrcCS.xml --extensions=php/php src/ || exit $?;

vendor/bin/phpmd php/libraries text docs/LorisPHPMD.xml || exit $?;
