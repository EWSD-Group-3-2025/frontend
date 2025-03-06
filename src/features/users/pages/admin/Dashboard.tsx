import ContainerWrapper from '@/components/container-wrapper';
import DashboardCard from '@/features/users/components/dashboard-card';
import {
	MessageSquareQuote,
	User,
	UserRoundCheck,
	UsersRound,
	TrendingUp,
} from 'lucide-react';
import { Label, LabelList, Pie, PieChart } from 'recharts';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';

interface CustomConfig {
	[key: string]: {
		label: string;
		color: string;
		fill?: string;
	};
}

const chartData = [
	{ browser: 'Chrome', value: 275 },
	{ browser: 'Firefox', value: 287 },
	{ browser: 'Safari', value: 200 },
	{ browser: 'Edge', value: 173 },
	{ browser: 'Opera', value: 160 },
	{ browser: 'Vivaldi', value: 130 },
	{ browser: 'Samsung Internet', value: 190 },
	{ browser: 'Yandex', value: 120 },
	{ browser: 'Brave', value: 145 },
	{ browser: 'Internet Explorer', value: 110 },
	{ browser: 'Unknown', value: 90 },
];

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
	vivaldi: {
		label: 'Vivaldi',
		color: 'hsl(var(--vivaldi))',
		fill: 'hsl(var(--vivaldi))',
	},
	'samsung internet': {
		label: 'Samsung Internet',
		color: 'hsl(var(--samsung-internet))',
		fill: 'hsl(var(--samsung-internet))',
	},
	yandex: {
		label: 'Yandex',
		color: 'hsl(var(--yandex))',
		fill: 'hsl(var(--yandex))',
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
		color: 'hsl(var(--chart-unknown))',
		fill: 'hsl(var(--chart-unknown))',
	},
};

const AdminDashboard = () => {
	const formattedChartData = chartData.map((item) => {
		const key = item.browser.toLowerCase();
		return {
			...item,
			fill: chartConfig[key]?.fill ?? 'hsl(var(--chart-unknown))',
		};
	});

	console.log(formattedChartData);

	return (
		<>
			<div className="mb-3 flex gap-3">
				<DashboardCard
					title="Total Users"
					value={55}
					icon={UsersRound}
				/>
				<DashboardCard
					title="Assigned Student"
					value={55}
					icon={User}
				/>
				<DashboardCard
					title="Active Tutors"
					value={55}
					icon={UserRoundCheck}
				/>
				<DashboardCard
					title="Total Message"
					value={55}
					icon={MessageSquareQuote}
				/>
			</div>
			<ContainerWrapper>
				<Card className="flex flex-col">
					<CardHeader className="items-center pb-0">
						<CardTitle>Pie Chart - Label List</CardTitle>
						<CardDescription>January - June 2024</CardDescription>
					</CardHeader>
					<CardContent className="flex-1 pb-0">
						<ChartContainer
							config={chartConfig}
							className="mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-background"
						>
							<PieChart>
								<ChartTooltip
									content={({
										payload,
									}: {
										payload?: any[];
									}) => {
										if (!payload || payload.length === 0)
											return null;
										const data = payload[0].payload;
										return (
											<div className="rounded-md bg-white p-2 shadow-md dark:bg-gray-800">
												<p className="font-semibold">
													{data.browser}
												</p>
												<p>Visitors: {data.value}</p>
											</div>
										);
									}}
								/>
								<Pie
									data={formattedChartData}
									dataKey="value"
									nameKey="browser"
								>
									<LabelList
										dataKey="browser"
										position="inside"
										className="fill-white text-xs"
									/>
								</Pie>
							</PieChart>
						</ChartContainer>
					</CardContent>
					<CardFooter className="flex-col gap-2 text-sm">
						<div className="flex items-center gap-2 font-medium leading-none">
							Trending up by 5.2% this month{' '}
							<TrendingUp className="h-4 w-4" />
						</div>
						<div className="leading-none text-muted-foreground">
							Showing total visitors for the last 6 months
						</div>
					</CardFooter>
				</Card>
			</ContainerWrapper>
		</>
	);
};

export default AdminDashboard;
