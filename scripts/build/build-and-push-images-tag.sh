#!/bin/bash

if [ -z "$1" ]
  then
    echo "Error : no tag is provided"
    exit
fi 

git checkout $1
export DOCKER_IMAGE_TAG=$1
docker compose -f compose.yml build --push
git checkout master