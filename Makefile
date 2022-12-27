.PHONY: clean dev all check checkstatic unittests test phpdev javascript testdata

all: VERSION jsdev
	composer install --no-dev

# If anything changes, re-generate the VERSION file
VERSION: .
	tools/gen-version.sh

phpdev:
	composer install

jsdev:
	npm ci
	npm run compile

jslatest: clean
	rm -rf package-lock.json
	rm -rf modules/electrophysiology_browser/jsx/react-series-data-viewer/package-lock.json
	npm install
	npm run compile

dev: VERSION phpdev jsdev

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
	npm run lint:javascript

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

login:
	target=login npm run compile

