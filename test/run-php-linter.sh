#!/usr/bin/env bash
set -e

# Run PHP -l on everything to ensure there's no syntax
# errors.
for i in `ls php/libraries/*.class.inc modules/*/php/* modules/*/ajax/* htdocs/*.php htdocs/*/*.php`;
do
  php -l $i || exit $?;
done

# Run PHPCS on the entire libraries directory.
vendor/bin/phpcs --standard=docs/LorisCS.xml php/libraries php/exceptions php/installer
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php htdocs

# Run PHPCS on some scripts
vendor/bin/phpcs --standard=docs/LorisCS.xml tools/CouchDB_Import_MRI.php
vendor/bin/phpcs --standard=docs/LorisCS.xml tools/assign_missing_instruments.php
vendor/bin/phpcs --standard=docs/LorisCS.xml tools/data_dictionary_builder.php
vendor/bin/phpcs --standard=docs/LorisCS.xml tools/generic_includes.php

# Run PHPCS on specific modules
vendor/bin/phpcs --standard=docs/LorisCS.xml modules/imaging_uploader/php/NDB_Menu_Filter_imaging_uploader.class.inc
vendor/bin/phpcs --standard=docs/LorisCS.xml modules/imaging_uploader/php/File_Decompress.class.inc
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php modules/genomic_browser
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php modules/candidate_list
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php modules/conflict_resolver
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php modules/dashboard
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php modules/examiner
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php modules/training
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php modules/brainbrowser
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php modules/configuration
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php modules/acknowledgements
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php modules/data_release
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php modules/media
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php modules/candidate_parameters/ajax
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php modules/dicom_archive
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php modules/create_timepoint
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php modules/issue_tracker
