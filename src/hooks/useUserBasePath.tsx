import { useLocation } from 'react-router-dom';

export const useUserBasePath = () => {
	const location = useLocation();
	const segments = location.pathname.split('/').slice(0, 3); // Extract "/dashboard/admin" or "/dashboard/staff"
	return segments.join('/');
};
