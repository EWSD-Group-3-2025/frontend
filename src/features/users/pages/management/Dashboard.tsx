import ContainerWrapper from '@/components/container-wrapper';
import DashboardCard from '@/features/users/components/dashboard-card';
import {
	MessageSquareQuote,
	User,
	UserRoundCheck,
	UsersRound,
} from 'lucide-react';
import {
	Bar,
	BarChart,
	LabelList,
	Pie,
	PieChart,
	XAxis,
	YAxis,
} from 'recharts';
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import { HeaderSorting } from '@/components/header-sorting';
import { ColumnDef } from '@tanstack/react-table';
import {
	AdminDashboard as AdminDashboardDataType,
	MostBrowserUsagePieChart,
	MostViewedPage,
	StudentUser,
} from '@/features/users/types';
import DataTable from '@/components/data-table';
import { useQueries } from '@tanstack/react-query';
import {
	getAdminDashboard,
	getBrowserCount,
	getInactivityStudents,
	getMostActiveUsers,
	getMostViewedPages,
	getUnassignStudentList,
} from '@/features/users/api';
import AllocateTutor from '@/features/users/components/allocate-tutor';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useMedia } from 'react-use';
import { Skeleton } from '@/components/ui/skeleton';
import { cn, getGenderName, getRoleColor } from '@/utils';
import { Badge } from '@/components/ui/badge';

interface CustomConfig {
	[key: string]: {
		label: string;
		color: string;
		fill?: string;
	};
}

const chartConfig: CustomConfig = {
	chrome: {
		label: 'Chrome',
		color: 'hsl(var(--chrome))',
		fill: 'hsl(var(--chrome))',
	},
	firefox: {
		label: 'Firefox',
		color: 'hsl(var(--firefox))',
		fill: 'hsl(var(--firefox))',
	},
	safari: {
		label: 'Safari',
		color: 'hsl(var(--safari))',
		fill: 'hsl(var(--safari))',
	},
	edge: {
		label: 'Edge',
		color: 'hsl(var(--edge))',
		fill: 'hsl(var(--edge))',
	},
	opera: {
		label: 'Opera',
		color: 'hsl(var(--opera))',
		fill: 'hsl(var(--opera))',
	},
	brave: {
		label: 'Brave',
		color: 'hsl(var(--brave))',
		fill: 'hsl(var(--brave))',
	},
	'internet explorer': {
		label: 'Internet Explorer',
		color: 'hsl(var(--internet-explorer))',
		fill: 'hsl(var(--internet-explorer))',
	},
	unknown: {
		label: 'Unknown',
		color: 'hsl(var(--unknown))',
		fill: 'hsl(var(--unknown))',
	},
};

const barChartConfig = {
	routeName: {
		label: 'Total User',
		color: 'hsl(var(--chart-1))',
	},
} satisfies ChartConfig;

const AdminDashboard = () => {
	const isDesktop = useMedia('(min-width: 1048px)', true);

	const [isOpenAllocationModal, setIsOpenAllocationModal] = useState(false);
	const [selectedStudent, setSelectedStudent] = useState<StudentUser | null>(
		null
	);

	const userListColumns: ColumnDef<StudentUser>[] = [
		{
			id: 'no',
			header: 'No.',
			cell: (params) => params.row.index + 1,
		},
		{
			id: 'name',
			header: ({ column }) => (
				<HeaderSorting column={column} title="Name" />
			),
			accessorKey: 'name',
		},
		{
			id: 'username',
			header: ({ column }) => (
				<HeaderSorting column={column} title="UserName" />
			),
			accessorKey: 'username',
		},
		{
			id: 'email',
			header: ({ column }) => (
				<HeaderSorting column={column} title="Email" />
			),
			accessorKey: 'email',
		},
		{
			id: 'course',
			header: ({ column }) => (
				<HeaderSorting column={column} title="Course" />
			),
			accessorKey: 'courseName',
		},
		{
			id: 'roleId',
			header: ({ column }) => (
				<HeaderSorting column={column} title="Role" />
			),
			accessorKey: 'roleId',
			cell: (params) => (
				<Badge
					className={cn(
						'w-16 justify-center rounded-[3px] capitalize tracking-wide',
						getRoleColor(params.row.original.roleName)
					)}
				>
					{params.row.original.roleName.toLocaleLowerCase()}
				</Badge>
			),
		},
		{
			id: 'gender',
			header: ({ column }) => (
				<HeaderSorting column={column} title="Gender" />
			),
			accessorKey: 'gender',
			cell: (params) => getGenderName(params.row.original.gender),
		},
		{
			id: 'action',
			header: 'Action',
			accessorKey: 'action',
			cell: (params) => (
				<Button
					className="w-fit"
					size="sm"
					onClick={() => {
						setSelectedStudent(params.row.original);
						setIsOpenAllocationModal(true);
					}}
				>
					<UserRoundCheck /> Allocate Tutor
				</Button>
			),
		},
	];

	const [
		{ data: unassignStudentData, isLoading: unassignStudentLoading },
		{ data: adminDashboardData, isLoading: adminDashboardLoading },
		{ data: mostBrowserUsageData, isLoading: mostBrowserUsageLoading },
		{ data: mostViewedPageData, isLoading: mostViewedPageLoading },
		{ data: mostActiveUsersData, isLoading: mostActiveUsersLoading },
		{ data: inactiveStudentData, isLoading: inactiveStudentLoading },
	] = useQueries({
		queries: [
			{
				queryKey: ['get-all-users-unassign-student'],
				queryFn: async (): Promise<StudentUser[]> => {
					const response = await getUnassignStudentList();

					if (response.status === 200) {
						return response.data.data as StudentUser[];
					}

					throw new Error('Fetch Student Listing Fail!');
				},
			},
			{
				queryKey: ['get-admin-dashboard'],
				queryFn: async (): Promise<
					HTTPResponse<AdminDashboardDataType>
				> => {
					const response = await getAdminDashboard();
					if (response.data.code === 200) {
						return response.data;
					}

					throw new Error('Fetch Student Listing Fail!');
				},
			},
			{
				queryKey: ['get-most-browser-usage'],
				queryFn: async (): Promise<MostBrowserUsagePieChart[]> => {
					const response = await getBrowserCount();
					if (response.data.code === 200) {
						return response.data.data.map((item) => {
							const key = item.browserName.toLowerCase();
							return {
								...item,
								fill:
									chartConfig[key]?.fill ??
									'hsl(var(--unknown))',
							};
						});
					}

					throw new Error('Fetch Student Listing Fail!');
				},
			},
			{
				queryKey: ['get-most-pages-viewed'],
				queryFn: async (): Promise<HTTPResponse<MostViewedPage[]>> => {
					const response = await getMostViewedPages();
					if (response.data.code === 200) {
						return response.data as HTTPResponse<MostViewedPage[]>;
					}

					throw new Error('Fetch Student Listing Fail!');
				},
			},
			{
				queryKey: ['get-most-active-users'],
				queryFn: async (): Promise<HTTPResponse<StudentUser[]>> => {
					const response = await getMostActiveUsers();
					if (response.data.code === 200) {
						return response.data as HTTPResponse<StudentUser[]>;
					}

					throw new Error('Fetch Student Listing Fail!');
				},
			},
			{
				queryKey: ['get-inactive-students'],
				queryFn: async (): Promise<HTTPResponse<StudentUser[]>> => {
					const response = await getInactivityStudents();
					if (response.data.code === 200) {
						return response.data as HTTPResponse<StudentUser[]>;
					}

					throw new Error('Fetch Student Listing Fail!');
				},
			},
		],
	});

	const getFilteredColumns = (type: 'unassigned' | 'inactive' | 'active') => {
		const excludedFields: Record<string, string[]> = {
			unassigned: ['roleId'],
			inactive: ['action', 'course', 'roleId'],
			active: ['action', 'course'],
		};

		return userListColumns.filter(
			(col) => !excludedFields[type]?.includes(col.id ?? '')
		);
	};

	return (
		<>
			<div className="mb-3 flex flex-col flex-wrap gap-3 md:flex-row">
				{adminDashboardLoading ? (
					<>
						<div className="flex flex-1 gap-3">
							<DashboardCard title="Total Users" loading />
							<DashboardCard title="Assigned Student" loading />
						</div>
						<div className="flex flex-1 gap-3">
							<DashboardCard title="Active Tutors" loading />
							<DashboardCard title="Total Message" loading />
						</div>
					</>
				) : adminDashboardData ? (
					<>
						<div className="flex flex-1 gap-3">
							<DashboardCard
								title="Total Users"
								description={`+ ${
									adminDashboardData.data
										.increaseThisMonthCount
								} last month`}
								value={adminDashboardData.data.totalUsers}
								icon={UsersRound}
							/>
							<DashboardCard
								title="Assigned Student"
								value={adminDashboardData.data.assignedStudents}
								icon={User}
							/>
						</div>
						<div className="flex flex-1 gap-3">
							<DashboardCard
								title="Active Tutors"
								value={adminDashboardData.data.activeTutors}
								icon={UserRoundCheck}
							/>
							<DashboardCard
								title="Total Message"
								value={adminDashboardData.data.totalMessages}
								icon={MessageSquareQuote}
							/>
						</div>
					</>
				) : null}
			</div>
			<ContainerWrapper className="h-fit">
				<div className="flex flex-col flex-wrap gap-10 md:flex-row">
					<div className="pie-chart flex-1">
						<h2 className="mb-2 text-center font-roboto-slab text-xl lg:text-2xl">
							Most Browser Usage
						</h2>
						{mostBrowserUsageLoading ? (
							<Skeleton className="h-64 w-full rounded-lg" />
						) : (
							<ChartContainer
								config={chartConfig}
								className="h-full"
							>
								<PieChart>
									<ChartTooltip
										content={
											<ChartTooltipContent hideLabel />
										}
									/>
									<Pie
										data={mostBrowserUsageData}
										dataKey="uniqueUserCount"
										label
										nameKey="browserName"
									/>
								</PieChart>
							</ChartContainer>
						)}
					</div>
					<div className="bar-chart flex-1">
						<h2 className="mb-2 text-center font-roboto-slab text-xl lg:text-2xl">
							Top 5 Most User Viewed Pages
						</h2>
						{mostViewedPageLoading ? (
							<Skeleton className="h-64 w-full rounded-lg" />
						) : (
							<ChartContainer config={barChartConfig}>
								<BarChart
									accessibilityLayer
									data={mostViewedPageData?.data}
									layout="vertical"
									margin={{
										left: isDesktop ? 30 : 40,
										right: 20,
									}}
								>
									<XAxis
										type="number"
										dataKey="visitCount"
										hide
									/>
									<YAxis
										dataKey="pageName"
										type="category"
										tickLine={false}
										tickMargin={10}
										axisLine={false}
									/>
									<ChartTooltip
										cursor={false}
										content={
											<ChartTooltipContent hideLabel />
										}
									/>
									<Bar
										dataKey="visitCount"
										fill="hsl(var(--chart-2))"
										radius={5}
									>
										<LabelList
											dataKey="visitCount"
											position="right"
											offset={8}
											className="fill-foreground"
											fontSize={12}
										/>
									</Bar>
								</BarChart>
							</ChartContainer>
						)}
					</div>
				</div>

				<div className="mt-10">
					<h2 className="mb-2 text-center font-roboto-slab text-xl lg:text-2xl">
						Unassigned Student List
					</h2>
					<DataTable
						columns={getFilteredColumns('unassigned')}
						isLoading={unassignStudentLoading}
						data={unassignStudentData ?? []}
						cellClassName="py-1"
					/>
				</div>

				<div className="mt-5">
					<h2 className="mb-2 text-center font-roboto-slab text-xl lg:text-2xl">
						Inactive 7days - 28days Student List
					</h2>
					<DataTable
						columns={getFilteredColumns('inactive')}
						isLoading={inactiveStudentLoading}
						data={inactiveStudentData?.data ?? []}
					/>
				</div>

				<div className="mt-5">
					<h2 className="mb-2 text-center font-roboto-slab text-xl lg:text-2xl">
						Most Active User List
					</h2>
					<DataTable
						columns={getFilteredColumns('active')}
						isLoading={mostActiveUsersLoading}
						data={mostActiveUsersData?.data ?? []}
					/>
				</div>
			</ContainerWrapper>
			<AllocateTutor
				isOpen={isOpenAllocationModal}
				setIsOpen={setIsOpenAllocationModal}
				setSelectedStudent={setSelectedStudent}
				selectedStudent={selectedStudent}
			/>
		</>
	);
};

export default AdminDashboard;
