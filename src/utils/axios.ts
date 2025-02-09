import CONSTANTS from '@/constants';
import authRoutes from '@/features/auth/api/routes';
import axios, { InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

export const baseURL = import.meta.env.VITE_BASE_URL + '/api';

const api = axios.create({
	baseURL: baseURL,
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
		const accessToken = Cookies.get(CONSTANTS.ACCESS_TOKEN_KEY);
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
	(response) => response,
	async (error) => {
		const originalRequest = error.config as InternalAxiosRequestConfig;

		// If the error is not 400 and request auth user, that mean cause error by other api and directly reject error

		if (originalRequest.url !== '/v1/auth/me') {
			return Promise.reject(error);
		}
		try {
			if (!refreshPromise) {
				const refreshToken = Cookies.get(CONSTANTS.REFRESH_TOKEN_KEY);

				refreshPromise = api
					.post(authRoutes.refreshToken, { refreshToken })
					.then((res) => res.data.data.accessToken)
					.finally(() => {
						refreshPromise = null;
					});
			}

			const newAccessToken = await refreshPromise;

			Cookies.set(CONSTANTS.ACCESS_TOKEN_KEY, newAccessToken, {
				expires: CONSTANTS.ACCESS_TOKEN_EXPIRE,
			});
			originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

			return api(originalRequest);
		} catch (refreshTokenError) {
			// Clear the cookie
			Cookies.remove(CONSTANTS.ACCESS_TOKEN_KEY);
			Cookies.remove(CONSTANTS.REFRESH_TOKEN_KEY);

			window.location.href = '/login';
			return Promise.reject(refreshTokenError);
		}
	}
);

export default api;
