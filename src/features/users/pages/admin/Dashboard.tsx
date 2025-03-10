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
	CartesianGrid,
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
	StudentUser,
} from '@/features/users/types';
import DataTable from '@/components/data-table';
import { useQueries } from '@tanstack/react-query';
import {
	getAdminDashboard,
	getAllUsers,
	getBrowserCount,
	getMostViewedPages,
} from '@/features/users/api';
import AllocateTutor from '@/features/users/components/allocate-tutor';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

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

const barChartData = [
	{ pageName: 'Admin List', count: 186 },
	{ pageName: 'Student List', count: 305 },
	{ pageName: 'Tutor List', count: 237 },
	{ pageName: 'Chart Dashboard', count: 73 },
	{ pageName: 'User Dashboard', count: 209 },
	{ pageName: 'Log in', count: 214 },
];

const barChartConfig = {
	count: {
		label: 'Total User',
		color: 'hsl(var(--chart-1))',
	},
} satisfies ChartConfig;

const AdminDashboard = () => {
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
			id: 'gender',
			header: ({ column }) => (
				<HeaderSorting column={column} title="Gender" />
			),
			accessorKey: 'gender',
			cell: (params) => (
				<>
					{params.row.original.gender === 1
						? 'Male'
						: params.row.original.gender === 2
							? 'Female'
							: 'Other'}
				</>
			),
		},
		{
			id: 'action',
			header: 'Action',
			accessorKey: 'action',
			cell: (params) => (
				<Button
					className="w-fit"
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
		{ data: mostBrowserUsageData },
	] = useQueries({
		queries: [
			{
				queryKey: ['get-all-users-unassign-student'],
				queryFn: async (): Promise<StudentUser[]> => {
					const response = await getAllUsers('role=student');
					if (response.data.code === 200) {
						const filterData = (
							response.data.data as StudentUser[]
						).filter(
							(student: StudentUser) =>
								student.allocateTutorId === null &&
								student.status
						);
						return filterData as StudentUser[];
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
				queryFn: async (): Promise<HTTPResponse<StudentUser[]>> => {
					const response = await getMostViewedPages();
					if (response.data.code === 200) {
						return response.data as HTTPResponse<StudentUser[]>;
					}

					throw new Error('Fetch Student Listing Fail!');
				},
			},
		],
	});

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
				<div className="flex flex-col flex-wrap gap-10 lg:flex-row">
					<div className="pie-chart flex-1">
						<h2 className="mb-2 text-center font-roboto-slab text-2xl">
							Most Browser Usage
						</h2>
						<ChartContainer config={chartConfig} className="h-full">
							<PieChart>
								<ChartTooltip
									content={<ChartTooltipContent hideLabel />}
								/>
								<Pie
									data={mostBrowserUsageData}
									dataKey="uniqueUserCount"
									label
									nameKey="browser"
								/>
							</PieChart>
						</ChartContainer>
					</div>
					<div className="bar-chart flex-1">
						<h2 className="mb-2 text-center font-roboto-slab text-2xl">
							Top 5 Most User Viewed Pages
						</h2>
						<ChartContainer config={barChartConfig}>
							<BarChart
								accessibilityLayer
								data={barChartData}
								layout="vertical"
								margin={{
									right: 16,
								}}
							>
								<CartesianGrid horizontal={false} />
								<YAxis
									dataKey="pageName"
									type="category"
									tickLine={false}
									tickMargin={10}
									axisLine={false}
									tickFormatter={(value) => value.slice(0, 3)}
									hide
								/>
								<XAxis dataKey="count" type="number" hide />
								<ChartTooltip
									cursor={false}
									content={
										<ChartTooltipContent indicator="line" />
									}
								/>
								<Bar
									dataKey="count"
									layout="vertical"
									fill="hsl(var(--chart-2))"
									radius={4}
								>
									<LabelList
										dataKey="pageName"
										position="insideLeft"
										offset={8}
										className="fill-font-white"
										fontSize={12}
									/>
									<LabelList
										dataKey="count"
										position="right"
										offset={8}
										className="fill-foreground"
										fontSize={12}
									/>
								</Bar>
							</BarChart>
						</ChartContainer>
					</div>
				</div>

				<div className="mt-10">
					<DataTable
						className="h-fit"
						columns={userListColumns}
						isLoading={unassignStudentLoading}
						data={unassignStudentData ?? []}
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
