#!/bin/bash
set -e

echo "Start initializing identity user and database..."

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" --set "USER_PASSWORD=$IDENTITY_PASSWORD"<<-EOSQL
    CREATE USER identity WITH PASSWORD :'USER_PASSWORD';
    CREATE DATABASE identity;
    GRANT ALL PRIVILEGES ON DATABASE identity TO identity;
    ALTER DATABASE identity OWNER TO identity;
EOSQL

echo "Initialisation of identity user and database ended."
