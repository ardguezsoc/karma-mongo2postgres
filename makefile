

ensure-dependencies:
	@echo "Ensuring docker is installed..."
	@docker info

brand:
	@echo "Creating our karma-mongo2postgres manifest file..."
	@node_modules/make-manifest/bin/make-manifest
	@cat ./manifest.json

package:
	@echo "Building our karma-mongo2postgres docker image..."
	@docker build --tag karma-mongo2postgres .
	@docker images

qa:
	@echo "Checking that our karma-mongo2postgres tests dont fail..."
	@npm run qa