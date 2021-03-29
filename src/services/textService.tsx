import axios, {AxiosResponse} from 'axios';
import { TextForTTS } from '../types';
import { getAuthenticationHeaders } from '../utils/helperFunctions';

const baseUrl = 'http://localhost:3001/api/text';

const addText = async (data: TextForTTS): Promise<TextForTTS> => {
    const res: AxiosResponse<TextForTTS> = await axios.post(baseUrl, data, {headers: {Authorization: getAuthenticationHeaders().headers.Authorization}});
    return res.data;
};

export default { addText };
