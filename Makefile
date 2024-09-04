.PHONY: clean dev all check checkstatic unittests phpdev jslatest testdata fastdev jsdev

all: VERSION
	composer install --no-dev
	npm ci
	npm run build

# If anything changes, re-generate the VERSION file
VERSION: .
	tools/gen-version.sh

phpdev:
	composer install

dev: phpdev jsdev fastdev 

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
	target=candidate_list npm run compile

candidate_parameters:
	target=candidate_parameters npm run compile

dashboard:
	target=dashboard npm run compile

publication:
	target=publication npm run compile

