
create table users
(
	id serial primary key,
	login varchar(100),
	pass varchar(100)
);

CREATE TABLE game
(
    id SERIAL PRIMARY KEY,
    datestart timestamp default now(),
    players varchar(1000) NULL
);

create table player
(
	id serial primary key,
	player_num int,
	userid int references users(id),
	gameid int references game(id),
	gamerole varchar(2) null,
	ipaddress varchar(20)
);

create table turn
(
	id serial primary key,
	dtime timestamp default now(),
	gameid int references game(id),
	playerid int references player(id),
	player_num int,
	square int
);

create table team_turn
(
	id serial primary key,
	dtime timestamp default now(),
	gameid int,
	winner boolean,
	small jsonb,
	big jsonb,
	changes jsonb,
	collision jsonb,
	deps jsonb
);


GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO u1;
grant select, insert on game, player, turn, team_turn to u1;
