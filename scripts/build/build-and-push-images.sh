export DOCKER_IMAGE_TAG=$(git log --format="%H" -n 1)
docker compose -f compose.yml build --push
export DOCKER_IMAGE_TAG=latest
docker compose -f compose.yml build --push
