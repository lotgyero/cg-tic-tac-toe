create database tictac;

CREATE TYPE role_type AS ENUM ('X1','X2','X3', '01','02','03');

create table users
(
	id serial primary key,
	login varchar(50),
	secret varchar(50),
	email varchar(255)
);

create table game
(
    id SERIAL PRIMARY KEY,
    datestart timestamp default now(),
    players varchar(1000) NULL
);

create table player
(
	id serial primary key,
	playernum smallint,
	userid int references users(id),
	gameid int references game(id),
	gamerole role_type,
	ipaddress inet
);

create table turn
(
	id bigserial primary key,
	dtime timestamp default now(),
	gameid int references game(id),
	playerid int references player(id),
	playernum smallint,
	square int
);

create table team_turn
(
	id bigserial primary key,
	dtime timestamp default now(),
	gameid int,
	winner boolean,
	small jsonb,
	big jsonb,
	changes jsonb,
	collision jsonb,
	deps jsonb
);


--grant all privileges on database tictac to u1;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO u1;
grant select, insert, update on game, player, turn, team_turn to u1;
