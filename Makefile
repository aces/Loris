.PHONY: clean dev all check checkstatic unittests jslatest testdata locales

POFILES=locale/fr/LC_MESSAGES/loris.po \
	locale/ja/LC_MESSAGES/loris.po \
	locale/hi/LC_MESSAGES/loris.po \
	locale/es/LC_MESSAGES/loris.po \
	locale/en/LC_MESSAGES/loris.po \
	modules/media/locale/fr/LC_MESSAGES/media.po \
	modules/media/locale/ja/LC_MESSAGES/media.po \
	modules/media/locale/hi/LC_MESSAGES/media.po \
	modules/media/locale/es/LC_MESSAGES/media.po \
	modules/datadict/locale/fr/LC_MESSAGES/datadict.po \
	modules/datadict/locale/ja/LC_MESSAGES/datadict.po \
	modules/datadict/locale/hi/LC_MESSAGES/datadict.po \
	modules/mri_violations/locale/fr/LC_MESSAGES/mri_violations.po \
	modules/mri_violations/locale/ja/LC_MESSAGES/mri_violations.po \
	modules/mri_violations/locale/hi/LC_MESSAGES/mri_violations.po \
	modules/mri_violations/locale/es/LC_MESSAGES/mri_violations.po \
	modules/statistics/locale/fr/LC_MESSAGES/statistics.po \
	modules/statistics/locale/ja/LC_MESSAGES/statistics.po \
	modules/server_processes_manager/locale/ja/LC_MESSAGES/server_processes_manager.po \
	modules/module_manager/locale/ja/LC_MESSAGES/module_manager.po \
	modules/module_manager/locale/hi/LC_MESSAGES/module_manager.po \
	modules/configuration/locale/ja/LC_MESSAGES/configuration.po \
	modules/oidc/locale/ja/LC_MESSAGES/oidc.po \
	modules/instrument_list/locale/fr/LC_MESSAGES/instrument_list.po \
	modules/instrument_list/locale/ja/LC_MESSAGES/instrument_list.po \
	modules/instrument_list/locale/es/LC_MESSAGES/instrument_list.po \
	modules/my_preferences/locale/fr/LC_MESSAGES/my_preferences.po \
	modules/my_preferences/locale/ja/LC_MESSAGES/my_preferences.po \
	modules/my_preferences/locale/hi/LC_MESSAGES/my_preferences.po \
	modules/dicom_archive/locale/fr/LC_MESSAGES/dicom_archive.po \
	modules/dicom_archive/locale/ja/LC_MESSAGES/dicom_archive.po \
	modules/dicom_archive/locale/hi/LC_MESSAGES/dicom_archive.po \
	modules/new_profile/locale/fr/LC_MESSAGES/new_profile.po \
	modules/new_profile/locale/ja/LC_MESSAGES/new_profile.po \
	modules/new_profile/locale/hi/LC_MESSAGES/new_profile.po \
	modules/new_profile/locale/es/LC_MESSAGES/new_profile.po \
	modules/dqt/locale/ja/LC_MESSAGES/dqt.po \
	modules/bvl_feedback/locale/ja/LC_MESSAGES/bvl_feedback.po \
	modules/genomic_browser/locale/ja/LC_MESSAGES/genomic_browser.po \
	modules/instruments/locale/fr/LC_MESSAGES/instruments.po \
	modules/instruments/locale/ja/LC_MESSAGES/instruments.po \
	modules/instruments/locale/es/LC_MESSAGES/instruments.po \
	modules/dictionary/locale/fr/LC_MESSAGES/dictionary.po \
	modules/dictionary/locale/ja/LC_MESSAGES/dictionary.po \
	modules/dictionary/locale/hi/LC_MESSAGES/dictionary.po \
	modules/instrument_manager/locale/ja/LC_MESSAGES/instrument_manager.po \
	modules/candidate_profile/locale/fr/LC_MESSAGES/candidate_profile.po \
	modules/candidate_profile/locale/ja/LC_MESSAGES/candidate_profile.po \
	modules/behavioural_qc/locale/fr/LC_MESSAGES/behavioural_qc.po \
	modules/behavioural_qc/locale/ja/LC_MESSAGES/behavioural_qc.po \
	modules/behavioural_qc/locale/hi/LC_MESSAGES/behavioural_qc.po \
	modules/user_accounts/locale/fr/LC_MESSAGES/user_accounts.po \
	modules/user_accounts/locale/ja/LC_MESSAGES/user_accounts.po \
	modules/user_accounts/locale/hi/LC_MESSAGES/user_accounts.po \
	modules/schedule_module/locale/fr/LC_MESSAGES/schedule_module.po \
	modules/schedule_module/locale/ja/LC_MESSAGES/schedule_module.po \
	modules/schedule_module/locale/hi/LC_MESSAGES/schedule_module.po \
	modules/imaging_uploader/locale/ja/LC_MESSAGES/imaging_uploader.po \
	modules/imaging_uploader/locale/hi/LC_MESSAGES/imaging_uploader.po \
	modules/next_stage/locale/fr/LC_MESSAGES/next_stage.po \
	modules/next_stage/locale/ja/LC_MESSAGES/next_stage.po \
	modules/next_stage/locale/es/LC_MESSAGES/next_stage.po \
	modules/examiner/locale/ja/LC_MESSAGES/examiner.po \
	modules/examiner/locale/hi/LC_MESSAGES/examiner.po \
	modules/login/locale/ja/LC_MESSAGES/login.po \
	modules/instrument_builder/locale/fr/LC_MESSAGES/instrument_builder.po \
	modules/instrument_builder/locale/ja/LC_MESSAGES/instrument_builder.po \
	modules/instrument_builder/locale/hi/LC_MESSAGES/instrument_builder.po \
	modules/document_repository/locale/ja/LC_MESSAGES/document_repository.po \
	modules/document_repository/locale/hi/LC_MESSAGES/document_repository.po \
	modules/conflict_resolver/locale/fr/LC_MESSAGES/conflict_resolver.po \
	modules/conflict_resolver/locale/ja/LC_MESSAGES/conflict_resolver.po \
	modules/conflict_resolver/locale/hi/LC_MESSAGES/conflict_resolver.po \
	modules/candidate_list/locale/fr/LC_MESSAGES/candidate_list.po \
	modules/candidate_list/locale/ja/LC_MESSAGES/candidate_list.po \
	modules/candidate_list/locale/hi/LC_MESSAGES/candidate_list.po \
	modules/create_timepoint/locale/fr/LC_MESSAGES/create_timepoint.po \
	modules/create_timepoint/locale/ja/LC_MESSAGES/create_timepoint.po \
	modules/create_timepoint/locale/es/LC_MESSAGES/create_timepoint.po \
	modules/brainbrowser/locale/ja/LC_MESSAGES/brainbrowser.po \
	modules/brainbrowser/locale/hi/LC_MESSAGES/brainbrowser.po \
	modules/dataquery/locale/ja/LC_MESSAGES/dataquery.po \
	modules/dataquery/locale/hi/LC_MESSAGES/dataquery.po \
	modules/issue_tracker/locale/fr/LC_MESSAGES/issue_tracker.po \
	modules/issue_tracker/locale/ja/LC_MESSAGES/issue_tracker.po \
	modules/issue_tracker/locale/hi/LC_MESSAGES/issue_tracker.po \
	modules/timepoint_list/locale/fr/LC_MESSAGES/timepoint_list.po \
	modules/timepoint_list/locale/ja/LC_MESSAGES/timepoint_list.po \
	modules/timepoint_list/locale/es/LC_MESSAGES/timepoint_list.po \
	modules/data_release/locale/fr/LC_MESSAGES/data_release.po \
	modules/data_release/locale/ja/LC_MESSAGES/data_release.po \
	modules/data_release/locale/hi/LC_MESSAGES/data_release.po \
	modules/electrophysiology_uploader/locale/ja/LC_MESSAGES/electrophysiology_uploader.po \
	modules/electrophysiology_uploader/locale/hi/LC_MESSAGES/electrophysiology_uploader.po \
	modules/acknowledgements/locale/ja/LC_MESSAGES/acknowledgements.po \
	modules/survey_accounts/locale/ja/LC_MESSAGES/survey_accounts.po \
	modules/battery_manager/locale/ja/LC_MESSAGES/battery_manager.po \
	modules/battery_manager/locale/hi/LC_MESSAGES/battery_manager.po \
	modules/imaging_qc/locale/ja/LC_MESSAGES/imaging_qc.po \
	modules/electrophysiology_browser/locale/fr/LC_MESSAGES/electrophysiology_browser.po \
	modules/electrophysiology_browser/locale/ja/LC_MESSAGES/electrophysiology_browser.po \
	modules/api_docs/locale/ja/LC_MESSAGES/api_docs.po \
	modules/publication/locale/fr/LC_MESSAGES/publication.po \
	modules/publication/locale/ja/LC_MESSAGES/publication.po \
	modules/publication/locale/hi/LC_MESSAGES/publication.po \
	modules/publication/locale/en/LC_MESSAGES/publication.po \
	modules/dashboard/locale/ja/LC_MESSAGES/dashboard.po \
	modules/candidate_parameters/locale/ja/LC_MESSAGES/candidate_parameters.po \
	modules/imaging_browser/locale/ja/LC_MESSAGES/imaging_browser.po \
	modules/imaging_browser/locale/hi/LC_MESSAGES/imaging_browser.po \
	modules/help_editor/locale/fr/LC_MESSAGES/help_editor.po \
	modules/help_editor/locale/ja/LC_MESSAGES/help_editor.po \
	modules/help_editor/locale/hi/LC_MESSAGES/help_editor.po

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

acknowledgements: $(filter modules/acknowledgements/%,$(MOFILES)) $(filter modules/acknowledgements/%,$(I18NJSONFILES))
	target=acknowledgements npm run compile

create_timepoint: $(filter modules/create_timepoint/%,$(MOFILES)) $(filter modules/create_timepoint/%,$(I18NJSONFILES))
	target=data_release npm run compile

data_release: $(filter modules/data_release/%,$(MOFILES)) $(filter modules/data_release/%,$(I18NJSONFILES))
	target=data_release npm run compile

instrument_manager: $(filter modules/instrument_manager/%,$(MOFILES)) $(filter modules/instrument_manager/%,$(I18NJSONFILES))
	target=instrument_manager npm run compile

instrument_builder: $(filter modules/instrument_builder/%,$(MOFILES)) $(filter modules/instrument_builder/%,$(I18NJSONFILES))
	target=instrument_builder npm run compile

dataquery: $(filter modules/dataquery/%,$(MOFILES)) $(filter modules/dataquery/%,$(I18NJSONFILES))
	target=dataquery npm run compile

login: $(filter modules/login/%,$(MOFILES)) $(filter modules/login/%,$(I18NJSONFILES))
	target=login npm run compile

module_manager: $(filter modules/module_manager/%,$(MOFILES)) $(filter modules/module_manager/%,$(I18NJSONFILES))
	target=module_manager npm run compile

mri_violations: $(filter modules/mri_violations/%,$(MOFILES)) $(filter modules/mri_violations/%,$(I18NJSONFILES))
	target=mri_violations npm run compile

issue_tracker: $(filter modules/issue_tracker/%,$(MOFILES)) $(filter modules/issue_tracker/%,$(I18NJSONFILES))
	target=issue_tracker npm run compile

candidate_list: $(filter modules/candidate_list/%,$(MOFILES)) $(filter modules/candidate_list/%,$(I18NJSONFILES))
	target=candidate_list npm run compile

candidate_parameters: $(filter modules/candidate_parameters/%,$(MOFILES)) $(filter modules/candidate_parameters/%,$(I18NJSONFILES))
	target=candidate_parameters npm run compile

dashboard: $(filter modules/dashboard/%,$(MOFILES)) $(filter modules/dashboard/%,$(I18NJSONFILES))
	target=dashboard npm run compile

brainbrowser: $(filter modules/brainbrowser/%,$(MOFILES)) $(filter modules/brainbrowser/%,$(I18NJSONFILES))
	target=brainbrowser npm run compile

schedule_module: $(filter modules/schedule_module/%,$(MOFILES)) $(filter modules/schedule_module/%,$(I18NJSONFILES))
	target=schedule_module npm run compile

behavioural_qc: $(filter modules/behavioural_qc/%,$(MOFILES)) $(filter modules/behavioural_qc/%,$(I18NJSONFILES))
	target=behavioural_qc npm run compile

publication: $(filter modules/publication/%,$(MOFILES)) $(filter modules/publication/%,$(I18NJSONFILES))
	target=publication npm run compile

server_processes_manager: $(filter modules/server_processes_manager/%,$(MOFILES)) $(filter modules/server_processes_manager/%,$(I18NJSONFILES))
	target=server_processes_manager npm run compile

conflict_resolver: $(filter modules/conflict_resolver/%,$(MOFILES)) $(filter modules/conflict_resolver/%,$(I18NJSONFILES))
	target=conflict_resolver npm run compile

my_preferences: $(filter modules/my_preferences/%,$(MOFILES)) $(filter modules/my_preferences/%,$(I18NJSONFILES))
	target=my_preferences npm run compile

electrophysiology_browser: $(filter modules/electrophysiology_browser/%,$(MOFILES)) $(filter modules/electrophysiology_browser/%,$(I18NJSONFILES))
    target=electrophysiology_browser npm run compile

dicom_archive: $(filter modules/dicom_archive/%,$(MOFILES)) $(filter modules/dicom_archive/%,$(I18NJSONFILES))
    target=dicom_archive npm run compile
