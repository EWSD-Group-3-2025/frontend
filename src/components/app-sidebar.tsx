import * as React from 'react';
import { Link } from 'react-router-dom';

import {
	Bell,
	BookOpen,
	Cog,
	FilePenLine,
	FileText,
	LayoutDashboard,
	Library,
	Logs,
	UsersRound,
	Video,
} from 'lucide-react';

import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from '@/components/ui/sidebar';
import { USER_ROLE } from '@/constants';
import { SidebarItem } from '@/components/sidebar-item';
import { userStore } from '@/store/use-user-data-store';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { userData: user } = userStore();

	const sidebarList = [
		{
			title: 'Dashboard',
			url: '/dashboard/management',
			icon: LayoutDashboard,
			role: [USER_ROLE.ADMIN, USER_ROLE.STAFF],
		},

		{
			title: 'Activity Logs',
			url: '/dashboard/management/activity-logs',
			icon: Logs,
			role: [USER_ROLE.ADMIN, USER_ROLE.STAFF],
		},

		{
			title: 'Content Management',
			url: '#',
			icon: FilePenLine,
			role: [USER_ROLE.ADMIN, USER_ROLE.STAFF],
			items: [
				{
					title: 'Blogs',
					url: '/dashboard/management/blogs',
					icon: BookOpen,
					role: [USER_ROLE.ADMIN, USER_ROLE.STAFF],
				},
				{
					title: 'Documents',
					url: '/dashboard/management/documents',
					icon: FileText,
					role: [USER_ROLE.ADMIN, USER_ROLE.STAFF],
				},
				{
					title: 'Meetings',
					url: '/dashboard/management/meetings',
					icon: Video,
					role: [USER_ROLE.ADMIN, USER_ROLE.STAFF],
				},
				{
					title: 'Events',
					url: '/dashboard/management/events',
					icon: Bell,
					role: [USER_ROLE.ADMIN, USER_ROLE.STAFF],
				},
				{
					title: 'Books',
					icon: Library,
					url: '/dashboard/management/books',
					role: [
						USER_ROLE.TUTOR,
						USER_ROLE.ADMIN,
						USER_ROLE.STAFF,
						USER_ROLE.STUDENT,
					],
				},
			],
		},
		{
			title: 'User Management',
			url: '#',
			icon: UsersRound,
			role: [USER_ROLE.ADMIN, USER_ROLE.STAFF],
			items: [
				{
					title: 'Admins',
					url: '/dashboard/management/admins',
					role: [USER_ROLE.ADMIN, USER_ROLE.STAFF],
				},
				{
					title: 'Staffs',
					url: '/dashboard/management/staffs',
					role: [USER_ROLE.ADMIN, USER_ROLE.STAFF],
				},
				{
					title: 'Students',
					url: '/dashboard/management/students',
					role: [USER_ROLE.ADMIN, USER_ROLE.STAFF],
				},
				{
					title: 'Tutors',
					url: '/dashboard/management/tutors',
					role: [USER_ROLE.ADMIN, USER_ROLE.STAFF],
				},
			],
		},
		{
			title: 'Resource Management',
			url: '#',
			icon: Cog,
			role: [USER_ROLE.ADMIN, USER_ROLE.STAFF],
			items: [
				{
					title: 'Departments',
					url: '/dashboard/management/departments',
					role: [USER_ROLE.ADMIN, USER_ROLE.STAFF],
				},
				{
					title: 'Courses',
					url: '/dashboard/management/courses',
					role: [USER_ROLE.ADMIN, USER_ROLE.STAFF],
				},
				{
					title: 'Specializations',
					url: '/dashboard/management/specializations',
					role: [USER_ROLE.ADMIN, USER_ROLE.STAFF],
				},
			],
		},
	];

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<Link to="/dashboard/management">
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
									<img
										src="/vite.svg"
										alt="Anima Logo"
										className="size-4"
									/>
								</div>
								<div className="flex flex-col gap-0.5 text-lg font-semibold leading-none">
									{user?.name}'s Dashboard
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarItem items={sidebarList} />
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	);
}
