[![Java CI with Maven](https://github.com/benjaminpochat/viandeendirect/actions/workflows/maven.yml/badge.svg)](https://github.com/benjaminpochat/viandeendirect/actions/workflows/maven.yml) [![Node.js CI](https://github.com/benjaminpochat/viandeendirect/actions/workflows/node.js.yml/badge.svg)](https://github.com/benjaminpochat/viandeendirect/actions/workflows/node.js.yml)

# viandeendirect

## Notes for developping

### Code generation with openapi generator

The project use openapi to generate server (java) and client (javascript) from the file openapi/openapi.yml. 

The following helps developer to generate each side :
* scripts scripts/dev/generate-server-code-from-openapi.sh
* scripts scripts/dev/generate-client-code-from-openapi.sh

Because of this issue in openapi generator for spring (https://github.com/OpenAPITools/openapi-generator/pull/5312), the model generation has been disabled in server code generation (in order to not erase JPA annotations at code generation).

If an evolution has to be done in the model, it has to be done :
* in openapi/openapi.yml file
* and manually in maven java module backend/model
To enable model generation, comment the following line in backend/gen/.openapi-generator-ignore :

```
#src/main/java/eu/viandeendirect/model/*
```

The generated model code can then be copied to module backend/model.
