import { ColumnDef } from '@tanstack/react-table';

import { cn } from '@/utils/stringUtils';
import { Badge } from '@/components/ui/badge';
import { User } from '@/features/users/types';
import DataTable from '@/components/data-table';
import ContainerWrapper from '@/components/container-wrapper';
import { Button } from '@/components/ui/button';
import {
	CircleCheck,
	CircleX,
	Eye,
	Plus,
	SquarePen,
	Trash2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DeleteDialog from '@/components/delete-dialog';
import { useDeleteModalStore } from '@/hooks/useDeleteModalStore';
import SearchBox from '@/components/search-box';
import RoleDropDown from '@/features/users/components/role-dropdown';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteUser, getAllUsers } from '@/features/users/api';
import { toast } from 'sonner';
import { useAuth } from '@/context/auth.context';
import { USER_ROLE } from '@/constants';
import { useUserBasePath } from '@/hooks/useUserBasePath';
import { HeaderSorting } from '@/components/header-sorting';
import AccountStatusDropDown from '@/features/users/components/account-status-dropdown';

const UserList = () => {
	const { user } = useAuth();
	const baseURL = useUserBasePath();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { selectedId, setOpen, setSelectedId } = useDeleteModalStore();

	const [name, setName] = useState('');

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

	const { data, isLoading } = useQuery<HTTPResponse<User[]>>({
		queryKey: ['get-all-users'],
		queryFn: async (): Promise<HTTPResponse<User[]>> =>
			await getAllUsers().then((response) => {
				if (response.data.code === 200) {
					return response.data;
				}

				throw new Error('Fetch User Listing Fail!');
			}),
	});

	const { mutateAsync } = useMutation<HTTPResponse<boolean>, unknown, number>(
		{
			mutationFn: async (id: number): Promise<HTTPResponse<boolean>> =>
				await deleteUser(id)
					.then((response) => {
						if (response.data.code === 200) {
							queryClient.invalidateQueries({
								queryKey: ['get-all-users'],
							});
							toast.success(response.data.message);
							setOpen(false);

							return response.data;
						}

						throw new Error('User Delete Fail!');
					})
					.catch((e) => {
						setOpen(false);
						toast.error(e.response.data.message ?? 'Request Fail', {
							description:
								e.response?.data?.data ??
								'Something went wrong. Please try again.',
						});
						throw e;
					}),
		}
	);

	const handleMutationDelete = () => {
		if (selectedId) {
			mutateAsync(selectedId);
		}
	};

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
					{params.row.original.roleName?.toLocaleLowerCase()}
				</Badge>
			),
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
		{
			id: 'action',
			header: 'Action',
			cell: (params) => (
				<div>
					<Button
						size="sm"
						className="me-3 transition-all duration-300 active:scale-105 dark:text-font-white"
						onClick={() =>
							navigate(
								`${baseURL}/users/${params.row.original.id}/update`
							)
						}
					>
						<SquarePen />
					</Button>

					{user?.roleName === USER_ROLE.ADMIN && (
						<Button
							size="sm"
							className="bg-red-500 transition-all duration-300 hover:bg-red-500 active:scale-105 dark:text-font-white"
							disabled={!params.row.original.status}
							onClick={() => {
								setName(params.row.original.name);
								setSelectedId(params.row.original.id);
								setOpen(true);
							}}
						>
							<Trash2 />
						</Button>
					)}
					{user?.roleName === USER_ROLE.ADMIN &&
						user.id !== params.row.original.id &&
						params.row.original.roleName !== USER_ROLE.ADMIN && (
							<Button
								size="sm"
								variant="outline"
								className="ms-3 transition-all duration-300 active:scale-105 dark:text-font-white"
								onClick={() =>
									navigate(
										`/dashboard/${params.row.original.name}`
									)
								}
							>
								<Eye />
							</Button>
						)}
				</div>
			),
		},
	];

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
				<div className="mb-3 flex gap-5">
					<SearchBox />
					<div className="block min-w-32">
						<RoleDropDown />
					</div>
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

			<DeleteDialog
				title="Delete User"
				description={`Are you sure to delete ${name}`}
				handleDelete={handleMutationDelete}
			/>
		</>
	);
};

export default UserList;
