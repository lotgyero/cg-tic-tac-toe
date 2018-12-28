#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -c \
    "CREATE USER $APP_WRITE_USER WITH PASSWORD '$APP_WRITE_PASS';"
