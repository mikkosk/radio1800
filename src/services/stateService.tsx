import axios, {AxiosResponse} from 'axios';
import { NodeState } from '../types';
import { getAuthenticationHeaders } from '../utils/helperFunctions';

const baseUrl = 'http://localhost:3001/api/state';

const getState = async(): Promise<NodeState> => {
    const res: AxiosResponse<NodeState> = await axios.get(baseUrl, {headers: {Authorization: getAuthenticationHeaders().headers.Authorization}});
    return res.data;
};

export default {
    getState
};