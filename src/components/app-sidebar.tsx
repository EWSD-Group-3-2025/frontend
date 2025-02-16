import * as React from 'react';
import { LayoutDashboard, Newspaper, UsersRound } from 'lucide-react';

import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from '@/components/ui/sidebar';
import { Link } from 'react-router-dom';
import { SidebarItem } from '@/components/sidebar-item';
import { USER_ROLE } from '@/constants';
import { useUserBasePath } from '@/hooks/useUserBasePath';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const baseURL = useUserBasePath();

	const sidebarList = [
		{
			title: 'Dashboard',
			url: baseURL,
			icon: LayoutDashboard,
			role: [USER_ROLE.ADMIN],
		},
		{
			title: 'User Management',
			url: '#',
			icon: UsersRound,
			role: [USER_ROLE.ADMIN, USER_ROLE.STAFF],
			items: [
				{
					title: 'Users',
					url: `${baseURL}/users`,
					role: [USER_ROLE.ADMIN, USER_ROLE.STAFF],
				},
				{
					title: 'Admins',
					url: `${baseURL}/admins`,
					role: [USER_ROLE.ADMIN],
				},
				{
					title: 'Students',
					url: `${baseURL}/students`,
					role: [USER_ROLE.ADMIN, USER_ROLE.STAFF],
				},
				{
					title: 'Tutors',
					url: `${baseURL}/tutors`,
					role: [USER_ROLE.ADMIN, USER_ROLE.STAFF],
				},
				{
					title: 'Staffs',
					url: `${baseURL}/staffs`,
					role: [USER_ROLE.ADMIN, USER_ROLE.STAFF],
				},
			],
		},
		{
			title: 'Report',
			url: '#',
			icon: Newspaper,
			role: [USER_ROLE.ADMIN, USER_ROLE.STAFF],
			items: [
				{
					title: 'Inactive Users',
					url: '#',
					role: [USER_ROLE.ADMIN, USER_ROLE.STAFF],
				},
				{
					title: 'Student Without Tutor',
					url: '#',
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
							<Link to={baseURL}>
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
									<img
										src="/vite.svg"
										alt="Anima Logo"
										className="size-4"
									/>
								</div>
								<div className="flex flex-col gap-0.5 text-lg font-semibold leading-none">
									Admin Dashboard
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
