all:
	composer install --no-dev
	npm run compile
	git describe --tags --always > VERSION

dev:
	composer install
	npm run compile
	git describe --tags --always > VERSION
