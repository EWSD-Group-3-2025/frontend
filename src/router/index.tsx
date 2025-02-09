import { createElement, ElementType } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import NotFound from '@/pages/notFound/NotFound';
import AuthGuard from '@/features/auth/components/auth-guard';
import { USER_ROLE } from '@/constants';
import LoginPage from '@/features/auth/pages/Login';
import StudentDashboard from '@/features/users/pages/student/Dashboard';
import EndUserLayout from '@/layouts/EndUserLayout';
import StandaloneLayout from '@/layouts/StandaloneLayout';
import ForgotPasswordPage from '@/features/auth/pages/ForgotPassword';
import VerifyOTPPage from '@/features/auth/pages/VerifyOTP';
import ResetPasswordPage from '@/features/auth/pages/ResetPassword';
import ResetPasswordSuccessPage from '@/features/auth/pages/ResetPasswordSuccess';
import ChangePasswordPage from '@/features/auth/pages/ChangePassword';

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

	const forgetPasswordRouteList = [
		{
			path: '/forgot-password',
			element: ForgotPasswordPage,
			role: [USER_ROLE.STUDENT],
		},
		{
			path: '/verify-otp',
			element: VerifyOTPPage,
			role: [USER_ROLE.STUDENT],
		},
		{
			path: '/reset-password',
			element: ResetPasswordPage,
			role: [USER_ROLE.STUDENT],
		},
		{
			path: '/reset-password-successful',
			element: ResetPasswordSuccessPage,
			role: [USER_ROLE.STUDENT],
		},
		{
			path: '/change-password',
			element: ChangePasswordPage,
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
			{/* Forget Password Routes */}
			<Route element={<StandaloneLayout />}>
				{forgetPasswordRouteList.map((route, i) => (
					<Route
						key={i}
						path={route.path}
						element={createElement(route.element)}
					></Route>
				))}
			</Route>

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
			<Route element={<StandaloneLayout />}>
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
