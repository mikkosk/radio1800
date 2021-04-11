import axios, {AxiosResponse} from 'axios';
import { Playlist } from '../../types';
import { YYYYMMDD } from '../types';

const baseUrl = '/api/playlist';

const getPlaylist = async(fullDate: YYYYMMDD): Promise<Playlist> => {
    const {year, month, date} = fullDate;
    const res: AxiosResponse<Playlist> = await axios.get(`${baseUrl}/${year}/${month}/${date}`);
    return res.data;
};

export default {
    getPlaylist
};