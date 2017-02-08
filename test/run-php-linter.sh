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

# Run PHPCS on some scripts  -- fixing the files format later
# vendor/bin/phpcs --standard=docs/LorisCS.xml tools/CouchDB_Confirm_Integrity.php

# Run PHPCS on specific modules
# vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php modules/
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php modules/acknowledgements
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php modules/brainbrowser 
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php modules/bvl_feedback
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php modules/candidate_list
# vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php modules/candidate_parameters
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php modules/configuration
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php modules/conflict_resolver
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php modules/create_timepoint
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php modules/dashboard
# vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php modules/data_integrity_flag
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php modules/data_release
# vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php modules/data_team_helper
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php modules/datadict 
# vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php modules/dataquery
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php modules/dicom_archive
# vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php modules/document_repository
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php modules/examiner
# vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php modules/final_radiological_review
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php modules/genomic_browser
# vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php modules/help_editor 
# vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php modules/imaging_browser
# vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php modules/imaging_uploader
# vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php modules/instrument_builder
# vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php modules/instrument_list 
# vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php modules/instrument_manager
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php modules/issue_tracker
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php modules/media 
# vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php modules/mri_violations
# vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php modules/new_profile 
# vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php modules/next_stage
# vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php modules/reliability
# vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php modules/server_processes_manager
# vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php modules/statistics
# vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php modules/survey_accounts
# vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php modules/timepoint_flag
# vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php modules/timepoint_list
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php modules/training 
# vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php modules/user_accounts
