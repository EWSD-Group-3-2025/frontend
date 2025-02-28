import { ChevronRight, type LucideIcon } from 'lucide-react';

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { useLocation } from 'react-router-dom';
import { USER_ROLE } from '@/constants';
import { useAuth } from '@/context/auth.context';
import { useState } from 'react';
import { cn } from '@/utils';

export function SidebarItem({
	items,
}: {
	items: {
		title: string;
		url: string;
		icon?: LucideIcon;
		role: (keyof typeof USER_ROLE)[];
		items?: {
			title: string;
			url: string;
			role: (keyof typeof USER_ROLE)[];
		}[];
	}[];
}) {
	const location = useLocation();
	const { user } = useAuth();

	const [openStates, setOpenStates] = useState<Record<string, boolean>>({});

	const hasPermission = (roles: (keyof typeof USER_ROLE)[]) => {
		return roles.some((role) => user?.roleName.includes(role));
	};

	// Filter sidebar items based on user role
	const filteredItems = items
		.filter((item) => hasPermission(item.role)) // Check parent-level permission
		.map((item) => ({
			...item,
			items: item.items?.filter((subItem) => hasPermission(subItem.role)), // Check child-level permission
		}));

	const toggleCollapse = (title: string) => {
		setOpenStates((prev) => ({ ...prev, [title]: !prev[title] }));
	};

	return (
		<SidebarGroup>
			<SidebarMenu>
				{filteredItems.map((item) => {
					const isActive =
						location.pathname === item.url || // Exact match for the main item
						(item.items?.some(
							(subItem) => location.pathname === subItem.url
						) ??
							false);

					const isOpen = openStates[item.title] ?? isActive;

					return item.items && item.items.length > 0 ? (
						<Collapsible
							key={item.title}
							asChild
							open={isOpen}
							onOpenChange={() => toggleCollapse(item.title)}
							className="group/collapsible"
						>
							<SidebarMenuItem>
								<CollapsibleTrigger asChild>
									<SidebarMenuButton tooltip={item.title}>
										{item.icon && <item.icon />}
										<span>{item.title}</span>
										<ChevronRight
											className={`ml-auto transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
										/>
									</SidebarMenuButton>
								</CollapsibleTrigger>
								<CollapsibleContent>
									<SidebarMenuSub>
										{item.items.map((subItem) => (
											<SidebarMenuSubItem
												key={subItem.title}
											>
												<SidebarMenuSubButton asChild>
													<a href={subItem.url}>
														<span>
															{subItem.title}
														</span>
													</a>
												</SidebarMenuSubButton>
											</SidebarMenuSubItem>
										))}
									</SidebarMenuSub>
								</CollapsibleContent>
							</SidebarMenuItem>
						</Collapsible>
					) : (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton
								asChild
								className={cn(
									isActive &&
										'bg-neutral-200 dark:bg-neutral-700'
								)}
							>
								<a
									href={item.url}
									className="flex items-center gap-2"
								>
									{item.icon && <item.icon />}
									<span>{item.title}</span>
								</a>
							</SidebarMenuButton>
						</SidebarMenuItem>
					);
				})}
			</SidebarMenu>
		</SidebarGroup>
	);
}
