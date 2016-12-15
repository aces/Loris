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
vendor/bin/phpcs --standard=docs/LorisCS.xml tools/CouchDB_Confirm_Integrity.php
vendor/bin/phpcs --standard=docs/LorisCS.xml tools/CouchDB_Import_Demographics.php
vendor/bin/phpcs --standard=docs/LorisCS.xml tools/CouchDB_Import_Instruments.php
vendor/bin/phpcs --standard=docs/LorisCS.xml tools/CouchDB_Import_MRI.php
vendor/bin/phpcs --standard=docs/LorisCS.xml tools/CouchDB_Import_RadiologicalReview.php
vendor/bin/phpcs --standard=docs/LorisCS.xml tools/CouchDB_MRI_Importer.php
vendor/bin/phpcs --standard=docs/LorisCS.xml tools/assign_missing_instruments.php
vendor/bin/phpcs --standard=docs/LorisCS.xml tools/data_dictionary_builder.php
vendor/bin/phpcs --standard=docs/LorisCS.xml tools/delete_candidate.php
vendor/bin/phpcs --standard=docs/LorisCS.xml tools/delete_ignored_conflicts.php
vendor/bin/phpcs --standard=docs/LorisCS.xml tools/detect_conflicts.php
vendor/bin/phpcs --standard=docs/LorisCS.xml tools/detect_duplicated_commentids.php
vendor/bin/phpcs --standard=docs/LorisCS.xml tools/excelDump.php
vendor/bin/phpcs --standard=docs/LorisCS.xml tools/fix_timepoint_date_problems.php
vendor/bin/phpcs --standard=docs/LorisCS.xml tools/generate_project_statistics_csv.php
vendor/bin/phpcs --standard=docs/LorisCS.xml tools/generate_tables_sql.php
vendor/bin/phpcs --standard=docs/LorisCS.xml tools/generate_tables_sql_and_testNames.php 
vendor/bin/phpcs --standard=docs/LorisCS.xml tools/generic_includes.php 
vendor/bin/phpcs --standard=docs/LorisCS.xml tools/lorisform_parser.php 
vendor/bin/phpcs --standard=docs/LorisCS.xml tools/mri_violations_resolver.php 
vendor/bin/phpcs --standard=docs/LorisCS.xml tools/populate_visit_windows.php 
vendor/bin/phpcs --standard=docs/LorisCS.xml tools/populateage.php 
vendor/bin/phpcs --standard=docs/LorisCS.xml tools/recreate_conflicts.php
vendor/bin/phpcs --standard=docs/LorisCS.xml tools/score_instrument.php

# Run PHPCS on specific modules
vendor/bin/phpcs --standard=docs/LorisCS.xml modules/imaging_uploader/php/NDB_Menu_Filter_imaging_uploader.class.inc
vendor/bin/phpcs --standard=docs/LorisCS.xml modules/imaging_uploader/php/File_Decompress.class.inc
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php acknowledgements
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php brainbrowser 
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php bvl_feedback
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php candidate_list
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php candidate_parameters
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php configuration
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php conflict_resolver
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php create_timepoint
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php dashboard
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php data_integrity_flag
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php data_release
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php data_team_helper
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php datadict 
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php dataquery
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php dicom_archive
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php document_repository
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php examiner
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php final_radiological_review
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php genomic_browser
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php help_editor 
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php imaging_browser
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php imaging_uploader
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php instrument_builder
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php instrument_list 
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php instrument_manager
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php issue_tracker
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php media 
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php mri_violations
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php new_profile 
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php next_stage
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php reliability
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php server_processes_manager
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php statistics
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php survey_accounts
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php timepoint_flag
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php timepoint_list
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php training 
vendor/bin/phpcs --standard=docs/LorisCS.xml --extensions=php/php,inc/php user_accounts
