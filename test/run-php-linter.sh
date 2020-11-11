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
# test/
# tools/

# except:
ignored_files="
    tools/single_use/Cleanup_Consent_Data.php,\
    tools/single_use/Engine_Change_MyISAM_to_INNODB.php,\
    tools/single_use/normalize_mri_protocol_range_data.php,\
    tools/single_use/Update_scan_type_of_mri_violations_log_when_manual_caveat.php,\
    tools/single_use/instrument_double_escape_report.php,\
    tools/single_use/Normalize_protocol_split_rows.php,\
    tools/single_use/migrate_sql_to_json.php,\
    tools/single_use/data_dictionary_cleaner.php,\
    tools/single_use/Normalize_Consent_Data.php,\
    tools/single_use/remove_logged_passwords.php,\
    tools/deprecated/create_candidates.php,\
    tools/deprecated/excelDump.php,\
    tools/data_integrity/score_instrument.php,\
    tools/exporters/data_dictionary_builder.php,\
    tools/exporters/DB_dump_table_data.php,\
    tools/generate_tables_sql_and_testNames.php,\
    tools/fix_timepoint_date_problems.php,\
    tools/CouchDB_MRI_Importer.php,\
    tools/cleanup_mri_tables_for_19-0_release.php
"

vendor/bin/phpcs \
    --standard=test/LorisCS.xml \
    --extensions=php,inc \
    --ignore="$ignored_files" \
    php/ \
    htdocs/ \
    modules/ \
    test/ \
    tools/ \
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
