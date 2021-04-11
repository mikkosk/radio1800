import axios, {AxiosResponse} from 'axios';
import { IcecastMetadata } from '../types';

const baseUrl = 'http://localhost:8000/status-json.xsl';

const getMetadata = async(): Promise<IcecastMetadata> => {
    const res: AxiosResponse<IcecastMetadata> = await axios.get(baseUrl);
    return res.data;
};

export default {
    getMetadata
};