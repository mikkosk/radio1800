import axios, {AxiosResponse} from 'axios';
import { Playlist } from '../../types';

const baseUrl = 'http://localhost:3001/api/playlist';

const getState = async(fullDate: Date): Promise<Playlist> => {
    const [year, month, date] = fullDate.toDateString().split("-");
    const res: AxiosResponse<Playlist> = await axios.get(`${baseUrl}/date/${year}/${month}/${date}`);
    return res.data;
};

export default {
    getState
};