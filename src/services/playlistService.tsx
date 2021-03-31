import axios, {AxiosResponse} from 'axios';
import { Playlist } from '../../types';
import { YYYYMMDD } from '../types';

const baseUrl = 'http://localhost:3001/api/playlist';

const getPlaylist = async(fullDate: YYYYMMDD): Promise<Playlist> => {
    const {year, month, date} = fullDate;
    console.log(fullDate);
    console.log(year, month, date);
    const res: AxiosResponse<Playlist> = await axios.get(`${baseUrl}/${year}/${month}/${date}`);
    return res.data;
};

export default {
    getPlaylist
};