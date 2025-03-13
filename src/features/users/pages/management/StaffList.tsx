import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';

import {
	CircleUser,
	Ellipsis,
	SquareAsterisk,
	SquarePen,
	Trash2,
	UserPlus,
} from 'lucide-react';

import { User } from '@/features/users/types';
import DataTable from '@/components/data-table';
import SearchBox from '@/components/search-box';
import {
	deleteUser,
	getAllUsers,
	resetPasswordByAdmin,
} from '@/features/users/api';
import { HeaderSorting } from '@/components/header-sorting';
import ContainerWrapper from '@/components/container-wrapper';
import AccountStatusDropDown from '@/features/users/components/account-status-dropdown';
import UserFormModal from '@/features/users/components/user-form-modal';
import DeleteDialog from '@/components/delete-dialog';
import { useUserFormModal } from '@/features/users/store/user-form-modal';
import { useDeleteModalStore } from '@/hooks/useDeleteModalStore';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { USER_ROLE } from '@/constants';
import { useAuth } from '@/context/auth.context';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import ExportButton from '@/components/export-button';
import ResetPasswordConfirmationModal from '@/features/users/components/reset-password-confirmation-modal';
import { useNavigate } from 'react-router-dom';
import { getGenderName } from '@/utils';
import ResponsiveTitle from '@/components/responsive/responsive-title';
import ResponsiveButton from '@/components/responsive/responsive-button';

const StaffList = () => {
	const queryClient = useQueryClient();
	const { user } = useAuth();
	const navigate = useNavigate();
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

	const { data, isLoading } = useQuery<HTTPResponse<User[]>>({
		queryKey: ['get-all-users-staff'],
		queryFn: async (): Promise<HTTPResponse<User[]>> =>
			await getAllUsers('role=staff').then((response) => {
				if (response.data.code === 200) {
					return response.data;
				}

				throw new Error('Fetch Staff Listing Fail!');
			}),
	});

	const { mutateAsync } = useMutation<HTTPResponse<boolean>, unknown, number>(
		{
			mutationFn: async (id: number): Promise<HTTPResponse<boolean>> =>
				await deleteUser(id)
					.then((response) => {
						if (response.data.code === 200) {
							queryClient.invalidateQueries({
								queryKey: ['get-all-users-staff'],
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
						toast.error(
							e.response?.data?.data ?? 'Request Failed',
							{
								description:
									e.response?.data?.message ??
									'Something wrong plz try again',
							}
						);
						throw e;
					}),
		}
	);

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

	const handleMutationDelete = () => {
		if (selectedId) {
			mutateAsync(selectedId);
		}
	};

	const userListColumns: ColumnDef<User>[] = [
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
								{user?.roleName === USER_ROLE.ADMIN && (
									<DropdownMenuItem
										onClick={() =>
											navigate(
												`/dashboard/management/staff/${params.row.original.id}`
											)
										}
									>
										<CircleUser /> View Profile
									</DropdownMenuItem>
								)}
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
							</DropdownMenuGroup>
						</DropdownMenuContent>
					</DropdownMenu>
				</>
			),
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
				<ResponsiveTitle title="Staff Management" />
				<ResponsiveButton
					text="Add Staff"
					icon={UserPlus}
					handleClick={() => setIsOpen(true)}
				/>
			</div>
			<ContainerWrapper>
				<div className="mb-3 flex flex-wrap justify-between gap-3">
					<div className="flex flex-wrap gap-3">
						<SearchBox placeholder="Search Staff" />
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
				roleId={2}
				roleName="Staff"
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
		</>
	);
};

export default StaffList;
