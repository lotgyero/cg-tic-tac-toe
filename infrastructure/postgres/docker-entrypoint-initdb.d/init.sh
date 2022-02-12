#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$APP_DATABASE" <<-EOSQL

CREATE TYPE gamerole_enum AS ENUM ('X1','X2','X3', '01','02','03');
CREATE TYPE user_role_enum AS ENUM ('user', 'admin');
CREATE TYPE winner_enum AS ENUM ('X', '0', 'false');

create table users
(
	id serial primary key,
	login varchar(50),
	secret varchar(50),
	email varchar(255),
    role user_role_enum DEFAULT 'user'
);

create table games
(
    id BIGSERIAL PRIMARY KEY,
    start_ts timestamp default now(),
    stop_ts timestamp,
    players varchar(1000) NULL
);

create table players
(
	id bigserial primary key,
	playernum smallint,
	userid int references users(id),
	gameid int references games(id),
	gamerole gamerole_enum,
	ipaddress inet
);

create table turns
(
	id bigserial primary key,
	ts timestamp default now(),
	gameid int, --references games(id),
	playerid int, --references players(id),
	playernum smallint,
	square int
);

create table team_turns
(
	id bigserial primary key,
	ts timestamp default now(),
	gameid int,
	winner winner_enum,
	small jsonb,
	big jsonb,
	changes jsonb,
	collision jsonb,
	deps jsonb
);


--grant all privileges on database tictac to overseer;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO overseer;
grant select, insert, update on games, players, turns, team_turns to overseer;

EOSQL
