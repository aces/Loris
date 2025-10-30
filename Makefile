.PHONY: clean dev all check checkstatic unittests jslatest testdata locales

POFILES=locale/fr/LC_MESSAGES/loris.po \
	locale/ja/LC_MESSAGES/loris.po \
	locale/hi/LC_MESSAGES/loris.po \
	locale/es/LC_MESSAGES/loris.po \
	locale/en/LC_MESSAGES/loris.po \
	modules/media/locale/ja/LC_MESSAGES/media.po \
	modules/datadict/locale/ja/LC_MESSAGES/datadict.po \
	modules/datadict/locale/hi/LC_MESSAGES/datadict.po \
	modules/mri_violations/locale/ja/LC_MESSAGES/mri_violations.po \
	modules/statistics/locale/ja/LC_MESSAGES/statistics.po \
	modules/server_processes_manager/locale/ja/LC_MESSAGES/server_processes_manager.po \
	modules/module_manager/locale/ja/LC_MESSAGES/module_manager.po \
	modules/configuration/locale/ja/LC_MESSAGES/configuration.po \
	modules/oidc/locale/ja/LC_MESSAGES/oidc.po \
	modules/instrument_list/locale/ja/LC_MESSAGES/instrument_list.po \
	modules/instrument_list/locale/es/LC_MESSAGES/instrument_list.po \
	modules/my_preferences/locale/ja/LC_MESSAGES/my_preferences.po \
	modules/my_preferences/locale/hi/LC_MESSAGES/my_preferences.po \
	modules/dicom_archive/locale/ja/LC_MESSAGES/dicom_archive.po \
	modules/new_profile/locale/ja/LC_MESSAGES/new_profile.po \
	modules/new_profile/locale/hi/LC_MESSAGES/new_profile.po \
	modules/new_profile/locale/es/LC_MESSAGES/new_profile.po \
	modules/dqt/locale/ja/LC_MESSAGES/dqt.po \
	modules/bvl_feedback/locale/ja/LC_MESSAGES/bvl_feedback.po \
	modules/genomic_browser/locale/ja/LC_MESSAGES/genomic_browser.po \
	modules/instruments/locale/ja/LC_MESSAGES/instruments.po \
	modules/instruments/locale/es/LC_MESSAGES/instruments.po \
	modules/dictionary/locale/ja/LC_MESSAGES/dictionary.po \
	modules/dictionary/locale/hi/LC_MESSAGES/dictionary.po \
	modules/instrument_manager/locale/ja/LC_MESSAGES/instrument_manager.po \
	modules/candidate_profile/locale/ja/LC_MESSAGES/candidate_profile.po \
	modules/behavioural_qc/locale/ja/LC_MESSAGES/behavioural_qc.po \
	modules/user_accounts/locale/ja/LC_MESSAGES/user_accounts.po \
	modules/schedule_module/locale/ja/LC_MESSAGES/schedule_module.po \
	modules/imaging_uploader/locale/ja/LC_MESSAGES/imaging_uploader.po \
	modules/next_stage/locale/ja/LC_MESSAGES/next_stage.po \
	modules/next_stage/locale/es/LC_MESSAGES/next_stage.po \
	modules/examiner/locale/ja/LC_MESSAGES/examiner.po \
	modules/login/locale/ja/LC_MESSAGES/login.po \
	modules/instrument_builder/locale/ja/LC_MESSAGES/instrument_builder.po \
	modules/document_repository/locale/ja/LC_MESSAGES/document_repository.po \
	modules/conflict_resolver/locale/ja/LC_MESSAGES/conflict_resolver.po \
	modules/candidate_list/locale/ja/LC_MESSAGES/candidate_list.po \
	modules/candidate_list/locale/hi/LC_MESSAGES/candidate_list.po \
	modules/create_timepoint/locale/ja/LC_MESSAGES/create_timepoint.po \
	modules/create_timepoint/locale/es/LC_MESSAGES/create_timepoint.po \
	modules/brainbrowser/locale/ja/LC_MESSAGES/brainbrowser.po \
	modules/dataquery/locale/ja/LC_MESSAGES/dataquery.po \
	modules/issue_tracker/locale/ja/LC_MESSAGES/issue_tracker.po \
	modules/timepoint_list/locale/ja/LC_MESSAGES/timepoint_list.po \
	modules/timepoint_list/locale/es/LC_MESSAGES/timepoint_list.po \
	modules/data_release/locale/ja/LC_MESSAGES/data_release.po \
	modules/data_release/locale/hi/LC_MESSAGES/data_release.po \
	modules/electrophysiology_uploader/locale/ja/LC_MESSAGES/electrophysiology_uploader.po \
	modules/acknowledgements/locale/ja/LC_MESSAGES/acknowledgements.po \
	modules/survey_accounts/locale/ja/LC_MESSAGES/survey_accounts.po \
	modules/battery_manager/locale/ja/LC_MESSAGES/battery_manager.po \
	modules/imaging_qc/locale/ja/LC_MESSAGES/imaging_qc.po \
	modules/electrophysiology_browser/locale/ja/LC_MESSAGES/electrophysiology_browser.po \
	modules/api_docs/locale/ja/LC_MESSAGES/api_docs.po \
	modules/publication/locale/ja/LC_MESSAGES/publication.po \
	modules/dashboard/locale/ja/LC_MESSAGES/dashboard.po \
	modules/candidate_parameters/locale/ja/LC_MESSAGES/candidate_parameters.po \
	modules/imaging_browser/locale/ja/LC_MESSAGES/imaging_browser.po \
	modules/help_editor/locale/ja/LC_MESSAGES/help_editor.po

MOFILES=$(patsubst %.po,%.mo,$(POFILES))
I18NJSONFILES=$(patsubst %.po,%.json,$(POFILES))

all: node_modules locales VERSION vendor
	npm run build

%.mo: %.po
	msgfmt -o $@ $<

%.json: %.po
	npx i18next-conv -l UNUSED -t $@ -s $< --compatibilityJSON v4

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

locales: $(MOFILES) $(I18NJSONFILES)

acknowledgements: modules/acknowledgements/locale/ja/LC_MESSAGES/acknowledgements.mo
	target=acknowledgements npm run compile

create_timepoint:
	target=data_release npm run compile

data_release: modules/data_release/locale/hi/LC_MESSAGES/data_release.mo modules/data_release/locale/ja/LC_MESSAGES/data_release.mo modules/data_release/locale/hi/LC_MESSAGES/data_release.json modules/data_release/locale/ja/LC_MESSAGES/data_release.json 
	target=data_release npm run compile

instrument_manager: modules/instrument_manager/locale/ja/LC_MESSAGES/instrument_manager.mo
	target=instrument_manager npm run compile

instrument_builder: modules/instrument_builder/locale/ja/LC_MESSAGES/instrument_builder.mo modules/instrument_builder/locale/hi/LC_MESSAGES/instrument_builder.mo
	target=instrument_builder npm run compile

dataquery: modules/dataquery/locale/ja/LC_MESSAGES/dataquery.mo
	target=dataquery npm run compile

login: modules/login/locale/ja/LC_MESSAGES/login.mo
	npx i18next-conv -l ja -s modules/login/locale/ja/LC_MESSAGES/login.po -t modules/login/locale/ja/LC_MESSAGES/login.json --compatibilityJSON v4
	target=login npm run compile

module_manager: modules/module_manager/locale/ja/LC_MESSAGES/module_manager.mo modules/module_manager/locale/hi/LC_MESSAGES/module_manager.mo
	target=module_manager npm run compile

mri_violations:
	msgfmt -o modules/mri_violations/locale/hi/LC_MESSAGES/mri_violations.mo modules/mri_violations/locale/hi/LC_MESSAGES/mri_violations.po
	npx i18next-conv -l hi -s modules/mri_violations/locale/hi/LC_MESSAGES/mri_violations.po -t modules/mri_violations/locale/hi/LC_MESSAGES/mri_violations.json
	target=mri_violations npm run compile

issue_tracker:
	msgfmt -o modules/issue_tracker/locale/hi/LC_MESSAGES/issue_tracker.mo modules/issue_tracker/locale/hi/LC_MESSAGES/issue_tracker.po
	npx i18next-conv -l hi -s modules/issue_tracker/locale/hi/LC_MESSAGES/issue_tracker.po -t modules/issue_tracker/locale/hi/LC_MESSAGES/issue_tracker.json
	target=issue_tracker npm run compile

candidate_list: modules/candidate_list/locale/ja/LC_MESSAGES/candidate_list.mo modules/candidate_list/locale/hi/LC_MESSAGES/candidate_list.mo modules/candidate_list/locale/ja/LC_MESSAGES/candidate_list.json modules/candidate_list/locale/hi/LC_MESSAGES/candidate_list.json
	target=candidate_list npm run compile

candidate_parameters: modules/candidate_parameters/locale/ja/LC_MESSAGES/candidate_parameters.mo
	target=candidate_parameters npm run compile

dashboard: modules/dashboard/locale/ja/LC_MESSAGES/dashboard.mo
	target=dashboard npm run compile

publication:
	msgfmt -o modules/publication/locale/hi/LC_MESSAGES/publication.mo modules/publication/locale/hi/LC_MESSAGES/publication.po
	npx i18next-conv -l hi -s modules/publication/locale/hi/LC_MESSAGES/publication.po -t modules/publication/locale/hi/LC_MESSAGES/publication.json
	target=publication npm run compile

brainbrowser:
	msgfmt -o modules/brainbrowser/locale/hi/LC_MESSAGES/brainbrowser.mo modules/brainbrowser/locale/hi/LC_MESSAGES/brainbrowser.po
	npx i18next-conv -l hi -s modules/brainbrowser/locale/hi/LC_MESSAGES/brainbrowser.po -t modules/brainbrowser/locale/hi/LC_MESSAGES/brainbrowser.json
	target=brainbrowser npm run compile

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

behavioural_qc: modules/behavioural_qc/locale/hi/LC_MESSAGES/behavioural_qc.mo modules/behavioural_qc/locale/hi/LC_MESSAGES/behavioural_qc.json
	target=behavioural_qc npm run compile

my_preferences: modules/my_preferences/locale/ja/LC_MESSAGES/my_preferences.mo modules/my_preferences/locale/hi/LC_MESSAGES/my_preferences.mo modules/my_preferences/locale/ja/LC_MESSAGES/my_preferences.json modules/my_preferences/locale/hi/LC_MESSAGES/my_preferences.json 
	target=my_preferences npm run compile
