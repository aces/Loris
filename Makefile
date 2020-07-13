.PHONY: clean dev all check checkstatic unittests test phpdev javascript testdata

all: VERSION javascript
	composer install --no-dev

# If anything changes, re-generate the VERSION file
VERSION: .
	tools/gen-version.sh

phpdev:
	composer install

javascript:
	npm install
	npm run compile

dev: VERSION phpdev javascript

clean:
	rm -f smarty/templates_c/*
	rm -f VERSION
	rm -rf vendor
	rm -rf node_modules
	rm package-lock.json

# Perform static analysis checks
checkstatic: phpdev
	npm run lint:php
	npm run lint:javascript
	vendor/bin/phan

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
