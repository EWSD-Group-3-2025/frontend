import { createElement, ElementType } from 'react';
import { Route, Routes } from 'react-router-dom';
import { USER_ROLE } from '@/constants';
import NotFound from '@/pages/notFound/NotFound';
import LoginPage from '@/features/auth/pages/Login';
import EndUserLayout from '@/layouts/EndUserLayout';
import ManagementLayout from '@/layouts/ManagementLayout';
import StandaloneLayout from '@/layouts/StandaloneLayout';
import VerifyOTPPage from '@/features/auth/pages/VerifyOTP';
import AuthGuard from '@/features/auth/components/auth-guard';
import ResetPasswordPage from '@/features/auth/pages/ResetPassword';
import AdminDashboard from '@/features/users/pages/admin/Dashboard';
import ChangePasswordPage from '@/features/auth/pages/ChangePassword';
import ForgotPasswordPage from '@/features/auth/pages/ForgotPassword';
import StudentDashboard from '@/features/users/pages/student/Dashboard';
import OtherUserDashboard from '@/features/users/pages/admin/OtherUserDashboard';
import ResetPasswordSuccessPage from '@/features/auth/pages/ResetPasswordSuccess';
import StaffDashboard from '@/features/users/pages/staff/Dashboard';
import StaffList from '@/features/users/pages/management/StaffList';
import StudentList from '@/features/users/pages/management/StudentList';
import TutorList from '@/features/users/pages/management/TutorList';
import AdminList from '@/features/users/pages/management/AdminList';
import DepartmentList from '@/features/departments/pages/DepartmentList';
import CourseList from '@/features/courses/pages/CourseList';
import SpecializationList from '@/features/specialization/pages/SpecializationList';
import HomePage from '@/pages/HomePage';
import RouteGuard from '@/features/auth/components/role-guard';

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

	// endUserRoutes is for students and tutors
	const endUserRouteList = [
		{
			path: '/dashboard/end-user',
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

	const adminRouteList = [
		{
			path: '/dashboard/admin',
			element: AdminDashboard,
			role: [USER_ROLE.ADMIN],
		},
		{
			path: '/dashboard/admin/departments',
			element: DepartmentList,
			role: [USER_ROLE.ADMIN],
		},
		{
			path: '/dashboard/admin/courses',
			element: CourseList,
			role: [USER_ROLE.ADMIN],
		},
		{
			path: '/dashboard/admin/specializations',
			element: SpecializationList,
			role: [USER_ROLE.ADMIN],
		},
		{
			path: '/dashboard/student/:username',
			element: OtherUserDashboard,
			role: [USER_ROLE.ADMIN],
		},
		{
			path: '/dashboard/tutor/:username',
			element: OtherUserDashboard,
			role: [USER_ROLE.ADMIN],
		},
		{
			path: '/dashboard/staff/:username',
			element: OtherUserDashboard,
			role: [USER_ROLE.ADMIN],
		},
		{
			path: '/dashboard/admin/staffs',
			element: StaffList,
			role: [USER_ROLE.ADMIN],
		},
		{
			path: '/dashboard/admin/students',
			element: StudentList,
			role: [USER_ROLE.ADMIN],
		},
		{
			path: '/dashboard/admin/tutors',
			element: TutorList,
			role: [USER_ROLE.ADMIN],
		},
		{
			path: '/dashboard/admin/admins',
			element: AdminList,
			role: [USER_ROLE.ADMIN],
		},
		{
			path: '/dashboard/admin/analysis',
			element: SpecializationList,
			role: [USER_ROLE.ADMIN],
		},
		{
			path: '/dashboard/admin/reports',
			element: SpecializationList,
			role: [USER_ROLE.ADMIN],
		},
		{
			name: 'Not Found',
			path: '*',
			element: NotFound,
		},
	];

	const staffRouteList = [
		{
			path: '/dashboard/staff',
			element: StaffDashboard,
			role: [USER_ROLE.STAFF],
		},
		{
			path: '/dashboard/staff/departments',
			element: DepartmentList,
			role: [USER_ROLE.STAFF],
		},
		{
			path: '/dashboard/staff/courses',
			element: CourseList,
			role: [USER_ROLE.STAFF],
		},
		{
			path: '/dashboard/staff/specializations',
			element: SpecializationList,
			role: [USER_ROLE.STAFF],
		},
		{
			path: '/dashboard/staff/analysis',
			element: SpecializationList,
			role: [USER_ROLE.STAFF],
		},
		{
			path: '/dashboard/staff/reports',
			element: SpecializationList,
			role: [USER_ROLE.STAFF],
		},
		{
			path: '/dashboard/staff/staffs',
			element: StaffList,
			role: [USER_ROLE.STAFF],
		},
		{
			path: '/dashboard/staff/students',
			element: StudentList,
			role: [USER_ROLE.STAFF],
		},
		{
			path: '/dashboard/staff/tutors',
			element: TutorList,
			role: [USER_ROLE.STAFF],
		},
		{
			path: '/dashboard/staff/admins',
			element: AdminList,
			role: [USER_ROLE.STAFF],
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
				{endUserRouteList.map((route, i) => (
					<Route
						key={i}
						path={route.path}
						element={
							<AuthGuard>
								<RouteGuard>
									{createElement(route.element)}
								</RouteGuard>
							</AuthGuard>
						}
					></Route>
				))}
			</Route>

			{/* Admin Routes */}
			<Route element={<ManagementLayout />}>
				{adminRouteList.map((route, i) => (
					<Route
						key={i}
						path={route.path}
						element={
							<AuthGuard>
								<RouteGuard>
									{createElement(route.element)}
								</RouteGuard>
							</AuthGuard>
						}
					></Route>
				))}
			</Route>

			{/* Staff Routes */}
			<Route element={<ManagementLayout />}>
				{staffRouteList.map((route, i) => (
					<Route
						key={i}
						path={route.path}
						element={
							<AuthGuard>
								<RouteGuard>
									{createElement(route.element)}
								</RouteGuard>
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

			{/* When user hit to Home and Dashboard routes, it will redirect automatically redirect to their specific route based on their role */}
			<Route
				path="/"
				element={
					<AuthGuard>
						<RouteGuard>{createElement(HomePage)}</RouteGuard>
					</AuthGuard>
				}
			/>
			<Route
				path="/dashboard"
				element={
					<AuthGuard>
						<RouteGuard>{createElement(HomePage)}</RouteGuard>
					</AuthGuard>
				}
			/>
		</Routes>
	);
};

export default Router;
