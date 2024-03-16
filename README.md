[![Java CI with Maven](https://github.com/benjaminpochat/viandeendirect/actions/workflows/maven.yml/badge.svg)](https://github.com/benjaminpochat/viandeendirect/actions/workflows/maven.yml) [![Node.js CI](https://github.com/benjaminpochat/viandeendirect/actions/workflows/node.js.yml/badge.svg)](https://github.com/benjaminpochat/viandeendirect/actions/workflows/node.js.yml)

# viandeendirect

## Notes for developpers

### Code generation with openapi generator

The project use openapi to generate server (java) and client (javascript) from the file openapi/openapi.yml. 

The following helps developer to generate each side :
* scripts `scripts/dev/generate-server-code-from-openapi.sh`
* scripts `scripts/dev/generate-client-code-from-openapi.sh`

Because of this issue in openapi generator for spring (https://github.com/OpenAPITools/openapi-generator/pull/5312), annotations must be coded manually in the model, and the model generation has been disabled in server code generation (in order to not erase JPA annotations at code generation).

If an evolution has to be done in the model :
1. implement the modification in openapi/openapi.yml file
2. generate the model with openapi generator, using the following commment (from the root project's folder) :
  `scripts/dev/generate-server-code-from-openapi.sh -m`. The updated model's java classes are generated in backend/gen module.
3. copy manually the lines added by code generation from backend/gen to backend/app (the diff folder tool provided by IntelliJ is useful for it)
4. delete the model classes generated in backend/gen module 

### Keycloak configuration

The keycloak configuration is documented in this document :
https://docs.google.com/document/d/10RATGY5DjXroRkQ9yDcFCReHQQyWinfYjYPLXSXGhco/edit?usp=sharing
