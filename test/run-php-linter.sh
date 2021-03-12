#!/usr/bin/env bash
set -euo pipefail

has_param() {
    local param="$1"
    shift
    for arg; do
        if [[ $arg == "$param" ]]; then
            return 0
        fi
    done
    return 1
}

join_by() {
    local d=$1; shift;
    local f=$1; shift;
    printf %s "$f" "${@/#/$d}";
}

fix=false
if has_param '-f' "$@"; then
    echo "Fix mode set to true"
    fix=true
fi

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
declare -a ignored_files=(
    tools/single_use/Cleanup_Consent_Data.php
    tools/single_use/Engine_Change_MyISAM_to_INNODB.php
    tools/single_use/normalize_mri_protocol_range_data.php
    tools/single_use/Update_scan_type_of_mri_violations_log_when_manual_caveat.php
    tools/single_use/instrument_double_escape_report.php
    tools/single_use/cleanup_mri_tables_for_19-0_release.php
    tools/single_use/Normalize_protocol_split_rows.php
    tools/single_use/migrate_sql_to_json.php
    tools/single_use/data_dictionary_cleaner.php
    tools/single_use/Normalize_Consent_Data.php
    tools/single_use/remove_logged_passwords.php
    tools/deprecated/create_candidates.php
    tools/deprecated/excelDump.php
)

declare -a params=(
    --standard=test/LorisCS.xml
    --extensions=php,inc
    --ignore=$(join_by ',' "${ignored_files[@]}")
    php/
    htdocs/
    modules/
    test/
    tools/
)

if [ "$fix" = true ] ; then
    vendor/bin/phpcbf $(join_by ' ' "${params[@]}") || exit $?;
else
    vendor/bin/phpcs $(join_by ' ' "${params[@]}") || exit $?;
fi

# Ensure strict typing is used in these files
declare -a strict_libraries=(
    'Database.class.inc'
    'OutputWrapper.class.inc'
)

declare -a params=(
    '--standard=test/StrictTypesCS.xml'
    '--extensions=php,inc'
    "${strict_libraries[@]/#/php/libraries/}"
)

if [ "$fix" = true ] ; then
    vendor/bin/phpcbf $(join_by ' ' "${params[@]}") || exit $?;
else
    vendor/bin/phpcs $(join_by ' ' "${params[@]}") || exit $?;
fi

# Run PHPCS on src/ directory using a different ruleset conforming to PSR2.

declare -a params=(
    '--standard=test/SrcCS.xml'
    '--extensions=php/php'
    'src/'
)

if [ "$fix" = true ] ; then
    vendor/bin/phpcbf $(join_by ' ' "${params[@]}") || exit $?;
else
    vendor/bin/phpcs $(join_by ' ' "${params[@]}") || exit $?;
fi

# Run PHPStan on php/ and modules/
vendor/bin/phpstan analyse \
    --level max \
    -c ./test/phpstan-loris.neon \
    --error-format table \
    php/ \
    modules/ \
    || exit $?
