import dayjs from 'dayjs';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
	Ellipsis,
	SquareAsterisk,
	SquarePen,
	Trash2,
	UserPlus,
	Power,
	PowerOff,
} from 'lucide-react';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User } from '@/features/users/types';
import { Badge } from '@/components/ui/badge';
import DataTable from '@/components/data-table';
import SearchBox from '@/components/search-box';
import { Button } from '@/components/ui/button';
import DeleteDialog from '@/components/delete-dialog';
import ExportButton from '@/components/export-button';
import { HeaderSorting } from '@/components/header-sorting';
import ContainerWrapper from '@/components/container-wrapper';
import {
	changeUserStatus,
	deleteUser,
	getAllUsers,
	resetPasswordByAdmin,
} from '@/features/users/api';
import { useDeleteModalStore } from '@/hooks/useDeleteModalStore';
import UserFormModal from '@/features/users/components/user-form-modal';
import { useUserFormModal } from '@/features/users/store/user-form-modal';
import AccountStatusDropDown from '@/features/users/components/account-status-dropdown';
import ResetPasswordConfirmationModal from '@/features/users/components/reset-password-confirmation-modal';
import { getGenderName } from '@/utils';
import ResponsiveTitle from '@/components/responsive/responsive-title';
import ResponsiveButton from '@/components/responsive/responsive-button';
import ChangeStatusToggleModal from '@/features/users/components/change-status-toggle-modal';

const AdminList = () => {
	const queryClient = useQueryClient();
	const { isOpen, setIsOpen } = useUserFormModal();
	const {
		selectedId,
		name: deletedName,
		setOpen,
		setSelectedId,
		setName: setDeletedName,
	} = useDeleteModalStore();

	const [name, setName] = useState('');
	const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
	const [resetPasswordConfirmation, setResetPasswordConfirmation] =
		useState(false);
	const [statusUserId, setStatusUserId] = useState<number | null>(null);
	const [statusOpen, setStatusOpen] = useState(false);

	const { data, isLoading, refetch } = useQuery<HTTPResponse<User[]>>({
		queryKey: ['get-all-users-admin'],
		queryFn: async (): Promise<HTTPResponse<User[]>> =>
			await getAllUsers('role=admin').then((response) => {
				if (response.data.code === 200) {
					return response.data;
				}

				throw new Error('Fetch Admin Listing Fail!');
			}),
	});

	const { mutateAsync: handleUserDelete } = useMutation<
		HTTPResponse<boolean>,
		unknown,
		number
	>({
		mutationFn: async (id: number): Promise<HTTPResponse<boolean>> =>
			await deleteUser(id)
				.then((response) => {
					if (response.data.code === 200) {
						queryClient.invalidateQueries({
							queryKey: ['get-all-users-admin'],
						});
						toast.success(response.data.message);
						setOpen(false);
						setSelectedId(null);
						setDeletedName(null);

						return response.data;
					}

					throw new Error('User Delete Fail!');
				})
				.catch((e) => {
					setOpen(false);
					setSelectedId(null);
					setDeletedName(null);
					toast.error(e.response?.data?.data ?? 'Request Failed', {
						description:
							e.response?.data?.message ??
							'Something wrong plz try again',
					});
					throw e;
				}),
	});

	const { mutateAsync: handleResetPassword } = useMutation({
		mutationFn: async (): Promise<HTTPResponse<boolean>> =>
			await resetPasswordByAdmin()
				.then((response) => {
					if (response.data.code === 200) {
						toast.success(response.data.message);
						setResetPasswordConfirmation(false);
						setName('');

						return response.data;
					}

					throw new Error('Reset Password Fail!');
				})
				.catch((e) => {
					setResetPasswordConfirmation(false);
					setName('');
					toast.error(e.response?.data?.data ?? 'Request Failed', {
						description:
							e.response?.data?.message ??
							'Something wrong plz try again',
					});
					throw e;
				}),
	});

	const { mutateAsync: toggleUserStatus } = useMutation({
		mutationFn: async (id: number) =>
			await changeUserStatus(id)
				.then((response) => {
					if (response.data.code === 200) {
						toast.success(response.data.message);
						setStatusOpen(false);
						setStatusUserId(null);
						refetch();
					}
				})
				.catch((e) => {
					setStatusOpen(false);
					setStatusUserId(null);
					toast.error(e.response?.data?.data ?? 'Request Failed', {
						description:
							e.response?.data?.message ??
							'Something wrong plz try again',
					});
					throw e;
				}),
	});

	const handleToggleStatus = () => {
		if (statusUserId) {
			toggleUserStatus(statusUserId);
		}
	};

	const handleMutationDelete = () => {
		if (selectedId) {
			handleUserDelete(selectedId);
		}
	};

	const userListColumns: ColumnDef<User>[] = [
		{ id: 'no', header: 'No.', cell: (params) => params.row.index + 1 },
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
			id: 'department',
			header: ({ column }) => (
				<HeaderSorting column={column} title="Department" />
			),
			accessorKey: 'departmentName',
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
			id: 'status',
			header: 'Status',
			accessorKey: 'status',
			cell: (params) => (
				<>
					{params.row.original.status ? (
						<Badge className="bg-green-200 text-font-black hover:bg-green-200">
							Available
						</Badge>
					) : (
						<Badge className="hover:bg-destructive-hover bg-destructive">
							Unavailable
						</Badge>
					)}
				</>
			),
		},
		{
			id: 'created_at',
			header: ({ column }) => (
				<HeaderSorting column={column} title="Register At" />
			),
			accessorKey: 'created_at',
			cell: (params) =>
				dayjs(params.row.original.createdAt).format('YYYY-MM-DD'),
		},
		{
			id: 'action',
			header: 'Action',
			accessorKey: 'action',
			cell: (params) => (
				<>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost">
								<Ellipsis />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-56">
							<DropdownMenuGroup>
								<DropdownMenuItem
									disabled={!params.row.original.status}
									onClick={() => {
										setResetPasswordConfirmation(true);
										setName(params.row.original.name);
									}}
								>
									<SquareAsterisk /> Reset Password
								</DropdownMenuItem>
								<DropdownMenuSeparator />
							</DropdownMenuGroup>
							<DropdownMenuGroup>
								<DropdownMenuItem
									onClick={() => {
										setIsOpen(true);
										setSelectedUserId(
											params.row.original.id
										);
									}}
								>
									<SquarePen /> Edit
								</DropdownMenuItem>
								<DropdownMenuItem
									disabled={!params.row.original.status}
									onClick={() => {
										setDeletedName(
											params.row.original.name
										);
										setSelectedId(params.row.original.id);
										setOpen(true);
									}}
								>
									<Trash2 /> Delete
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => {
										setStatusUserId(params.row.original.id);
										setStatusOpen(true);
									}}
								>
									{params.row.original.status ? (
										<>
											<PowerOff /> Make Inactive
										</>
									) : (
										<>
											<Power /> Make Active
										</>
									)}
								</DropdownMenuItem>
							</DropdownMenuGroup>
						</DropdownMenuContent>
					</DropdownMenu>
				</>
			),
		},
	];

	const exportColumns = [
		{
			key: 'id',
			header: 'ID',
		},
		{
			key: 'name',
			header: 'Name',
		},
		{
			key: 'email',
			header: 'Email',
		},
		{
			key: 'username',
			header: 'Username',
		},
		{
			key: 'departmentName',
			header: 'Department',
		},
		{
			key: 'genderName',
			header: 'Gender',
		},
	];

	useEffect(() => {
		if (!resetPasswordConfirmation) {
			setName('');
		}
	}, [resetPasswordConfirmation]);

	return (
		<>
			<div className="mb-3 flex justify-between">
				<ResponsiveTitle title="Admin Management" />
				<ResponsiveButton
					text="Add Admin"
					icon={UserPlus}
					handleClick={() => setIsOpen(true)}
				/>
			</div>
			<ContainerWrapper>
				<div className="mb-3 flex flex-wrap justify-between gap-3">
					<div className="flex flex-wrap gap-3">
						<SearchBox placeholder="Search Admin" />
						<div className="block min-w-32">
							<AccountStatusDropDown />
						</div>
					</div>
					{data && data.data.length > 0 && !isLoading && (
						<ExportButton
							data={
								data.data as unknown as Record<
									string,
									unknown
								>[]
							}
							columns={exportColumns}
							fileName="admin_list"
						/>
					)}
				</div>
				<DataTable
					columns={userListColumns}
					isLoading={isLoading}
					data={data?.data ?? []}
				/>
			</ContainerWrapper>

			<UserFormModal
				roleId={1}
				roleName="Admin"
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				selectedUserId={selectedUserId}
				setSelectedUserId={setSelectedUserId}
			/>

			<ResetPasswordConfirmationModal
				name={name}
				isOpen={resetPasswordConfirmation}
				setIsOpen={setResetPasswordConfirmation}
				handleReset={() => handleResetPassword()}
			/>

			<DeleteDialog
				title="Delete User"
				description={`Are you sure to delete ${deletedName}`}
				handleDelete={handleMutationDelete}
			/>

			<ChangeStatusToggleModal
				open={statusOpen}
				setOpen={setStatusOpen}
				title="Change User Status"
				description="Are u sure to change the status"
				handleStatus={handleToggleStatus}
			/>
		</>
	);
};

export default AdminList;
