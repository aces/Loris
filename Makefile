.PHONY: clean dev all check checkstatic unittests jslatest testdata locales

POFILES=$(wildcard locale/*/LC_MESSAGES/*.po modules/*/locale/*/LC_MESSAGES/*.po project/modules/*/locale/*/LC_MESSAGES/*.po project/locale/*/LC_MESSAGES/*.po)

MOFILES=$(patsubst %.po,%.mo,$(POFILES))
I18NJSONFILES=$(patsubst %.po,%.json,$(POFILES))

all: node_modules locales VERSION vendor
	npm run build

%.mo: %.po
	msgfmt --use-fuzzy -o $@ $<

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

survey_accounts: $(filter modules/survey_accounts/%,$(MOFILES)) $(filter modules/survey_accounts/%,$(I18NJSONFILES))
	target=survey_accounts npm run compile

dicom_archive: $(filter modules/dicom_archive/%,$(MOFILES)) $(filter modules/dicom_archive/%,$(I18NJSONFILES))
	target=dicom_archive npm run compile
