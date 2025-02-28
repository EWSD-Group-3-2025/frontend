import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';

import DataTable from '@/components/data-table';
import SearchBox from '@/components/search-box';
import { HeaderSorting } from '@/components/header-sorting';
import ContainerWrapper from '@/components/container-wrapper';
import { getAllActivityLogs } from '@/features/activity-logs/api';

const ActivityLogs = () => {
	const { data, isLoading } = useQuery<HTTPResponse<ActivityLog[]>>({
		queryKey: ['get-all-activity-logs'],
		queryFn: async (): Promise<HTTPResponse<ActivityLog[]>> =>
			await getAllActivityLogs().then((response) => {
				if (response.data.code === 200) {
					return response.data;
				}

				throw new Error('Fetch Department Listing Fail!');
			}),
	});

	const activityLogListColumns: ColumnDef<ActivityLog>[] = [
		{
			id: 'username',
			header: ({ column }) => (
				<HeaderSorting column={column} title="Username" />
			),
			accessorKey: 'username',
		},
		{
			id: 'routeName',
			header: ({ column }) => (
				<HeaderSorting column={column} title="RouteName" />
			),
			accessorKey: 'routeName',
		},
		{
			id: 'browserName',
			header: ({ column }) => (
				<HeaderSorting column={column} title="BrowserName" />
			),
			accessorKey: 'browserName',
		},
	];

	return (
		<>
			<div className="mb-3 flex justify-between">
				<h1 className="font-roboto-slab text-3xl font-semibold">
					Activity Logs
				</h1>
			</div>
			<ContainerWrapper>
				<div className="mb-3 flex gap-5">
					<SearchBox />
				</div>
				<DataTable
					columns={activityLogListColumns}
					isLoading={isLoading}
					data={data?.data ?? []}
				/>
			</ContainerWrapper>
		</>
	);
};

export default ActivityLogs;
