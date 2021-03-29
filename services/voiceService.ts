import { QueryResult } from "pg";
import { NewVoice, Voice} from "../types";
import pool from "../db";

/*
    voice_id serial NOT NULL PRIMARY KEY,
    link varchar(255) NOT NULL,
    voice_length TIME NOT NULL,
    voice_name varchar(255) NOT NULL,
    added date NOT NULL,
    last_play date NOT NULL,
    from_text varchar(255),
    to_text varchar(255),
    year integer
*/

const addVoice = async (newVoice: NewVoice): Promise<Voice> => {
    const {link, voice_length, voice_name, from_text, to_text, year} = newVoice;
    const added = new Date().toDateString();
    const last_play = new Date(1800, 0, 1).toDateString();
    const voice: QueryResult<Voice> = await pool.query(
        `INSERT INTO voice (link, voice_length, voice_name, added, last_play, from_text, to_text, year)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [link, voice_length, voice_name, added, last_play, from_text, to_text, year]
    );
    return voice.rows[0];
};

const updateLastPlay = async(id: Voice['voice_id']): Promise<Voice> => {
    const added = new Date().toDateString();
    const voice: QueryResult<Voice> = await pool.query(
        `UPDATE voice SET voice.last_play = $1
        WHERE voice.voice_id = $2 RETURNING *`,
        [added, id]
    );
    return voice.rows[0];
};

const getVoice = async (id: Voice['voice_id']): Promise<Voice> => {
    const voices: QueryResult<Voice> = await pool.query(
        `SELECT * FROM voice WHERE voice.voice_id = $1
    `, [id]
    );

    return voices.rows[0];
};

const getRandomVoice = async (): Promise<Voice> => {
    const voices: QueryResult<Voice> = await pool.query(
        `SELECT * FROM voice ORDER BY RANDOM() LIMIT 1
    `
    );

    return voices.rows[0];
};

const getVoices = async (): Promise<Voice[]> => {
    const voices: QueryResult<Voice> = await pool.query(
        `SELECT * FROM voice
    `
    );

    return voices.rows;
};

const deleteVoice = async(id: Voice["voice_id"]) => {
    await pool.query(
        "DELETE FROM voice WHERE voice_id = $1", [id]
    );
};

export default {addVoice, getVoices, getVoice, updateLastPlay, deleteVoice, getRandomVoice};


