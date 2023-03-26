FROM postgres:15.2-alpine

ENV VIANDEENDIRECT_PASSWORD=${VIANDEENDIRECT_PASSWORD}

ENV IDENTITY_PASSWORD=${IDENTITY_PASSWORD}

COPY ./database/init-user-viandeendirect.sh /docker-entrypoint-initdb.d/init-user-viandeendirect.sh

COPY ./database/init-user-identity.sh /docker-entrypoint-initdb.d/init-user-identity.sh
