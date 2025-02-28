import { useAuth } from '@/context/auth.context';
import {
	getAuthPathname,
	getRedirectRoute,
	isAuthDashboardPath,
} from '@/utils/auth';
import { Navigate, useLocation } from 'react-router-dom';

interface RouteGuardProps {
	children: React.ReactNode;
}

export default function RouteGuard({ children }: RouteGuardProps) {
	const location = useLocation();
	const { user } = useAuth();
	if (!user) {
		return <Navigate to={'/login'} state={{ from: location }} replace />;
	}

	const authPathname = getAuthPathname(user?.roleName);

	if (
		location.pathname === '/' ||
		location.pathname === '/dashboard' ||
		!isAuthDashboardPath({ pathname: location.pathname, authPathname })
	) {
		const redirectRoute = getRedirectRoute(user?.roleName);
		return <Navigate to={redirectRoute} replace />;
	}

	return <>{children}</>;
}
