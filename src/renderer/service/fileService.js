import axios from '../util/axios';

export const getDir = (params) => {
	return axios.ajax('/resource/file/get?dir=' + params, 'get');
};

export const checkExist = (params) => {
	return axios.ajax('/resource/file/checkExist/' + params, 'get');
};

export const merge = (params) => {
	return axios.ajax('/resource/file/merge/' + params, 'get');
};
