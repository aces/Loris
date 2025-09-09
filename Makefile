.PHONY: clean dev all check checkstatic unittests phpdev jslatest testdata fastdev jsdev locales

# Compiled Translation files
MOFILES=locale/ja/LC_MESSAGES/loris.mo \
	locale/hi/LC_MESSAGES/loris.mo \
	modules/new_profile/locale/ja/LC_MESSAGES/new_profile.mo\
	modules/acknowledgements/locale/ja/LC_MESSAGES/acknowledgements.mo\
	modules/api_docs/locale/ja/LC_MESSAGES/api_docs.mo\
	modules/battery_manager/locale/ja/LC_MESSAGES/battery_manager.mo\
	modules/behavioural_qc/locale/ja/LC_MESSAGES/behavioural_qc.mo\
	modules/brainbrowser/locale/ja/LC_MESSAGES/brainbrowser.mo\
	modules/bvl_feedback/locale/ja/LC_MESSAGES/bvl_feedback.mo\
	modules/candidate_list/locale/ja/LC_MESSAGES/candidate_list.mo\
	modules/candidate_list/locale/hi/LC_MESSAGES/candidate_list.mo\
	modules/candidate_parameters/locale/ja/LC_MESSAGES/candidate_parameters.mo\
	modules/candidate_profile/locale/ja/LC_MESSAGES/candidate_profile.mo\
	modules/configuration/locale/ja/LC_MESSAGES/configuration.mo\
	modules/configuration/locale/ja/LC_MESSAGES/configuration.mo\
	modules/conflict_resolver/locale/ja/LC_MESSAGES/conflict_resolver.mo\
	modules/create_timepoint/locale/ja/LC_MESSAGES/create_timepoint.mo\
	modules/dashboard/locale/ja/LC_MESSAGES/dashboard.mo\
	modules/datadict/locale/ja/LC_MESSAGES/datadict.mo\
	modules/datadict/locale/hi/LC_MESSAGES/datadict.mo\
	modules/dataquery/locale/ja/LC_MESSAGES/dataquery.mo\
	modules/data_release/locale/ja/LC_MESSAGES/data_release.mo\
	modules/data_release/locale/hi/LC_MESSAGES/data_release.mo\
	modules/dicom_archive/locale/ja/LC_MESSAGES/dicom_archive.mo\
	modules/dictionary/locale/ja/LC_MESSAGES/dictionary.mo\
	modules/document_repository/locale/ja/LC_MESSAGES/document_repository.mo\
	modules/dqt/locale/ja/LC_MESSAGES/dqt.mo\
	modules/electrophysiology_browser/locale/ja/LC_MESSAGES/electrophysiology_browser.mo\
	modules/electrophysiology_uploader/locale/ja/LC_MESSAGES/electrophysiology_uploader.mo\
	modules/examiner/locale/ja/LC_MESSAGES/examiner.mo\
	modules/genomic_browser/locale/ja/LC_MESSAGES/genomic_browser.mo\
	modules/help_editor/locale/ja/LC_MESSAGES/help_editor.mo\
	modules/imaging_browser/locale/ja/LC_MESSAGES/imaging_browser.mo\
	modules/imaging_qc/locale/ja/LC_MESSAGES/imaging_qc.mo\
	modules/imaging_uploader/locale/ja/LC_MESSAGES/imaging_uploader.mo\
	modules/instrument_builder/locale/ja/LC_MESSAGES/instrument_builder.mo\
	modules/instrument_list/locale/ja/LC_MESSAGES/instrument_list.mo\
	modules/instrument_manager/locale/ja/LC_MESSAGES/instrument_manager.mo\
	modules/instruments/locale/ja/LC_MESSAGES/instruments.mo\
	modules/issue_tracker/locale/ja/LC_MESSAGES/issue_tracker.mo\
	modules/login/locale/ja/LC_MESSAGES/login.mo\
	modules/media/locale/ja/LC_MESSAGES/media.mo\
	modules/module_manager/locale/ja/LC_MESSAGES/module_manager.mo\
	modules/mri_violations/locale/ja/LC_MESSAGES/mri_violations.mo\
	modules/next_stage/locale/ja/LC_MESSAGES/next_stage.mo\
	modules/oidc/locale/ja/LC_MESSAGES/oidc.mo\
	modules/publication/locale/ja/LC_MESSAGES/publication.mo\
	modules/schedule_module/locale/ja/LC_MESSAGES/schedule_module.mo\
	modules/server_processes_manager/locale/ja/LC_MESSAGES/server_processes_manager.mo\
	modules/statistics/locale/ja/LC_MESSAGES/statistics.mo\
	modules/survey_accounts/locale/ja/LC_MESSAGES/survey_accounts.mo\
	modules/timepoint_list/locale/ja/LC_MESSAGES/timepoint_list.mo \
	modules/user_accounts/locale/ja/LC_MESSAGES/user_accounts.mo

I18NextJAFiles:=locale/ja/LC_MESSAGES/loris.json \
	modules/candidate_list/locale/ja/LC_MESSAGES/candidate_list.json \
	modules/datadict/locale/ja/LC_MESSAGES/datadict.json \
	modules/data_release/locale/ja/LC_MESSAGES/data_release.json
I18NextHIFiles:=locale/hi/LC_MESSAGES/loris.json \
	modules/candidate_list/locale/hi/LC_MESSAGES/candidate_list.json \
	modules/datadict/locale/hi/LC_MESSAGES/datadict.json \
	modules/data_release/locale/hi/LC_MESSAGES/data_release.json

I18NextFiles=$(I18NextJAFiles) $(I18NextHIFiles)

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

%.mo: %.po
	msgfmt -o $@ $<

locale/%/LC_MESSAGES/loris.json: locale/%/LC_MESSAGES/loris.po
	npx i18next-conv -l $* -s $? -t $@

locales: $(MOFILES) $(I18NextFiles)

acknowledgements:
	target=acknowledgements npm run compile

modules/datadict/locale/%/LC_MESSAGES/datadict.json: modules/datadict/locale/%/LC_MESSAGES/datadict.po
	npx i18next-conv -l $* -s $? -t $@

modules/data_release/locale/%/LC_MESSAGES/data_release.json: modules/data_release/locale/%/LC_MESSAGES/data_release.po
	npx i18next-conv -l $* -s $? -t $@

data_release: modules/data_release/locale/ja/LC_MESSAGES/data_release.mo modules/data_release/locale/hi/LC_MESSAGES/data_release.mo modules/data_release/locale/ja/LC_MESSAGES/data_release.json modules/data_release/locale/hi/LC_MESSAGES/data_release.json
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

modules/candidate_list/locale/%/LC_MESSAGES/candidate_list.json: modules/candidate_list/locale/%/LC_MESSAGES/candidate_list.po
	npx i18next-conv -l $* -s $? -t $@

candidate_list: modules/candidate_list/locale/ja/LC_MESSAGES/candidate_list.json modules/candidate_list/locale/ja/LC_MESSAGES/candidate_list.mo
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
