YARN_ARGS = $(if $(ARGS),$(ARGS),$(filter-out yarn,$(MAKECMDGOALS)))

.PHONY: yarn
yarn:
	@echo "Executing in sub-make: cd lib/website && yarn $(YARN_ARGS)"
	@cd lib/website && yarn $(YARN_ARGS)

.PHONY: setup
setup:
	@$(MAKE) yarn ARGS=install

.PHONY: dev
dev:
	@$(MAKE) yarn ARGS="dev --host"

.PHONY: build
build: import
	@$(MAKE) yarn ARGS=install
	@$(MAKE) yarn ARGS=build

.PHONY: import
import:
	@./lib/scripts/import-database.sh

# This special target catches all arguments after the target name
%:
    @: