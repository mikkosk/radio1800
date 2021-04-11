import axios, {AxiosResponse} from 'axios';
import { NodeState } from '../types';
import { getAuthenticationHeaders } from '../utils/helperFunctions';

const baseUrl = '/api/state';

const getState = async(): Promise<NodeState> => {
    const res: AxiosResponse<NodeState> = await axios.get(baseUrl, {headers: {Authorization: getAuthenticationHeaders().headers.Authorization}});
    return res.data;
};

const updateChars = async(number: number): Promise<NodeState> => {
    const res: AxiosResponse<NodeState> = await axios.post(baseUrl + "/updatechars", {chars: number}, {headers: {Authorization: getAuthenticationHeaders().headers.Authorization}});
    return res.data;
};

export default {
    getState, updateChars
};