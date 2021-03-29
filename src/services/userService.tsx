import axios, { AxiosResponse } from 'axios';
import { NewUser, User } from "../types";

const baseUrl = 'http://localhost:3001/api/user';
const addUser = async (newUser: NewUser, password: string): Promise<User> => {
    const res: AxiosResponse<User> = await axios.post(baseUrl, {user: newUser, password});
    return res.data;
};

export default {addUser};