import axios from 'axios';

export const baseURL = import.meta.env.VITE_BASE_URL + '/api';

const api = axios.create({
	baseURL: import.meta.env.VITE_BASE_URL + '/api',
	headers: {
		ContentType: 'application/json',
		'Cache-Control': 'no-cache',
		'Access-Control-Allow-Origin': '*',
		Accept: 'application/json',
	},
});

api.interceptors.request.use(
	(request) => {
		request.headers['X-Request-Start-Time'] = Math.floor(Date.now() / 1000);

		return request;
	},
	(error) => {
		return Promise.reject(error);
	}
);

api.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export default api;
