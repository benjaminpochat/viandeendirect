#!/bin/bash
set -e

echo "Start initializing viandeendirect user and database..."

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" --set "USER_PASSWORD=$VIANDEENDIRECT_PASSWORD"<<-EOSQL
    CREATE USER viandeendirect WITH PASSWORD :'USER_PASSWORD';
    CREATE DATABASE viandeendirect;
    GRANT ALL PRIVILEGES ON DATABASE viandeendirect TO viandeendirect;
    ALTER DATABASE viandeendirect OWNER TO viandeendirect;
EOSQL

echo "Initialisation of viandeendirect user and database ended."
