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
import EndUserDashboard from '@/features/users/pages/end-user/end-user-dashboard';
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
import { useAuth } from '@/context/auth.context';
import ActivityLogs from '@/features/activity-logs/page/ActivityLogs';
import MessagesPage from '@/features/users/pages/end-user/messages-page';
import BlogPage from '@/features/users/pages/end-user/blog-page';
import DocumentsPage from '@/features/users/pages/end-user/documents-page';
import CalendarPage from '@/features/users/pages/end-user/calendar-page';
import MeetingsPage from '@/features/users/pages/end-user/meetings-page';

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
	const { user } = useAuth();
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
			element: EndUserDashboard,
			role: [USER_ROLE.STUDENT, USER_ROLE.TUTOR],
		},
		{
			path: '/dashboard/end-user/messages',
			element: MessagesPage,
			role: [USER_ROLE.STUDENT, USER_ROLE.TUTOR],
		},
		{
			path: '/dashboard/end-user/meetings',
			element: MeetingsPage,
			role: [USER_ROLE.STUDENT, USER_ROLE.TUTOR],
		},
		{
			path: '/dashboard/end-user/calendar',
			element: CalendarPage,
			role: [USER_ROLE.STUDENT, USER_ROLE.TUTOR],
		},
		{
			path: '/dashboard/end-user/documents',
			element: DocumentsPage,
			role: [USER_ROLE.STUDENT, USER_ROLE.TUTOR],
		},
		{
			path: '/dashboard/end-user/blog',
			element: BlogPage,
			role: [USER_ROLE.STUDENT, USER_ROLE.TUTOR],
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
			path: '/dashboard/management',
			element:
				user?.roleName === USER_ROLE.ADMIN
					? AdminDashboard
					: StaffDashboard,
			role: [USER_ROLE.ADMIN],
		},
		{
			path: '/dashboard/management/departments',
			element: DepartmentList,
			role: [USER_ROLE.ADMIN],
		},
		{
			path: '/dashboard/management/courses',
			element: CourseList,
			role: [USER_ROLE.ADMIN],
		},
		{
			path: '/dashboard/management/specializations',
			element: SpecializationList,
			role: [USER_ROLE.ADMIN],
		},
		{
			path: '/dashboard/management/student/:username',
			element: OtherUserDashboard,
			role: [USER_ROLE.ADMIN],
		},
		{
			path: '/dashboard/management/tutor/:username',
			element: OtherUserDashboard,
			role: [USER_ROLE.ADMIN],
		},
		{
			path: '/dashboard/management/staff/:username',
			element: OtherUserDashboard,
			role: [USER_ROLE.ADMIN],
		},
		{
			path: '/dashboard/management/staffs',
			element: StaffList,
			role: [USER_ROLE.ADMIN],
		},
		{
			path: '/dashboard/management/students',
			element: StudentList,
			role: [USER_ROLE.ADMIN],
		},
		{
			path: '/dashboard/management/tutors',
			element: TutorList,
			role: [USER_ROLE.ADMIN],
		},
		{
			path: '/dashboard/management/admins',
			element: AdminList,
			role: [USER_ROLE.ADMIN],
		},
		{
			path: '/dashboard/management/analysis',
			element: SpecializationList,
			role: [USER_ROLE.ADMIN],
		},
		{
			path: '/dashboard/management/reports',
			element: SpecializationList,
			role: [USER_ROLE.ADMIN],
		},
		{
			path: '/dashboard/management/activity-logs',
			element: ActivityLogs,
			role: [USER_ROLE.ADMIN],
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
