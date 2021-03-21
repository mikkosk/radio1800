export interface User {
    user_id: number,
    user_name: string,
    user_hash: string,
    user_status: Status
}

export type Status = "admin" | "user";

export interface NewUser extends Omit<User, "user_id" | "user_hash"> {
    password: string,
}

export interface NewUserFields {
    user_name: unknown,
    user_status: unknown,
    password: unknown
}

export interface LoggedInUser extends User {
    token: string
}

export interface TextForTTS {
    name: string,
    text: string,
    link: string,
    year?: number | null
}

export interface TextFields {
    name: unknown,
    text: unknown,
    link: unknown,
    year?: unknown
}

export interface Voice {
    voice_id: string,
    link: string,
    voice_length: string,
    voice_name: string,
    added: Date,
    last_play: Date,
    from_text?: string,
    to_text?: string,
    year?: number
}

export interface VoiceWithTime extends Voice {
    play_time: string
}

export interface Playlist {
    playlist_id: string,
    play_date: Date,
    voices: VoiceWithTime[]
}
export type NewVoice = Omit<Voice, "voice_id" | "added" | "last_play">;

export type NodeState = {
    id: number, 
    chars: number, 
    current_list: number
}