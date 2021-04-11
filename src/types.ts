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

export type LoginCredentials = Omit<NewUser, "user_status">;

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

export type Metadata = Omit<Voice, "link" | "voice_name" | "added" | "last_play">;


export interface IcecastMetadata {
    icestats: {
        source: {
            title: string
        }
    }
}

export interface Playlist {
    playlist_id: string,
    play_date: string,
    voices: VoiceWithTime[]
}
export type NewVoice = Omit<Voice, "voice_id" | "added" | "last_play">;

export type NodeState = {
    id: number, 
    chars: number, 
    current_list: number,
    last_updated: string
};

export type TTSRequest = {
    input: {
        text: string,
    },
    voice: {
        languageCode: string,
        ssmlGender: "FEMALE" | "SSML_VOICE_GENDER_UNSPECIFIED" | "MALE" | "NEUTRAL" | null | undefined
    },
    audioConfig: {
        audioEncoding: "MP3" | "AUDIO_ENCODING_UNSPECIFIED" | "LINEAR16" | "OGG_OPUS" | null | undefined
    }
};

export interface YYYYMMDD {
    year: string,
    month: string,
    date: string
}
