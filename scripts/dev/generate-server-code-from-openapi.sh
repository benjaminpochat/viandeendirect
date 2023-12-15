#!/bin/bash

GENERATE_MODEL=false

while [[ $# -gt 0 ]]; do
  case $1 in
    -m|--model)
      GENERATE_MODEL=true
      shift
      ;;
    -*|--*)
      echo "Unknown option $1"
      exit 1
      ;;
  esac
done

if $GENERATE_MODEL; then
    echo "Model generation activated.
Model classes will be generated in backend/gen source folder.
/!\ Take care about not having them both in backend/gen and in backend/app source folders."
else
    echo "The model generation is not activated (use '-m' option to generate model)."
fi

mvn clean install -f ./backend/model/pom.xml
if $GENERATE_MODEL; then
  mvn clean install -P generator -f ./backend/gen/pom.xml
else
  mvn clean install -P generator,exclude-model-source-generated -f ./backend/gen/pom.xml
fi