import { useLocation, useNavigate } from 'react-router-dom';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useAuth } from '@/context/auth.context';

const CustomBreadcrumbs = () => {
	const { user } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const currentPath = location.pathname;

	const breadcrumbs = currentPath
		.split('/')
		.filter((crumb) => crumb && isNaN(Number(crumb)));

	const getPath = (index: number) => {
		return '/' + breadcrumbs.slice(0, index + 1).join('/');
	};

	return (
		<Breadcrumb>
			<BreadcrumbList>
				{breadcrumbs.map((crumb, index) => {
					const isDashboard = crumb.toLowerCase() === 'dashboard';
					const isLast = index === breadcrumbs.length - 1;

					return (
						<div
							className="inline-flex items-center gap-1.5"
							key={index}
						>
							<BreadcrumbItem className="text-xs xs:text-sm">
								<BreadcrumbLink
									className={`${
										isDashboard || isLast
											? 'cursor-default hover:text-current'
											: 'cursor-pointer hover:underline'
									}`}
									{...(isDashboard || isLast
										? {}
										: {
												onClick: () =>
													navigate(getPath(index)),
											})}
								>
									{crumb.charAt(0).toUpperCase() +
										crumb.slice(1) ===
									'End-user'
										? `${
												user &&
												user?.username
													?.charAt(0)
													?.toUpperCase() +
													user?.username?.slice(1)
											}`
										: crumb.charAt(0).toUpperCase() +
											crumb.slice(1)}
								</BreadcrumbLink>
							</BreadcrumbItem>
							{index < breadcrumbs.length - 1 && (
								<BreadcrumbSeparator />
							)}
						</div>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
};

export default CustomBreadcrumbs;
