#!/usr/bin/env bash
set -euo pipefail

# Run PHP -l on everything to ensure there's no syntax
# errors.
find docs modules htdocs php src tools \
    -name '*.class.inc' \
    -print0 -o -name '*.php' -print0 \
    |xargs -0 -n1 php -l \
    >/dev/null  

# Run PHPCS on all .php and .inc files in folders:
# php/
# htdocs/
# modules/

# Also run PHPCS on all tools/ scripts in this array
declare -a tools_list=(
    'assign_missing_instruments.php'
    'delete_candidate.php'
    'delete_ignored_conflicts.php'
    'detect_duplicated_commentids.php'
    'generic_includes.php'
    'populate_examiners_psc_rel.php'
    'raisinbread_refresh.php'
    'resetpassword.php'
    'setconfig.php'
    'single_use/Cleanup_multiple_firstVisits.php'
)
# And on all PHP files in this array
declare -a test_list=(
    'integrationtests/LorisIntegrationTest.class.inc'
    'integrationtests/LorisIntegrationTestWithCandidate.class.inc'
)

vendor/bin/phpcs --standard=test/LorisCS.xml --extensions=php,inc \
    php/ \
    htdocs/ \
    modules/ \
    "${tools_list[@]/#/tools/}" \
    "${test_list[@]/#/test/}" \
    || exit $?;

# Run PHPCS on src/ directory using a different ruleset conforming to PSR2.
vendor/bin/phpcs --standard=test/SrcCS.xml --extensions=php/php src/ || exit $?;

vendor/bin/phpmd php/,modules/,src/ text 'test/LorisPHPMD.xml' || exit $?;

# Run PHPStan on php/ and modules/
vendor/bin/phpstan analyse \
    --level max \
    -c ./test/phpstan-loris.neon \
    --error-format table \
    php/ \
    modules/ \
    || exit $?
