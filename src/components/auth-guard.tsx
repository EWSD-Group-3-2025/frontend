import { useAuth } from '@/context/auth.context';
import { Loader } from 'lucide-react';
import { Navigate, useLocation } from 'react-router';

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
			// Protected routes, implement role-based authentication here
			return <>{children}</>;
		}
	}
}
