import { QueryResult } from "pg";
import pool from "../db";
import { NodeState } from "../types";

const addState = async (chars: number, current_list: number): Promise<NodeState> => {
    const state: QueryResult<NodeState> = await pool.query(
        `INSERT INTO node_state (chars, current_list) VALUES($1, $2) RETURNING *`,
        [chars, current_list]
    );
    return state.rows[0];
};

const updateChars = async(id: NodeState['id'], chars: NodeState['chars']): Promise<NodeState> => {
    const state: QueryResult<NodeState> = await pool.query(
        `UPDATE node_state SET chars = $1
        WHERE node_state.id = $2 RETURNING *`,
        [chars, id]
    );
    return state.rows[0];
};

const updateList = async(id: NodeState['id'], list: NodeState['current_list']): Promise<NodeState> => {
    const state: QueryResult<NodeState> = await pool.query(
        `UPDATE node_state SET current_list = $1, last_updated = $2
        WHERE node_state.id = $3 RETURNING *`,
        [list, new Date().toDateString(), id]
    );
    return state.rows[0];
};

const getState = async (): Promise<NodeState> => {
    const state: QueryResult<NodeState> = await pool.query(
        `SELECT * FROM node_state
    `
    );

    return state.rows[0];
};

export default {addState, updateChars, updateList, getState};