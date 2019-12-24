import axios from '../util/axios';

export const getDir = (params) => {
	return axios.ajax('/resource/file/get?dir=' + params, 'get');
};
