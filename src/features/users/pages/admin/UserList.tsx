import { ColumnDef } from '@tanstack/react-table';

import { cn } from '@/utils/stringUtils';
import { Badge } from '@/components/ui/badge';
import { User } from '@/features/users/types';
import SearchBox from '@/components/search-box';
import DataTable from '@/components/data-table';
import ContainerWrapper from '@/components/container-wrapper';
import { Button } from '@/components/ui/button';
import { Plus, SquarePen, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DeleteDialog from '@/components/delete-dialog';
import { useDeleteModalStore } from '@/hooks/useDeleteModalStore';

const data: User[] = [
	{
		id: 1,
		name: 'John Doe',
		username: 'john-doe-1',
		email: 'john@example.com',
		roleName: 'STAFF',
	},
	{
		id: 2,
		name: 'Jane Smith',
		username: 'jane-smith-2',
		email: 'jane@example.com',
		roleName: 'ADMIN',
	},
	{
		id: 3,
		name: 'Robert Brown',
		username: 'robert-brown-3',
		email: 'robert@example.com',
		roleName: 'ADMIN',
	},
	{
		id: 4,
		name: 'Emily Johnson',
		username: 'emily-johnson-4',
		email: 'emily@example.com',
		roleName: 'STAFF',
	},
	{
		id: 5,
		name: 'Michael Williams',
		username: 'michael-williams-5',
		email: 'michael@example.com',
		roleName: 'TUTOR',
	},
	{
		id: 1,
		name: 'John Doe',
		username: 'john-doe-1',
		email: 'john@example.com',
		roleName: 'STAFF',
	},
	{
		id: 2,
		name: 'Jane Smith',
		username: 'jane-smith-2',
		email: 'jane@example.com',
		roleName: 'ADMIN',
	},
	{
		id: 3,
		name: 'Robert Brown',
		username: 'robert-brown-3',
		email: 'robert@example.com',
		roleName: 'ADMIN',
	},
	{
		id: 4,
		name: 'Emily Johnson',
		username: 'emily-johnson-4',
		email: 'emily@example.com',
		roleName: 'STAFF',
	},
	{
		id: 5,
		name: 'Michael Williams',
		username: 'michael-williams-5',
		email: 'michael@example.com',
		roleName: 'TUTOR',
	},
	{
		id: 1,
		name: 'John Doe',
		username: 'john-doe-1',
		email: 'john@example.com',
		roleName: 'STAFF',
	},
	{
		id: 2,
		name: 'Jane Smith',
		username: 'jane-smith-2',
		email: 'jane@example.com',
		roleName: 'ADMIN',
	},
	{
		id: 3,
		name: 'Robert Brown',
		username: 'robert-brown-3',
		email: 'robert@example.com',
		roleName: 'ADMIN',
	},
	{
		id: 4,
		name: 'Emily Johnson',
		username: 'emily-johnson-4',
		email: 'emily@example.com',
		roleName: 'STAFF',
	},
	{
		id: 5,
		name: 'Michael Williams',
		username: 'michael-williams-5',
		email: 'michael@example.com',
		roleName: 'TUTOR',
	},
	{
		id: 1,
		name: 'John Doe',
		username: 'john-doe-1',
		email: 'john@example.com',
		roleName: 'STAFF',
	},
	{
		id: 2,
		name: 'Jane Smith',
		username: 'jane-smith-2',
		email: 'jane@example.com',
		roleName: 'ADMIN',
	},
	{
		id: 3,
		name: 'Robert Brown',
		username: 'robert-brown-3',
		email: 'robert@example.com',
		roleName: 'ADMIN',
	},
	{
		id: 4,
		name: 'Emily Johnson',
		username: 'emily-johnson-4',
		email: 'emily@example.com',
		roleName: 'STAFF',
	},
	{
		id: 5,
		name: 'Michael Williams',
		username: 'michael-williams-5',
		email: 'michael@example.com',
		roleName: 'STUDENT',
	},
];

const UserList = () => {
	const navigate = useNavigate();
	const { open, setOpen } = useDeleteModalStore();

	const getRoleColor = (status: string) => {
		switch (status) {
			case 'ADMIN':
				return 'bg-badge-admin hover:bg-badge-admin text-font';
			case 'STAFF':
				return 'bg-badge-staff hover:bg-badge-staff text-font';
			case 'STUDENT':
				return 'bg-badge-student hover:bg-badge-student dark:text-font-white';
			case 'TUTOR':
				return 'bg-badge-tutor hover:bg-badge-tutor text-font';
			default:
				return 'bg-secondary';
		}
	};

	const userListColumns: ColumnDef<User>[] = [
		{
			id: 'id',
			header: 'ID',
			accessorKey: 'id',
		},
		{
			id: 'name',
			header: 'Name',
			accessorKey: 'name',
		},
		{
			id: 'email',
			header: 'Email',
			accessorKey: 'email',
		},
		{
			id: 'role',
			header: 'Role',
			accessorKey: 'roleName',

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
			id: 'action',
			header: 'Action',

			cell: (params) => (
				<>
					<Button
						size="sm"
						className="me-3 transition-all duration-300 active:scale-105 dark:text-font-white"
						onClick={() =>
							navigate(
								`/dashboard/admin/users/${params.row.original.id}/update`
							)
						}
					>
						<SquarePen />
					</Button>
					<Button
						size="sm"
						className="bg-red-500 transition-all duration-300 hover:bg-red-500 active:scale-105 dark:text-font-white"
						onClick={() => setOpen(true)}
					>
						<Trash2 />
					</Button>
				</>
			),
		},
	];

	const handleMutationDelete = () => {};

	return (
		<>
			<div className="mb-3 flex justify-between">
				<h1 className="font-roboto-slab text-3xl font-semibold">
					User List
				</h1>
				<Button onClick={() => navigate('create')}>
					<Plus />
					Create User
				</Button>
			</div>
			<ContainerWrapper>
				<SearchBox />

				<DataTable columns={userListColumns} data={data} />
			</ContainerWrapper>

			<DeleteDialog
				title="Testing"
				description="ABCD"
				handleDelete={handleMutationDelete}
			/>
		</>
	);
};

export default UserList;
