.PHONY: clean dev all check checkstatic unittests phpdev jslatest testdata fastdev jsdev locales

all: locales VERSION
	composer install --no-dev
	npm ci
	npm run build

# If anything changes, re-generate the VERSION file
VERSION: .
	tools/gen-version.sh

phpdev:
	composer install

dev: locales phpdev jsdev fastdev

jsdev:
	npm ci

fastdev: VERSION
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
checkstatic: phpdev
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

unittests: phpdev
	vendor/bin/phpunit --configuration test/phpunit.xml

# Perform all tests that don't require an install.
check: checkstatic unittests

testdata:
	php tools/raisinbread_refresh.php

locales: 
	msgfmt -o locale/ja/LC_MESSAGES/loris.mo locale/ja/LC_MESSAGES/loris.po
	npx i18next-conv -l ja -s locale/ja/LC_MESSAGES/loris.po -t locale/ja/LC_MESSAGES/loris.json
	msgfmt -o modules/new_profile/locale/ja/LC_MESSAGES/new_profile.mo modules/new_profile/locale/ja/LC_MESSAGES/new_profile.po
	msgfmt -o modules/acknowledgements/locale/ja/LC_MESSAGES/acknowledgements.mo modules/acknowledgements/locale/ja/LC_MESSAGES/acknowledgements.po
	msgfmt -o modules/api_docs/locale/ja/LC_MESSAGES/api_docs.mo modules/api_docs/locale/ja/LC_MESSAGES/api_docs.po
	msgfmt -o modules/battery_manager/locale/ja/LC_MESSAGES/battery_manager.mo modules/battery_manager/locale/ja/LC_MESSAGES/battery_manager.po
	msgfmt -o modules/behavioural_qc/locale/ja/LC_MESSAGES/behavioural_qc.mo modules/behavioural_qc/locale/ja/LC_MESSAGES/behavioural_qc.po
	msgfmt -o modules/brainbrowser/locale/ja/LC_MESSAGES/brainbrowser.mo modules/brainbrowser/locale/ja/LC_MESSAGES/brainbrowser.po
	msgfmt -o modules/bvl_feedback/locale/ja/LC_MESSAGES/bvl_feedback.mo modules/bvl_feedback/locale/ja/LC_MESSAGES/bvl_feedback.po
	msgfmt -o modules/candidate_list/locale/ja/LC_MESSAGES/candidate_list.mo modules/candidate_list/locale/ja/LC_MESSAGES/candidate_list.po
	npx i18next-conv -l ja -s modules/candidate_list/locale/ja/LC_MESSAGES/candidate_list.po -t modules/candidate_list/locale/ja/LC_MESSAGES/candidate_list.json
	msgfmt -o modules/candidate_parameters/locale/ja/LC_MESSAGES/candidate_parameters.mo modules/candidate_parameters/locale/ja/LC_MESSAGES/candidate_parameters.po
	msgfmt -o modules/candidate_profile/locale/ja/LC_MESSAGES/candidate_profile.mo modules/candidate_profile/locale/ja/LC_MESSAGES/candidate_profile.po
	msgfmt -o modules/configuration/locale/ja/LC_MESSAGES/configuration.mo modules/configuration/locale/ja/LC_MESSAGES/configuration.po
	msgfmt -o modules/configuration/locale/ja/LC_MESSAGES/configuration.mo modules/configuration/locale/ja/LC_MESSAGES/configuration.po
	msgfmt -o modules/conflict_resolver/locale/ja/LC_MESSAGES/conflict_resolver.mo modules/conflict_resolver/locale/ja/LC_MESSAGES/conflict_resolver.po
	msgfmt -o modules/create_timepoint/locale/ja/LC_MESSAGES/create_timepoint.mo modules/create_timepoint/locale/ja/LC_MESSAGES/create_timepoint.po
	msgfmt -o modules/dashboard/locale/ja/LC_MESSAGES/dashboard.mo modules/dashboard/locale/ja/LC_MESSAGES/dashboard.po
	msgfmt -o modules/datadict/locale/ja/LC_MESSAGES/datadict.mo modules/datadict/locale/ja/LC_MESSAGES/datadict.po
	msgfmt -o modules/dataquery/locale/ja/LC_MESSAGES/dataquery.mo modules/dataquery/locale/ja/LC_MESSAGES/dataquery.po
	msgfmt -o modules/data_release/locale/ja/LC_MESSAGES/data_release.mo modules/data_release/locale/ja/LC_MESSAGES/data_release.po
	msgfmt -o modules/dicom_archive/locale/ja/LC_MESSAGES/dicom_archive.mo modules/dicom_archive/locale/ja/LC_MESSAGES/dicom_archive.po
	msgfmt -o modules/dictionary/locale/ja/LC_MESSAGES/dictionary.mo modules/dictionary/locale/ja/LC_MESSAGES/dictionary.po
	msgfmt -o modules/document_repository/locale/ja/LC_MESSAGES/document_repository.mo modules/document_repository/locale/ja/LC_MESSAGES/document_repository.po
	msgfmt -o modules/dqt/locale/ja/LC_MESSAGES/dqt.mo modules/dqt/locale/ja/LC_MESSAGES/dqt.po
	msgfmt -o modules/electrophysiology_browser/locale/ja/LC_MESSAGES/electrophysiology_browser.mo modules/electrophysiology_browser/locale/ja/LC_MESSAGES/electrophysiology_browser.po
	msgfmt -o modules/electrophysiology_uploader/locale/ja/LC_MESSAGES/electrophysiology_uploader.mo modules/electrophysiology_uploader/locale/ja/LC_MESSAGES/electrophysiology_uploader.po
	msgfmt -o modules/examiner/locale/ja/LC_MESSAGES/examiner.mo modules/examiner/locale/ja/LC_MESSAGES/examiner.po
	msgfmt -o modules/genomic_browser/locale/ja/LC_MESSAGES/genomic_browser.mo modules/genomic_browser/locale/ja/LC_MESSAGES/genomic_browser.po
	msgfmt -o modules/help_editor/locale/ja/LC_MESSAGES/help_editor.mo modules/help_editor/locale/ja/LC_MESSAGES/help_editor.po
	msgfmt -o modules/imaging_browser/locale/ja/LC_MESSAGES/imaging_browser.mo modules/imaging_browser/locale/ja/LC_MESSAGES/imaging_browser.po
	msgfmt -o modules/imaging_qc/locale/ja/LC_MESSAGES/imaging_qc.mo modules/imaging_qc/locale/ja/LC_MESSAGES/imaging_qc.po
	msgfmt -o modules/imaging_uploader/locale/ja/LC_MESSAGES/imaging_uploader.mo modules/imaging_uploader/locale/ja/LC_MESSAGES/imaging_uploader.po
	msgfmt -o modules/instrument_builder/locale/ja/LC_MESSAGES/instrument_builder.mo modules/instrument_builder/locale/ja/LC_MESSAGES/instrument_builder.po
	msgfmt -o modules/instrument_list/locale/ja/LC_MESSAGES/instrument_list.mo modules/instrument_list/locale/ja/LC_MESSAGES/instrument_list.po
	msgfmt -o modules/instrument_manager/locale/ja/LC_MESSAGES/instrument_manager.mo modules/instrument_manager/locale/ja/LC_MESSAGES/instrument_manager.po
	msgfmt -o modules/instruments/locale/ja/LC_MESSAGES/instruments.mo modules/instruments/locale/ja/LC_MESSAGES/instruments.po
	msgfmt -o modules/issue_tracker/locale/ja/LC_MESSAGES/issue_tracker.mo modules/issue_tracker/locale/ja/LC_MESSAGES/issue_tracker.po
	msgfmt -o modules/login/locale/ja/LC_MESSAGES/login.mo modules/login/locale/ja/LC_MESSAGES/login.po
	msgfmt -o modules/media/locale/ja/LC_MESSAGES/media.mo modules/media/locale/ja/LC_MESSAGES/media.po
	msgfmt -o modules/module_manager/locale/ja/LC_MESSAGES/module_manager.mo modules/module_manager/locale/ja/LC_MESSAGES/module_manager.po
	msgfmt -o modules/mri_violations/locale/ja/LC_MESSAGES/mri_violations.mo modules/mri_violations/locale/ja/LC_MESSAGES/mri_violations.po
	msgfmt -o modules/next_stage/locale/ja/LC_MESSAGES/next_stage.mo modules/next_stage/locale/ja/LC_MESSAGES/next_stage.po
	msgfmt -o modules/oidc/locale/ja/LC_MESSAGES/oidc.mo modules/oidc/locale/ja/LC_MESSAGES/oidc.po
	msgfmt -o modules/publication/locale/ja/LC_MESSAGES/publication.mo modules/publication/locale/ja/LC_MESSAGES/publication.po
	msgfmt -o modules/schedule_module/locale/ja/LC_MESSAGES/schedule_module.mo modules/schedule_module/locale/ja/LC_MESSAGES/schedule_module.po
	msgfmt -o modules/schedule_module/locale/hi/LC_MESSAGES/schedule_module.mo modules/schedule_module/locale/hi/LC_MESSAGES/schedule_module.po
	npx i18next-conv -l hi -s modules/schedule_module/locale/hi/LC_MESSAGES/schedule_module.po -t modules/schedule_module/locale/hi/LC_MESSAGES/schedule_module.json
	msgfmt -o modules/server_processes_manager/locale/ja/LC_MESSAGES/server_processes_manager.mo modules/server_processes_manager/locale/ja/LC_MESSAGES/server_processes_manager.po
	msgfmt -o modules/statistics/locale/ja/LC_MESSAGES/statistics.mo modules/statistics/locale/ja/LC_MESSAGES/statistics.po
	msgfmt -o modules/survey_accounts/locale/ja/LC_MESSAGES/survey_accounts.mo modules/survey_accounts/locale/ja/LC_MESSAGES/survey_accounts.po
	msgfmt -o modules/timepoint_list/locale/ja/LC_MESSAGES/timepoint_list.mo modules/timepoint_list/locale/ja/LC_MESSAGES/timepoint_list.po
	msgfmt -o modules/user_accounts/locale/ja/LC_MESSAGES/user_accounts.mo modules/user_accounts/locale/ja/LC_MESSAGES/user_accounts.po


acknowledgements:
	target=acknowledgements npm run compile

data_release: 
	target=data_release npm run compile

instrument_manager:
	target=instrument_manager npm run compile

dataquery:
	target=dataquery npm run compile

login:
	target=login npm run compile

module_manager:
	target=module_manager npm run compile

mri_violations:
	target=mri_violations npm run compile

issue_tracker:
	target=issue_tracker npm run compile

candidate_list:
	msgfmt -o modules/candidate_list/locale/ja/LC_MESSAGES/candidate_list.mo modules/candidate_list/locale/ja/LC_MESSAGES/candidate_list.po
	npx i18next-conv -l ja -s modules/candidate_list/locale/ja/LC_MESSAGES/candidate_list.po -t modules/candidate_list/locale/ja/LC_MESSAGES/candidate_list.json
	target=candidate_list npm run compile

candidate_parameters:
	target=candidate_parameters npm run compile

dashboard:
	target=dashboard npm run compile

publication:
	target=publication npm run compile

server_processes_manager:
	target=server_processes_manager npm run compile

conflict_resolver:
	target=conflict_resolver npm run compile
