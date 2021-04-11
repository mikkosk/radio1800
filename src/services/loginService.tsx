import axios, {AxiosResponse} from 'axios';
import { LoggedInUser } from '../types';

const baseUrl = '/api/login';

const login = async (username: string, password: string): Promise<LoggedInUser> => {
    const data = {username, password};
    const res: AxiosResponse<LoggedInUser> = await axios.post(baseUrl, data);
    return res.data;
};

export default {
    login
};