import { Outlet } from 'react-router-dom';

import { ModeToggle } from '@/components/mode-toggle';
import { UserButton } from '@/features/auth/components/user-button';
import CustomBreadcrumbs from '@/components/custom-breadcrumb';
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Separator } from '@/components/ui/separator';

const ManagementLayout = () => {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset className="overflow-x-hidden">
				<header className="mb-4 flex h-16 shrink-0 items-center justify-between gap-2 px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
					<div className="flex items-center gap-2">
						<SidebarTrigger className="-ml-1" />
						<Separator
							orientation="vertical"
							className="mr-2 h-4"
						/>
						<CustomBreadcrumbs />
					</div>
					<div className="flex items-center gap-x-3">
						<UserButton />
						<ModeToggle />
					</div>
				</header>
				<div className="flex-1 p-4 pt-0">
					<Outlet />
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
};

export default ManagementLayout;
