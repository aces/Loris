.PHONY: clean dev all check checkstatic unittests jslatest testdata locales

all: node_modules locales VERSION vendor
	npm run build

%.mo: %.po
	msgfmt -o $@ $<

# If anything changes, re-generate the VERSION file
VERSION: .
	tools/gen-version.sh

vendor/bin/phan: composer.lock
	composer install

vendor/bin/phpunit: composer.lock
	composer install

vendor: composer.lock
	composer install --no-dev

node_modules: package-lock.json
	npm ci

dev: node_modules locales vendor/bin/phan VERSION vendor
	npm run compile

jslatest: clean
	rm -rf package-lock.json
	rm -rf modules/electrophysiology_browser/jsx/react-series-data-viewer/package-lock.json
	npm install
	npm run compile

clean:
	rm -f smarty/templates_c/*
	rm -f VERSION
	rm -rf vendor
	rm -rf node_modules
	rm -rf modules/electrophysiology_browser/jsx/react-series-data-viewer/node_modules
	rm -f modules/*/locale/*/LC_MESSAGES/*.mo

# Perform static analysis checks
checkstatic: vendor/bin/phan dev
	npm run lint:php
	vendor/bin/phan
	npm run lint:js

# The 'alex' tool scans documentation for condescending language.
# Arguments:
#     --quiet Shows only warnings and errors
#     --why   Explains why something is problematic
#     --diff  On Travis, only scans files changed
make checklanguage:
	npx alex --quiet --why --diff

unittests: vendor/bin/phpunit
	vendor/bin/phpunit --configuration test/phpunit.xml

# Perform all tests that don't require an install.
check: checkstatic unittests

testdata:
	php tools/raisinbread_refresh.php

locales: 
	msgfmt -o locale/en/LC_MESSAGES/loris.mo locale/en/LC_MESSAGES/loris.po
	npx i18next-conv -l en -s locale/en/LC_MESSAGES/loris.po -t locale/en/LC_MESSAGES/loris.json --compatibilityJSON v4
	msgfmt -o locale/fr/LC_MESSAGES/loris.mo locale/fr/LC_MESSAGES/loris.po
	npx i18next-conv -l fr -s locale/fr/LC_MESSAGES/loris.po -t locale/fr/LC_MESSAGES/loris.json --compatibilityJSON v4
	msgfmt -o locale/ja/LC_MESSAGES/loris.mo locale/ja/LC_MESSAGES/loris.po
	npx i18next-conv -l ja -s locale/ja/LC_MESSAGES/loris.po -t locale/ja/LC_MESSAGES/loris.json --compatibilityJSON v4
	msgfmt -o locale/hi/LC_MESSAGES/loris.mo locale/hi/LC_MESSAGES/loris.po
	npx i18next-conv -l hi -s locale/hi/LC_MESSAGES/loris.po -t locale/hi/LC_MESSAGES/loris.json --compatibilityJSON v4
	msgfmt -o locale/es/LC_MESSAGES/loris.mo locale/es/LC_MESSAGES/loris.po
	npx i18next-conv -l es -s locale/es/LC_MESSAGES/loris.po -t locale/es/LC_MESSAGES/loris.json --compatibilityJSON v4
	msgfmt -o modules/new_profile/locale/ja/LC_MESSAGES/new_profile.mo modules/new_profile/locale/ja/LC_MESSAGES/new_profile.po
	msgfmt -o modules/new_profile/locale/fr/LC_MESSAGES/new_profile.mo modules/new_profile/locale/fr/LC_MESSAGES/new_profile.po
	npx i18next-conv -l ja -s modules/new_profile/locale/ja/LC_MESSAGES/new_profile.po -t modules/new_profile/locale/ja/LC_MESSAGES/new_profile.json
	npx i18next-conv -l fr -s modules/new_profile/locale/fr/LC_MESSAGES/new_profile.po -t modules/new_profile/locale/fr/LC_MESSAGES/new_profile.json
	msgfmt -o modules/new_profile/locale/hi/LC_MESSAGES/new_profile.mo modules/new_profile/locale/hi/LC_MESSAGES/new_profile.po
	npx i18next-conv -l hi -s modules/new_profile/locale/hi/LC_MESSAGES/new_profile.po -t modules/new_profile/locale/hi/LC_MESSAGES/new_profile.json
	msgfmt -o modules/new_profile/locale/es/LC_MESSAGES/new_profile.mo modules/new_profile/locale/es/LC_MESSAGES/new_profile.po
	npx i18next-conv -l es -s modules/new_profile/locale/es/LC_MESSAGES/new_profile.po -t modules/new_profile/locale/es/LC_MESSAGES/new_profile.json --compatibilityJSON v4
	msgfmt -o modules/new_profile/locale/hi/LC_MESSAGES/new_profile.mo modules/new_profile/locale/hi/LC_MESSAGES/new_profile.po
	msgfmt -o modules/acknowledgements/locale/ja/LC_MESSAGES/acknowledgements.mo modules/acknowledgements/locale/ja/LC_MESSAGES/acknowledgements.po
	msgfmt -o modules/api_docs/locale/ja/LC_MESSAGES/api_docs.mo modules/api_docs/locale/ja/LC_MESSAGES/api_docs.po
	msgfmt -o modules/battery_manager/locale/ja/LC_MESSAGES/battery_manager.mo modules/battery_manager/locale/ja/LC_MESSAGES/battery_manager.po
	msgfmt -o modules/behavioural_qc/locale/ja/LC_MESSAGES/behavioural_qc.mo modules/behavioural_qc/locale/ja/LC_MESSAGES/behavioural_qc.po
	msgfmt -o modules/behavioural_qc/locale/hi/LC_MESSAGES/behavioural_qc.mo modules/behavioural_qc/locale/hi/LC_MESSAGES/behavioural_qc.po
	npx i18next-conv -l hi -s modules/behavioural_qc/locale/hi/LC_MESSAGES/behavioural_qc.po -t modules/behavioural_qc/locale/hi/LC_MESSAGES/behavioural_qc.json
	npx i18next-conv -l ja -s modules/behavioural_qc/locale/ja/LC_MESSAGES/behavioural_qc.po -t modules/behavioural_qc/locale/ja/LC_MESSAGES/behavioural_qc.json
	msgfmt -o modules/brainbrowser/locale/ja/LC_MESSAGES/brainbrowser.mo modules/brainbrowser/locale/ja/LC_MESSAGES/brainbrowser.po
	msgfmt -o modules/bvl_feedback/locale/ja/LC_MESSAGES/bvl_feedback.mo modules/bvl_feedback/locale/ja/LC_MESSAGES/bvl_feedback.po
	msgfmt -o modules/candidate_list/locale/fr/LC_MESSAGES/candidate_list.mo modules/candidate_list/locale/fr/LC_MESSAGES/candidate_list.po
	msgfmt -o modules/candidate_list/locale/ja/LC_MESSAGES/candidate_list.mo modules/candidate_list/locale/ja/LC_MESSAGES/candidate_list.po
	npx i18next-conv -l fr -s modules/candidate_list/locale/fr/LC_MESSAGES/candidate_list.po -t modules/candidate_list/locale/fr/LC_MESSAGES/candidate_list.json
	npx i18next-conv -l ja -s modules/candidate_list/locale/ja/LC_MESSAGES/candidate_list.po -t modules/candidate_list/locale/ja/LC_MESSAGES/candidate_list.json
	msgfmt -o modules/candidate_list/locale/hi/LC_MESSAGES/candidate_list.mo modules/candidate_list/locale/hi/LC_MESSAGES/candidate_list.po
	npx i18next-conv -l hi -s modules/candidate_list/locale/hi/LC_MESSAGES/candidate_list.po -t modules/candidate_list/locale/hi/LC_MESSAGES/candidate_list.json
	msgfmt -o modules/candidate_parameters/locale/ja/LC_MESSAGES/candidate_parameters.mo modules/candidate_parameters/locale/ja/LC_MESSAGES/candidate_parameters.po
	npx i18next-conv -l ja -s modules/candidate_parameters/locale/ja/LC_MESSAGES/candidate_parameters.po -t modules/candidate_parameters/locale/ja/LC_MESSAGES/candidate_parameters.json
	msgfmt -o modules/candidate_profile/locale/ja/LC_MESSAGES/candidate_profile.mo modules/candidate_profile/locale/ja/LC_MESSAGES/candidate_profile.po
	msgfmt -o modules/candidate_profile/locale/fr/LC_MESSAGES/candidate_profile.mo modules/candidate_profile/locale/fr/LC_MESSAGES/candidate_profile.po
	msgfmt -o modules/configuration/locale/ja/LC_MESSAGES/configuration.mo modules/configuration/locale/ja/LC_MESSAGES/configuration.po
	msgfmt -o modules/configuration/locale/ja/LC_MESSAGES/configuration.mo modules/configuration/locale/ja/LC_MESSAGES/configuration.po
	msgfmt -o modules/conflict_resolver/locale/ja/LC_MESSAGES/conflict_resolver.mo modules/conflict_resolver/locale/ja/LC_MESSAGES/conflict_resolver.po
	msgfmt -o modules/conflict_resolver/locale/hi/LC_MESSAGES/conflict_resolver.mo modules/conflict_resolver/locale/hi/LC_MESSAGES/conflict_resolver.po
	npx i18next-conv -l hi -s modules/conflict_resolver/locale/hi/LC_MESSAGES/conflict_resolver.po -t modules/conflict_resolver/locale/hi/LC_MESSAGES/conflict_resolver.json
	npx i18next-conv -l ja -s modules/conflict_resolver/locale/ja/LC_MESSAGES/conflict_resolver.po -t modules/conflict_resolver/locale/ja/LC_MESSAGES/conflict_resolver.json
	msgfmt -o modules/create_timepoint/locale/ja/LC_MESSAGES/create_timepoint.mo modules/create_timepoint/locale/ja/LC_MESSAGES/create_timepoint.po
	npx i18next-conv -l ja -s modules/create_timepoint/locale/ja/LC_MESSAGES/create_timepoint.po -t modules/create_timepoint/locale/ja/LC_MESSAGES/create_timepoint.json
	msgfmt -o modules/create_timepoint/locale/es/LC_MESSAGES/create_timepoint.mo modules/create_timepoint/locale/es/LC_MESSAGES/create_timepoint.po
	npx i18next-conv -l es -s modules/create_timepoint/locale/es/LC_MESSAGES/create_timepoint.po -t modules/create_timepoint/locale/es/LC_MESSAGES/create_timepoint.json
	msgfmt -o modules/dashboard/locale/ja/LC_MESSAGES/dashboard.mo modules/dashboard/locale/ja/LC_MESSAGES/dashboard.po
	msgfmt -o modules/datadict/locale/ja/LC_MESSAGES/datadict.mo modules/datadict/locale/ja/LC_MESSAGES/datadict.po
	msgfmt -o modules/datadict/locale/hi/LC_MESSAGES/datadict.mo modules/datadict/locale/hi/LC_MESSAGES/datadict.po
	npx i18next-conv -l hi -s modules/datadict/locale/hi/LC_MESSAGES/datadict.po -t modules/datadict/locale/hi/LC_MESSAGES/datadict.json
	npx i18next-conv -l ja -s modules/datadict/locale/ja/LC_MESSAGES/datadict.po -t modules/datadict/locale/ja/LC_MESSAGES/datadict.json
	msgfmt -o modules/dataquery/locale/ja/LC_MESSAGES/dataquery.mo modules/dataquery/locale/ja/LC_MESSAGES/dataquery.po
	msgfmt -o modules/data_release/locale/ja/LC_MESSAGES/data_release.mo modules/data_release/locale/ja/LC_MESSAGES/data_release.po
	npx i18next-conv -l ja -s modules/data_release/locale/ja/LC_MESSAGES/data_release.po -t modules/data_release/locale/ja/LC_MESSAGES/data_release.json
	msgfmt -o modules/data_release/locale/hi/LC_MESSAGES/data_release.mo modules/data_release/locale/hi/LC_MESSAGES/data_release.po
	npx i18next-conv -l hi -s modules/data_release/locale/hi/LC_MESSAGES/data_release.po -t modules/data_release/locale/hi/LC_MESSAGES/data_release.json
	msgfmt -o modules/dicom_archive/locale/ja/LC_MESSAGES/dicom_archive.mo modules/dicom_archive/locale/ja/LC_MESSAGES/dicom_archive.po
	msgfmt -o modules/dicom_archive/locale/hi/LC_MESSAGES/dicom_archive.mo modules/dicom_archive/locale/hi/LC_MESSAGES/dicom_archive.po
	npx i18next-conv -l hi -s modules/dicom_archive/locale/hi/LC_MESSAGES/dicom_archive.po -t modules/dicom_archive/locale/hi/LC_MESSAGES/dicom_archive.json
	msgfmt -o modules/dictionary/locale/ja/LC_MESSAGES/dictionary.mo modules/dictionary/locale/ja/LC_MESSAGES/dictionary.po
	npx i18next-conv -l ja -s modules/dictionary/locale/ja/LC_MESSAGES/dictionary.po -t modules/dictionary/locale/ja/LC_MESSAGES/dictionary.json
	msgfmt -o modules/dictionary/locale/hi/LC_MESSAGES/dictionary.mo modules/dictionary/locale/hi/LC_MESSAGES/dictionary.po
	npx i18next-conv -l hi -s modules/dictionary/locale/hi/LC_MESSAGES/dictionary.po -t modules/dictionary/locale/hi/LC_MESSAGES/dictionary.json
	msgfmt -o modules/document_repository/locale/ja/LC_MESSAGES/document_repository.mo modules/document_repository/locale/ja/LC_MESSAGES/document_repository.po
	msgfmt -o modules/dqt/locale/ja/LC_MESSAGES/dqt.mo modules/dqt/locale/ja/LC_MESSAGES/dqt.po
	msgfmt -o modules/electrophysiology_browser/locale/ja/LC_MESSAGES/electrophysiology_browser.mo modules/electrophysiology_browser/locale/ja/LC_MESSAGES/electrophysiology_browser.po
	msgfmt -o modules/electrophysiology_uploader/locale/ja/LC_MESSAGES/electrophysiology_uploader.mo modules/electrophysiology_uploader/locale/ja/LC_MESSAGES/electrophysiology_uploader.po
	msgfmt -o modules/examiner/locale/ja/LC_MESSAGES/examiner.mo modules/examiner/locale/ja/LC_MESSAGES/examiner.po
	msgfmt -o modules/genomic_browser/locale/ja/LC_MESSAGES/genomic_browser.mo modules/genomic_browser/locale/ja/LC_MESSAGES/genomic_browser.po
	msgfmt -o modules/help_editor/locale/ja/LC_MESSAGES/help_editor.mo modules/help_editor/locale/ja/LC_MESSAGES/help_editor.po
	msgfmt -o modules/help_editor/locale/hi/LC_MESSAGES/help_editor.mo modules/help_editor/locale/hi/LC_MESSAGES/help_editor.po
	npx i18next-conv -l hi -s modules/help_editor/locale/hi/LC_MESSAGES/help_editor.po -t modules/help_editor/locale/hi/LC_MESSAGES/help_editor.json
	npx i18next-conv -l ja -s modules/help_editor/locale/ja/LC_MESSAGES/help_editor.po -t modules/help_editor/locale/ja/LC_MESSAGES/help_editor.json
	msgfmt -o modules/imaging_browser/locale/ja/LC_MESSAGES/imaging_browser.mo modules/imaging_browser/locale/ja/LC_MESSAGES/imaging_browser.po
	npx i18next-conv -l ja -s modules/imaging_browser/locale/ja/LC_MESSAGES/imaging_browser.po -t modules/imaging_browser/locale/ja/LC_MESSAGES/imaging_browser.json --compatibilityJSON v4
	msgfmt -o modules/imaging_qc/locale/ja/LC_MESSAGES/imaging_qc.mo modules/imaging_qc/locale/ja/LC_MESSAGES/imaging_qc.po
	msgfmt -o modules/imaging_uploader/locale/ja/LC_MESSAGES/imaging_uploader.mo modules/imaging_uploader/locale/ja/LC_MESSAGES/imaging_uploader.po
	msgfmt -o modules/imaging_uploader/locale/hi/LC_MESSAGES/imaging_uploader.mo modules/imaging_uploader/locale/hi/LC_MESSAGES/imaging_uploader.po
	npx i18next-conv -l hi -s modules/imaging_uploader/locale/hi/LC_MESSAGES/imaging_uploader.po -t modules/imaging_uploader/locale/hi/LC_MESSAGES/imaging_uploader.json
	msgfmt -o modules/instrument_builder/locale/ja/LC_MESSAGES/instrument_builder.mo modules/instrument_builder/locale/ja/LC_MESSAGES/instrument_builder.po
	msgfmt -o modules/instrument_builder/locale/hi/LC_MESSAGES/instrument_builder.mo modules/instrument_builder/locale/hi/LC_MESSAGES/instrument_builder.po
	npx i18next-conv -l hi -s modules/instrument_builder/locale/hi/LC_MESSAGES/instrument_builder.po -t modules/instrument_builder/locale/hi/LC_MESSAGES/instrument_builder.json --compatibilityJSON v4
	msgfmt -o modules/instrument_list/locale/ja/LC_MESSAGES/instrument_list.mo modules/instrument_list/locale/ja/LC_MESSAGES/instrument_list.po
	msgfmt -o modules/instrument_list/locale/es/LC_MESSAGES/instrument_list.mo modules/instrument_list/locale/es/LC_MESSAGES/instrument_list.po
	msgfmt -o modules/instrument_list/locale/fr/LC_MESSAGES/instrument_list.mo modules/instrument_list/locale/fr/LC_MESSAGES/instrument_list.po
	msgfmt -o modules/instrument_manager/locale/ja/LC_MESSAGES/instrument_manager.mo modules/instrument_manager/locale/ja/LC_MESSAGES/instrument_manager.po
	msgfmt -o modules/instruments/locale/ja/LC_MESSAGES/instruments.mo modules/instruments/locale/ja/LC_MESSAGES/instruments.po
	npx i18next-conv -l ja -s modules/instruments/locale/ja/LC_MESSAGES/instruments.po -t modules/instruments/locale/ja/LC_MESSAGES/instruments.json --compatibilityJSON v4
	msgfmt -o modules/instruments/locale/es/LC_MESSAGES/instruments.mo modules/instruments/locale/es/LC_MESSAGES/instruments.po
	msgfmt -o modules/issue_tracker/locale/ja/LC_MESSAGES/issue_tracker.mo modules/issue_tracker/locale/ja/LC_MESSAGES/issue_tracker.po
	msgfmt -o modules/issue_tracker/locale/hi/LC_MESSAGES/issue_tracker.mo modules/issue_tracker/locale/hi/LC_MESSAGES/issue_tracker.po
	npx i18next-conv -l hi -s modules/issue_tracker/locale/hi/LC_MESSAGES/issue_tracker.po -t modules/issue_tracker/locale/hi/LC_MESSAGES/issue_tracker.json --compatibilityJSON v4
	npx i18next-conv -l ja -s modules/issue_tracker/locale/ja/LC_MESSAGES/issue_tracker.po -t modules/issue_tracker/locale/ja/LC_MESSAGES/issue_tracker.json --compatibilityJSON v4
	msgfmt -o modules/login/locale/ja/LC_MESSAGES/login.mo modules/login/locale/ja/LC_MESSAGES/login.po
	npx i18next-conv -l ja -s modules/login/locale/ja/LC_MESSAGES/login.po -t modules/login/locale/ja/LC_MESSAGES/login.json --compatibilityJSON v4
	msgfmt -o modules/media/locale/es/LC_MESSAGES/media.mo modules/media/locale/es/LC_MESSAGES/media.po
	msgfmt -o modules/media/locale/fr/LC_MESSAGES/media.mo modules/media/locale/fr/LC_MESSAGES/media.po
	msgfmt -o modules/media/locale/ja/LC_MESSAGES/media.mo modules/media/locale/ja/LC_MESSAGES/media.po
	msgfmt -o modules/media/locale/hi/LC_MESSAGES/media.mo modules/media/locale/hi/LC_MESSAGES/media.po
	npx i18next-conv -l es -s modules/media/locale/es/LC_MESSAGES/media.po -t modules/media/locale/es/LC_MESSAGES/media.json
	npx i18next-conv -l fr -s modules/media/locale/fr/LC_MESSAGES/media.po -t modules/media/locale/fr/LC_MESSAGES/media.json
	npx i18next-conv -l ja -s modules/media/locale/ja/LC_MESSAGES/media.po -t modules/media/locale/ja/LC_MESSAGES/media.json
	npx i18next-conv -l hi -s modules/media/locale/hi/LC_MESSAGES/media.po -t modules/media/locale/hi/LC_MESSAGES/media.json
	msgfmt -o modules/module_manager/locale/ja/LC_MESSAGES/module_manager.mo modules/module_manager/locale/ja/LC_MESSAGES/module_manager.po
	msgfmt -o modules/module_manager/locale/hi/LC_MESSAGES/module_manager.mo modules/module_manager/locale/hi/LC_MESSAGES/module_manager.po
	npx i18next-conv -l hi -s modules/module_manager/locale/hi/LC_MESSAGES/module_manager.po -t modules/module_manager/locale/hi/LC_MESSAGES/module_manager.json
	msgfmt -o modules/mri_violations/locale/ja/LC_MESSAGES/mri_violations.mo modules/mri_violations/locale/ja/LC_MESSAGES/mri_violations.po
	msgfmt -o modules/my_preferences/locale/hi/LC_MESSAGES/my_preferences.mo modules/my_preferences/locale/hi/LC_MESSAGES/my_preferences.po
	npx i18next-conv -l ja -s modules/my_preferences/locale/ja/LC_MESSAGES/my_preferences.po -t modules/my_preferences/locale/ja/LC_MESSAGES/my_preferences.json --compatibilityJSON v4
	npx i18next-conv -l hi -s modules/my_preferences/locale/hi/LC_MESSAGES/my_preferences.po -t modules/my_preferences/locale/hi/LC_MESSAGES/my_preferences.json --compatibilityJSON v4
	msgfmt -o modules/my_preferences/locale/ja/LC_MESSAGES/my_preferences.mo modules/my_preferences/locale/ja/LC_MESSAGES/my_preferences.po
	msgfmt -o modules/next_stage/locale/ja/LC_MESSAGES/next_stage.mo modules/next_stage/locale/ja/LC_MESSAGES/next_stage.po
	msgfmt -o modules/next_stage/locale/es/LC_MESSAGES/next_stage.mo modules/next_stage/locale/es/LC_MESSAGES/next_stage.po
	msgfmt -o modules/oidc/locale/ja/LC_MESSAGES/oidc.mo modules/oidc/locale/ja/LC_MESSAGES/oidc.po
	msgfmt -o modules/publication/locale/ja/LC_MESSAGES/publication.mo modules/publication/locale/ja/LC_MESSAGES/publication.po
	msgfmt -o modules/publication/locale/hi/LC_MESSAGES/publication.mo modules/publication/locale/hi/LC_MESSAGES/publication.po
	npx i18next-conv -l hi -s modules/publication/locale/hi/LC_MESSAGES/publication.po -t modules/publication/locale/hi/LC_MESSAGES/publication.json
	msgfmt -o modules/schedule_module/locale/ja/LC_MESSAGES/schedule_module.mo modules/schedule_module/locale/ja/LC_MESSAGES/schedule_module.po
	msgfmt -o modules/schedule_module/locale/hi/LC_MESSAGES/schedule_module.mo modules/schedule_module/locale/hi/LC_MESSAGES/schedule_module.po
	npx i18next-conv -l hi -s modules/schedule_module/locale/hi/LC_MESSAGES/schedule_module.po -t modules/schedule_module/locale/hi/LC_MESSAGES/schedule_module.json	
	msgfmt -o modules/server_processes_manager/locale/ja/LC_MESSAGES/server_processes_manager.mo modules/server_processes_manager/locale/ja/LC_MESSAGES/server_processes_manager.po
	msgfmt -o modules/statistics/locale/ja/LC_MESSAGES/statistics.mo modules/statistics/locale/ja/LC_MESSAGES/statistics.po
	npx i18next-conv -l ja -s modules/statistics/locale/ja/LC_MESSAGES/statistics.po -t modules/statistics/locale/ja/LC_MESSAGES/statistics.json
	msgfmt -o modules/survey_accounts/locale/ja/LC_MESSAGES/survey_accounts.mo modules/survey_accounts/locale/ja/LC_MESSAGES/survey_accounts.po
	msgfmt -o modules/timepoint_list/locale/ja/LC_MESSAGES/timepoint_list.mo modules/timepoint_list/locale/ja/LC_MESSAGES/timepoint_list.po
	msgfmt -o modules/timepoint_list/locale/es/LC_MESSAGES/timepoint_list.mo modules/timepoint_list/locale/es/LC_MESSAGES/timepoint_list.po
	msgfmt -o modules/timepoint_list/locale/fr/LC_MESSAGES/timepoint_list.mo modules/timepoint_list/locale/fr/LC_MESSAGES/timepoint_list.po
	msgfmt -o modules/user_accounts/locale/ja/LC_MESSAGES/user_accounts.mo modules/user_accounts/locale/ja/LC_MESSAGES/user_accounts.po
	msgfmt -o modules/user_accounts/locale/hi/LC_MESSAGES/user_accounts.mo modules/user_accounts/locale/hi/LC_MESSAGES/user_accounts.po
	npx i18next-conv -l hi -s modules/user_accounts/locale/hi/LC_MESSAGES/user_accounts.po -t modules/user_accounts/locale/hi/LC_MESSAGES/user_accounts.json --compatibilityJSON v4
	npx i18next-conv -l ja -s modules/user_accounts/locale/ja/LC_MESSAGES/user_accounts.po -t modules/user_accounts/locale/ja/LC_MESSAGES/user_accounts.json --compatibilityJSON v4

acknowledgements: modules/acknowledgements/locale/ja/LC_MESSAGES/acknowledgements.mo
	target=acknowledgements npm run compile

create_timepoint:
	target=data_release npm run compile

data_release: modules/data_release/locale/hi/LC_MESSAGES/data_release.mo modules/data_release/locale/ja/LC_MESSAGES/data_release.mo
	npx i18next-conv -l hi -s modules/data_release/locale/hi/LC_MESSAGES/data_release.po -t modules/data_release/locale/hi/LC_MESSAGES/data_release.json
	npx i18next-conv -l ja -s modules/data_release/locale/ja/LC_MESSAGES/data_release.po -t modules/data_release/locale/ja/LC_MESSAGES/data_release.json
	target=data_release npm run compile

instrument_manager: modules/instrument_manager/locale/ja/LC_MESSAGES/instrument_manager.mo
	target=instrument_manager npm run compile

instrument_builder: modules/instrument_builder/locale/ja/LC_MESSAGES/instrument_builder.mo modules/instrument_builder/locale/hi/LC_MESSAGES/instrument_builder.mo
	npx i18next-conv -l hi -s modules/instrument_builder/locale/hi/LC_MESSAGES/instrument_builder.po -t modules/instrument_builder/locale/hi/LC_MESSAGES/instrument_builder.json --compatibilityJSON v4
	target=instrument_builder npm run compile

dataquery: modules/dataquery/locale/ja/LC_MESSAGES/dataquery.mo
	msgfmt -o modules/dataquery/locale/ja/LC_MESSAGES/dataquery.mo modules/dataquery/locale/ja/LC_MESSAGES/dataquery.po
	target=dataquery npm run compile

login: modules/login/locale/ja/LC_MESSAGES/login.mo
	npx i18next-conv -l ja -s modules/login/locale/ja/LC_MESSAGES/login.po -t modules/login/locale/ja/LC_MESSAGES/login.json --compatibilityJSON v4
	target=login npm run compile

module_manager: modules/module_manager/locale/ja/LC_MESSAGES/module_manager.mo modules/module_manager/locale/hi/LC_MESSAGES/module_manager.mo
	target=module_manager npm run compile

mri_violations: modules/mri_violations/locale/ja/LC_MESSAGES/mri_violations.mo
	target=mri_violations npm run compile

issue_tracker:
	msgfmt -o modules/issue_tracker/locale/hi/LC_MESSAGES/issue_tracker.mo modules/issue_tracker/locale/hi/LC_MESSAGES/issue_tracker.po
	npx i18next-conv -l hi -s modules/issue_tracker/locale/hi/LC_MESSAGES/issue_tracker.po -t modules/issue_tracker/locale/hi/LC_MESSAGES/issue_tracker.json
	target=issue_tracker npm run compile

candidate_list: modules/candidate_list/locale/ja/LC_MESSAGES/candidate_list.mo modules/candidate_list/locale/hi/LC_MESSAGES/candidate_list.mo
	npx i18next-conv -l ja -s modules/candidate_list/locale/ja/LC_MESSAGES/candidate_list.po -t modules/candidate_list/locale/ja/LC_MESSAGES/candidate_list.json
	npx i18next-conv -l hi -s modules/candidate_list/locale/hi/LC_MESSAGES/candidate_list.po -t modules/candidate_list/locale/hi/LC_MESSAGES/candidate_list.json
	npx i18next-conv -l fr -s modules/candidate_list/locale/fr/LC_MESSAGES/candidate_list.po -t modules/candidate_list/locale/fr/LC_MESSAGES/candidate_list.json
	target=candidate_list npm run compile

candidate_parameters: modules/candidate_parameters/locale/ja/LC_MESSAGES/candidate_parameters.mo
	target=candidate_parameters npm run compile

dashboard: modules/dashboard/locale/ja/LC_MESSAGES/dashboard.mo
	target=dashboard npm run compile

publication:
	msgfmt -o modules/publication/locale/hi/LC_MESSAGES/publication.mo modules/publication/locale/hi/LC_MESSAGES/publication.po
	npx i18next-conv -l hi -s modules/publication/locale/hi/LC_MESSAGES/publication.po -t modules/publication/locale/hi/LC_MESSAGES/publication.json
	target=publication npm run compile

schedule_module:
	msgfmt -o modules/schedule_module/locale/hi/LC_MESSAGES/schedule_module.mo modules/schedule_module/locale/hi/LC_MESSAGES/schedule_module.po
	npx i18next-conv -l hi -s modules/schedule_module/locale/hi/LC_MESSAGES/schedule_module.po -t modules/schedule_module/locale/hi/LC_MESSAGES/schedule_module.json
	target=schedule_module npm run compile

server_processes_manager: modules/server_processes_manager/locale/ja/LC_MESSAGES/server_processes_manager.mo
	target=server_processes_manager npm run compile

conflict_resolver:
	msgfmt -o modules/conflict_resolver/locale/hi/LC_MESSAGES/conflict_resolver.mo modules/conflict_resolver/locale/hi/LC_MESSAGES/conflict_resolver.po
	npx i18next-conv -l hi -s modules/conflict_resolver/locale/hi/LC_MESSAGES/conflict_resolver.po -t modules/conflict_resolver/locale/hi/LC_MESSAGES/conflict_resolver.json
	npx i18next-conv -l ja -s modules/conflict_resolver/locale/ja/LC_MESSAGES/conflict_resolver.po -t modules/conflict_resolver/locale/ja/LC_MESSAGES/conflict_resolver.json
	target=conflict_resolver npm run compile

behavioural_qc:
	msgfmt -o modules/behavioural_qc/locale/hi/LC_MESSAGES/behavioural_qc.mo modules/behavioural_qc/locale/hi/LC_MESSAGES/behavioural_qc.po
	npx i18next-conv -l hi -s modules/behavioural_qc/locale/hi/LC_MESSAGES/behavioural_qc.po -t modules/behavioural_qc/locale/hi/LC_MESSAGES/behavioural_qc.json
	target=behavioural_qc npm run compile

my_preferences: modules/my_preferences/locale/ja/LC_MESSAGES/my_preferences.mo modules/my_preferences/locale/hi/LC_MESSAGES/my_preferences.mo
	npx i18next-conv -l ja -s modules/my_preferences/locale/ja/LC_MESSAGES/my_preferences.po -t modules/my_preferences/locale/ja/LC_MESSAGES/my_preferences.json --compatibilityJSON v4
	npx i18next-conv -l hi -s modules/my_preferences/locale/hi/LC_MESSAGES/my_preferences.po -t modules/my_preferences/locale/hi/LC_MESSAGES/my_preferences.json --compatibilityJSON v4
	target=my_preferences npm run compile
