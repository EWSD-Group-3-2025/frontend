import { createElement, ElementType } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import NotFound from '@/pages/notFound/NotFound';
import AuthLayout from '@/layouts/AuthLayout';
import AuthGuard from '@/features/auth/components/auth-guard';
import { USER_ROLE } from '@/constants';
import LoginPage from '@/features/auth/pages/Login';
import StudentDashboard from '@/features/users/pages/student/Dashboard';
import EndUserLayout from '@/layouts/EndUserLayout';

type ChildRoute = {
	path: string;
	element: ElementType;
	role: string[];
};

type Route = {
	name?: string;
	path: string;
	element: ElementType;
	children?: ChildRoute[];
};

const Router = () => {
	const authRouteList = [
		{
			path: '/login',
			element: LoginPage,
		},
	];

	const studentRouteList = [
		{
			path: '/dashboard/student',
			element: StudentDashboard,
			role: [USER_ROLE.STUDENT],
		},
		{
			name: 'Not Found',
			path: '*',
			element: NotFound,
		},
	];

	return (
		<Routes>
			{/* Student Routes */}
			<Route element={<EndUserLayout />}>
				{studentRouteList.map((route, i) => (
					<Route
						key={i}
						path={route.path}
						element={
							<AuthGuard>
								{createElement(route.element)}
							</AuthGuard>
						}
					></Route>
				))}
			</Route>

			{/* Auth Routes */}
			<Route element={<AuthLayout />}>
				{authRouteList.map((route, i) => (
					<Route
						key={i}
						path={route.path}
						element={createElement(route.element)}
					/>
				))}
			</Route>
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	);
};

export default Router;
