CREATE TABLE radio_user
(
    user_id serial NOT NULL PRIMARY KEY,
    user_hash varchar(255) NOT NULL,
    user_name varchar(50) NOT NULL,
    user_status varchar(50) NOT NULL
);

CREATE TABLE feedback
(
    feedback_id serial NOT NULL PRIMARY KEY,
    message_text varchar(1000),
    leave_date date
);

CREATE TABLE voice
(
    voice_id serial NOT NULL PRIMARY KEY,
    link varchar(255) NOT NULL,
    voice_length TIME NOT NULL,
    voice_name varchar(255) NOT NULL,
    added date NOT NULL,
    last_play date NOT NULL,
    from_text varchar(255),
    to_text varchar(255),
    year integer
);

CREATE TABLE playlist
(
    playlist_id serial NOT NULL PRIMARY KEY,
    play_date date NOT NULL
);

CREATE TABLE playlist_to_voice
(
    id serial NOT NULL PRIMARY KEY,
    voice_id integer,
    playlist_id integer,
    play_time time

);

CREATE TABLE node_state
(
    id serial NOT NULL PRIMARY KEY,
    chars integer,
    current_list integer,
    last_updated DATE
);



ALTER TABLE playlist_to_voice ADD FOREIGN KEY (voice_id) REFERENCES voice(voice_id);
ALTER TABLE playlist_to_voice ADD FOREIGN KEY (playlist_id) REFERENCES playlist(playlist_id) ON DELETE CASCADE;