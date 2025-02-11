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

const sidebarList = [
	{
		title: 'Dashboard',
		url: '/dashboard/admin',
		icon: LayoutDashboard,
	},
	{
		title: 'User Management',
		url: '#',
		icon: UsersRound,
		items: [
			{
				title: 'Users',
				url: '/dashboard/admin/users',
			},
		],
	},
	{
		title: 'Report',
		url: '#',
		icon: Newspaper,
		items: [
			{
				title: 'Inactive Users',
				url: '#',
			},
			{
				title: 'Student Without Tutor',
				url: '#',
			},
		],
	},
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<Link to="/dashboard/admin">
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
