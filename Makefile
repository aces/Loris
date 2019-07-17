.PHONY: clean dev all check checkstatic unittests test phpdev javascript

all: VERSION javascript
	composer install --no-dev

# If anything changes, re-generate the VERSION file
VERSION: .
	git describe --tags --always > VERSION

phpdev:
	composer install

javascript:
	npm install
	npm run compile

dev: VERSION phpdev javascript

clean:
	rm -f smarty/templates_c/*
	rm -f VERSION
	rm -f vendor

# Perform static analysis checks
checkstatic: phpdev
	npm run lint:php
	npm run lint:javascript
	vendor/bin/phan --progress-bar

unittests: phpdev
	vendor/bin/phpunit --configuration test/phpunit.xml

# Perform all tests that don't require an install.
check: checkstatic unittests
