import { createElement, ElementType } from 'react';
import { Route, Routes } from 'react-router-dom';

import HomePage from '@/pages/HomePage';
import NotFound from '@/pages/notFound/NotFound';
import LoginPage from '@/features/auth/pages/Login';
import EndUserLayout from '@/layouts/EndUserLayout';
import ManagementLayout from '@/layouts/ManagementLayout';
import StandaloneLayout from '@/layouts/StandaloneLayout';
import VerifyOTPPage from '@/features/auth/pages/VerifyOTP';
import CourseList from '@/features/courses/pages/CourseList';
import AuthGuard from '@/features/auth/components/auth-guard';
import RouteGuard from '@/features/auth/components/role-guard';
import BlogPage from '@/features/users/pages/end-user/blog-page';
import StaffList from '@/features/users/pages/management/StaffList';
import TutorList from '@/features/users/pages/management/TutorList';
import AdminList from '@/features/users/pages/management/AdminList';
import ResetPasswordPage from '@/features/auth/pages/ResetPassword';
import ChangePasswordPage from '@/features/auth/pages/ChangePassword';
import ActivityLogs from '@/features/activity-logs/page/ActivityLogs';
import ForgotPasswordPage from '@/features/auth/pages/ForgotPassword';
import StudentList from '@/features/users/pages/management/StudentList';
import DepartmentList from '@/features/departments/pages/DepartmentList';
import MessagesPage from '@/features/users/pages/end-user/messages-page';
import CalendarPage from '@/features/users/pages/end-user/calendar-page';
import MeetingsPage from '@/features/users/pages/end-user/meetings-page';
import DocumentsPage from '@/features/users/pages/end-user/documents-page';
import OtherUserDashboard from '@/features/users/pages/admin/OtherUserDashboard';
import EndUserDashboard from '@/features/users/pages/end-user/end-user-dashboard';
import ResetPasswordSuccessPage from '@/features/auth/pages/ResetPasswordSuccess';
import SpecializationList from '@/features/specialization/pages/SpecializationList';
import AdminDashboard from '@/features/users/pages/admin/Dashboard';

export type Route = {
	name: string;
	path: string;
	element: ElementType;
	isPublic?: boolean;
	children?: Route[];
};

export const appRouteList: Route[] = [
	{
		name: 'Stand alone Layout',
		path: '/',
		element: StandaloneLayout,
		children: [
			{
				name: 'Login',
				path: '/login',
				element: LoginPage,
				isPublic: true,
			},
			{
				name: 'Forgot Password',
				path: '/forgot-password',
				element: ForgotPasswordPage,
				isPublic: true,
			},
			{
				name: 'Verify OTP',
				path: '/verify-otp',
				element: VerifyOTPPage,
				isPublic: true,
			},
			{
				name: 'Reset Password',
				path: '/reset-password',
				element: ResetPasswordPage,
				isPublic: true,
			},
			{
				name: 'Reset Password Successful',
				path: '/reset-password-successful',
				element: ResetPasswordSuccessPage,
				isPublic: true,
			},
			{
				name: 'Change Password',
				path: '/change-password',
				element: ChangePasswordPage,
			},
		],
	},
	{
		name: 'End User Layout',
		path: '/dashboard/end-user',
		element: EndUserLayout,
		children: [
			{
				name: 'End User Dashboard',
				path: '/dashboard/end-user',
				element: EndUserDashboard,
			},
			{
				name: 'Messages',
				path: '/dashboard/end-user/messages',
				element: MessagesPage,
			},
			{
				name: 'Meetings',
				path: '/dashboard/end-user/meetings',
				element: MeetingsPage,
			},
			{
				name: 'Calendar',
				path: '/dashboard/end-user/calendar',
				element: CalendarPage,
			},
			{
				name: 'Documents',
				path: '/dashboard/end-user/documents',
				element: DocumentsPage,
			},
			{
				name: 'Blog',
				path: '/dashboard/end-user/blog',
				element: BlogPage,
			},
		],
	},
	{
		name: 'Admin Layout',
		path: '/dashboard/management',
		element: ManagementLayout,
		children: [
			{
				name: 'Management Dashboard',
				path: '/dashboard/management',
				element: AdminDashboard,
			},
			{
				name: 'Departments',
				path: '/dashboard/management/departments',
				element: DepartmentList,
			},
			{
				name: 'Courses',
				path: '/dashboard/management/courses',
				element: CourseList,
			},
			{
				name: 'Specializations',
				path: '/dashboard/management/specializations',
				element: SpecializationList,
			},
			{
				name: 'Student Dashboard',
				path: '/dashboard/management/student/:username',
				element: OtherUserDashboard,
			},
			{
				name: 'Tutor Dashboard',
				path: '/dashboard/management/tutor/:username',
				element: OtherUserDashboard,
			},
			{
				name: 'Staff Dashboard',
				path: '/dashboard/management/staff/:username',
				element: OtherUserDashboard,
			},
			{
				name: 'Staff List',
				path: '/dashboard/management/staffs',
				element: StaffList,
			},
			{
				name: 'Student List',
				path: '/dashboard/management/students',
				element: StudentList,
			},
			{
				name: 'Tutor List',
				path: '/dashboard/management/tutors',
				element: TutorList,
			},
			{
				name: 'Admin List',
				path: '/dashboard/management/admins',
				element: AdminList,
			},
			{
				name: 'Analysis',
				path: '/dashboard/management/analysis',
				element: SpecializationList,
			},
			{
				name: 'Reports',
				path: '/dashboard/management/reports',
				element: SpecializationList,
			},
			{
				name: 'Activity Logs',
				path: '/dashboard/management/activity-logs',
				element: ActivityLogs,
			},
		],
	},
	{
		name: 'Not Found',
		path: '*',
		element: NotFound,
	},
];

const Router = () => {
	return (
		<Routes>
			{appRouteList.map((route) => {
				return (
					<Route
						key={route.path}
						path={route.path}
						element={<route.element />}
					>
						{route.children &&
							route.children.map((childRoute) => {
								const renderWithAuth = !!childRoute.isPublic ? (
									<childRoute.element />
								) : (
									<AuthGuard>
										<RouteGuard>
											<childRoute.element />
										</RouteGuard>
									</AuthGuard>
								);
								return (
									<Route
										key={childRoute.path}
										path={childRoute.path}
										element={renderWithAuth}
									/>
								);
							})}
					</Route>
				);
			})}

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
