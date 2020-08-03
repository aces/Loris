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
    'configuration_check.php'
    'config_to_db.php'
    'data_integrity_check.php'
    'delete_candidate.php'
    'delete_ignored_conflicts.php'
    'delete_timepoint.php'
    'detect_duplicated_commentids.php'
    'generic_includes.php'
    'importers/CandidateImporter.php'
    'importers/DataImporter.class.inc'
    'importers/InstrumentImporter.php'
    'importers/VisitImporter.php'
    'importers/openScienceDataImporter.php'
    'exporters/dataExtractor.php'
    'mri_violations_resolver.php'
    'populate_examiners_psc_rel.php'
    'raisinbread_refresh.php'
    'recreate_conflicts.php'
    'resetpassword.php'
    'setconfig.php'
    'single_use/Cleanup_multiple_firstVisits.php'
    'single_use/Convert_LorisMenuID_to_ModuleID.php'
    'generate_tables_sql.php'
    'lorisform_parser.php'
    'populate_visit_windows.php'
    'manage_modules.php'
    'DB_date_zeros_removal.php'
)

# And on all PHP files in this array
declare -a test_list=(
    'integrationtests/LorisIntegrationTest.class.inc'
    'integrationtests/LorisIntegrationTestWithCandidate.class.inc'
    'unittests/Database_Test.php'
)

vendor/bin/phpcs --standard=test/LorisCS.xml --extensions=php,inc \
    php/ \
    htdocs/ \
    modules/ \
    "test/integrationtests/" \
    "${tools_list[@]/#/tools/}" \
    || exit $?;

# Ensure strict typing is used in these files
declare -a strict_libraries=(
    'Database.class.inc'
    'OutputWrapper.class.inc'
)

vendor/bin/phpcs --standard=test/StrictTypesCS.xml --extensions=php,inc "${strict_libraries[@]/#/php/libraries/}" || exit $?;

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
