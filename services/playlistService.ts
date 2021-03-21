import { QueryResult } from "pg";
import { Playlist, Voice} from "../types";
import pool from "../db";

/*
    playlist_id serial NOT NULL PRIMARY KEY,
    play_date date NOT NULL
);

*/

const addPlaylist = async (): Promise<Playlist> => {
    const added = new Date().toDateString();
    const playlist: QueryResult<Playlist> = await pool.query(
        `INSERT INTO playlist (play_date) VALUES ($1) RETURNING *`, [added]
    );
    return playlist.rows[0];
};

const addVoiceToPlaylist = async (voice_id: Voice['voice_id'], playlist_id: Playlist['playlist_id'], time: string) => {
    await pool.query(
        `INSERT INTO playlist_to_voice (voice_id, playlist_id, play_time) VALUES ($1, $2, $3) RETURNING *`, [voice_id, playlist_id, time]
    );
};

const getPlaylistById = async (id: Playlist['playlist_id']): Promise<Playlist> => {
    const playlist: QueryResult<Playlist> = await pool.query(
        `SELECT playlist.*, JSON_AGG(json_build_object(
            'voice_name', voice.voice_name,
            'play_time', playlist_to_voice.play_time
        )) as voices FROM playlist
        LEFT JOIN playlist_to_voice ON playlist.playlist_id = playlist_to_voice.playlist_id
        LEFT JOIN voice ON voice.voice_id = playlist_to_voice.voice_id
        WHERE playlist.playlist_id = $1 
        GROUP BY playlist.playlist_id
    `, [id]
    );

    return playlist.rows[0];
};

const getPlaylistByDay = async (date: Date): Promise<Playlist> => {
    const playlist: QueryResult<Playlist> = await pool.query(
        `SELECT playlist.*, JSON_AGG(json_build_object(
            'voice_name', voice.voice_name,
            'play_time', playlist_to_voice.play_time
        )) as voices FROM playlist
        LEFT JOIN playlist_to_voice ON playlist.playlist_id = playlist_to_voice.playlist_id
        LEFT JOIN voice ON voice.voice_id = playlist_to_voice.voice_id
        WHERE playlist.play_date = $1 
        GROUP BY playlist.playlist_id
    `, [date]
    );

    return playlist.rows[0];
};

export default {addPlaylist, addVoiceToPlaylist, getPlaylistByDay, getPlaylistById};