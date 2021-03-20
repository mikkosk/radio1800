export interface User {
    user_id: number,
    user_name: string,
    user_hash: string,
    user_status: Status
}

export type Status = "admin" | "user"

export interface NewUser extends Omit<User, "user_id" | "user_hash"> {
    password: string,
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