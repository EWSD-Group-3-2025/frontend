import { createElement, ElementType } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import MainLayout from '@/layouts/MainLayout';
import NotFound from '@/pages/notFound/NotFound';
import Dashboard from '@/pages/dashboard/Dashboard';
import AuthGuard from '@/components/auth-guard';

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
	const userRole = 'admin';

	const authRouteList = [
		{
			path: '/login',
			element: Login,
		},
		{
			path: '/register',
			element: Register,
		},
	];

	const routeList: Route[] = [
		{
			path: '/dashboard',
			element: MainLayout,
			children: [
				{
					path: '/dashboard',
					element: Dashboard,
					role: ['admin'],
				},
			],
		},
		{
			name: 'Not Found',
			path: '*',
			element: NotFound,
		},
	];

	return (
		<Routes>
			{routeList.map((route, i) => (
				<Route
					key={i}
					path={route.path}
					element={
						<AuthGuard>{createElement(route.element)}</AuthGuard>
					}
				>
					{route.children?.map((subRoute, j) =>
						userRole && subRoute.role.includes(userRole) ? (
							<Route
								key={j}
								path={subRoute.path}
								element={
									<AuthGuard>
										{createElement(subRoute.element)}
									</AuthGuard>
								}
							/>
						) : null
					)}
				</Route>
			))}
			{authRouteList.map((route, i) => (
				<Route
					key={i}
					path={route.path}
					element={createElement(route.element)}
				/>
			))}
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	);
};

export default Router;
