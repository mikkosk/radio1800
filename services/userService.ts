import { QueryResult } from "pg";
import { NewUser, User} from "../types";
import bcrypt from "bcrypt";
import pool from "../db";

const addUser = async (entry: NewUser): Promise<User> => {
    const {user_name, password, user_status} = entry;
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    const newUser: QueryResult<User> = await pool.query(
        "INSERT INTO radio_user (user_name, user_hash, user_status) VALUES($1, $2, $3) RETURNING *",
        [user_name, passwordHash, user_status]
    );

    return newUser.rows[0];
};

const getUser = async (userId: User['user_id']): Promise<User> => {
    const user: QueryResult<User> = await pool.query(
        `SELECT * FROM radio_user
        WHERE radio_user.user_id = $1
    `, [userId]
    );

    return user.rows[0];
};

const getLoginUser = async (username: User['user_name']): Promise<User> => {
    const user: QueryResult<User> = await pool.query(
        `SELECT * FROM radio_user
        WHERE radio_user.user_name = $1
    `, [username]
    );

    return user.rows[0];
};

const deleteUser = async(id: User["user_id"]) => {
    await pool.query(
        "DELETE FROM radio_user WHERE userid = $1", [id]
    );
};

export default {addUser, getUser, getLoginUser, deleteUser};