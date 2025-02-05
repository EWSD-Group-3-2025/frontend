import CONSTANTS from '@/constants';
import axios from 'axios';
import Cookie from 'js-cookie';

export const baseURL = import.meta.env.VITE_BASE_URL + '/api';

const api = axios.create({
	baseURL: import.meta.env.VITE_BASE_URL + '/api',
	headers: {
		ContentType: 'application/json',
		'Cache-Control': 'no-cache',
		'Access-Control-Allow-Origin': '*',
		Accept: 'application/json',
	},
	withCredentials: true,
});

let refreshPromise: Promise<string> | null = null;

api.interceptors.request.use(
	(request) => {
		// Get access token and add to Authorization header
		const accessToken = Cookie.get(CONSTANTS.ACCESS_TOKEN_KEY);
		if (accessToken) {
			request.headers.Authorization = `Bearer ${accessToken}`;
		}

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
	async (error) => {
		return Promise.reject(error);
		//! TODO: Uncomment when backend refresh token api finish
		// const originalRequest = error.config as InternalAxiosRequestConfig;

		// if (originalRequest.url !== '/api/auth/refresh') {
		// 	return Promise.reject(error);
		// }

		// try {
		// 	if (!refreshPromise) {
		// 		const refreshToken = Cookie.get(CONSTANTS.REFRESH_TOKEN_KEY);

		// 		refreshPromise = api
		// 			.post('/api/auth/refresh', { refreshToken })
		// 			.then((res) => res.data.accessToken)
		// 			.finally(() => {
		// 				refreshPromise = null;
		// 			});
		// 	}

		// 	const newAccessToken = await refreshPromise;

		// 	Cookie.set(CONSTANTS.ACCESS_TOKEN_KEY, newAccessToken, {
		// 		expires: CONSTANTS.ACCESS_TOKEN_EXPIRE,
		// 	});
		// 	originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

		// 	return api(originalRequest);
		// } catch (refreshTokenError) {
		// 	// Clear the cookie
		// 	Cookie.remove(CONSTANTS.ACCESS_TOKEN_KEY);
		// 	Cookie.remove(CONSTANTS.REFRESH_TOKEN_KEY);

		// 	window.location.href = '/login';
		// 	return Promise.reject(refreshTokenError);
		// }
	}
);

export default api;
