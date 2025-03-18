import * as React from 'react';
import { Link } from 'react-router-dom';

import {
	Bell,
	BookOpen,
	Calendar,
	FileText,
	LayoutDashboard,
	MessageSquare,
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

export function EndUserAppSidebar({
	...props
}: React.ComponentProps<typeof Sidebar>) {
	const { userData: user } = userStore();

	const sidebarList = [
		{
			title: 'Dashboard',
			url: '/dashboard/end-user',
			icon: LayoutDashboard,
			role: [USER_ROLE.TUTOR, USER_ROLE.STUDENT],
		},
		{
			title: 'Messages',
			icon: MessageSquare,
			url: '/dashboard/end-user/messages',
			role: [USER_ROLE.TUTOR, USER_ROLE.STUDENT],
		},
		{
			title: 'Meetings',
			icon: Video,
			url: '/dashboard/end-user/meetings',
			role: [USER_ROLE.TUTOR, USER_ROLE.STUDENT],
		},
		{
			title: 'Calendar',
			icon: Calendar,
			url: '/dashboard/end-user/calendar',
			role: [USER_ROLE.TUTOR, USER_ROLE.STUDENT],
		},
		{
			title: 'Events',
			icon: Bell,
			url: '/dashboard/end-user/events',
			role: [USER_ROLE.TUTOR, USER_ROLE.STUDENT],
		},
		{
			title: 'Documents',
			icon: FileText,
			url: '/dashboard/end-user/documents',
			role: [USER_ROLE.TUTOR, USER_ROLE.STUDENT],
		},
		{
			title: 'Blog',
			icon: BookOpen,
			url: '/dashboard/end-user/blog',
			role: [USER_ROLE.TUTOR, USER_ROLE.STUDENT],
		},
	];

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<Link to="/dashboard/end-user">
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gray-300 text-sidebar-primary-foreground dark:bg-gray-700">
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
