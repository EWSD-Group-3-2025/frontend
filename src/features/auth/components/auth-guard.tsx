import { Navigate, useLocation } from 'react-router-dom';

import { Loader } from 'lucide-react';

import { isNewUser } from '@/utils';
import { useAuth } from '@/context/auth.context';

interface AuthGuardProps {
	children: React.ReactNode;
}

/**
 * Protect route from unauthorized user
 */
export default function AuthGuard({ children }: AuthGuardProps) {
	const location = useLocation();
	const { user, loading } = useAuth();

	if (loading) {
		return (
			<div className="flex min-h-screen w-screen items-center justify-center">
				<Loader className="size-10 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (isNewUser() && location.pathname !== '/change-password') {
		return <Navigate to={'/change-password'} replace />;
	}

	if (!user) {
		return <Navigate to={'/login'} state={{ from: location }} replace />;
	}

	if (user) {
		if (
			location.pathname === '/login' ||
			location.pathname === '/register'
		) {
			return (
				<Navigate
					to={'/dashboard'}
					state={{ from: location }}
					replace
				/>
			);
		} else {
			return <>{children}</>;
		}
	}
}
