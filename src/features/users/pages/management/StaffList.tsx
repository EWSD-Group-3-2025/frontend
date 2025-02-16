import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';

import { CircleCheck, CircleX } from 'lucide-react';

import { User } from '@/features/users/types';
import DataTable from '@/components/data-table';
import SearchBox from '@/components/search-box';
import { getAllUsers } from '@/features/users/api';
import { HeaderSorting } from '@/components/header-sorting';
import ContainerWrapper from '@/components/container-wrapper';
import AccountStatusDropDown from '@/features/users/components/account-status-dropdown';

const StaffList = () => {
	const { data, isLoading } = useQuery<HTTPResponse<User[]>>({
		queryKey: ['get-all-staff-users'],
		queryFn: async (): Promise<HTTPResponse<User[]>> =>
			await getAllUsers('role=staff').then((response) => {
				if (response.data.code === 200) {
					return response.data;
				}

				throw new Error('Fetch Staff Listing Fail!');
			}),
	});

	const userListColumns: ColumnDef<User>[] = [
		{
			id: 'id',
			header: ({ column }) => (
				<HeaderSorting column={column} title="ID" />
			),
			accessorKey: 'id',
		},
		{
			id: 'name',
			header: ({ column }) => (
				<HeaderSorting column={column} title="Name" />
			),
			accessorKey: 'name',
		},
		{
			id: 'email',
			header: ({ column }) => (
				<HeaderSorting column={column} title="Email" />
			),
			accessorKey: 'email',
		},
		{
			id: 'department',
			header: ({ column }) => (
				<HeaderSorting column={column} title="Department" />
			),
			accessorKey: 'department',
		},
		{
			id: 'status',
			header: 'Status',
			accessorKey: 'status',
			cell: (params) => (
				<>
					{params.row.original.status ? (
						<CircleCheck className="size-4 text-green-400" />
					) : (
						<CircleX className="size-4 text-destructive" />
					)}
				</>
			),
		},
	];

	return (
		<>
			<div className="mb-3 flex justify-between">
				<h1 className="font-roboto-slab text-3xl font-semibold">
					Staff List
				</h1>
			</div>
			<ContainerWrapper>
				<div className="mb-3 flex gap-5">
					<SearchBox />
					<div className="block min-w-32">
						<AccountStatusDropDown />
					</div>
				</div>
				<DataTable
					columns={userListColumns}
					isLoading={isLoading}
					data={data?.data ?? []}
				/>
			</ContainerWrapper>
		</>
	);
};

export default StaffList;
