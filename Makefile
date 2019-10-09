.PHONY: clean dev all check checkstatic unittests test phpdev javascript devdependencies

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

dev: VERSION devdependencies phpdev javascript 

devdependencies:
	./tools/install_dev_dependencies.sh


clean:
	rm -f smarty/templates_c/*
	rm -f VERSION
	rm -rf vendor

# Perform static analysis checks
checkstatic: phpdev
	npm run lint:php
	npm run lint:javascript
	vendor/bin/phan

unittests: phpdev
	vendor/bin/phpunit --configuration test/phpunit.xml

# Perform all tests that don't require an install.
check: checkstatic unittests
