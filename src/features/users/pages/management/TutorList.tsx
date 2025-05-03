import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';

import {
	CircleUser,
	Ellipsis,
	Power,
	PowerOff,
	RefreshCcw,
	SquareAsterisk,
	SquarePen,
	Trash2,
	UserPlus,
	UserRoundCheck,
	UserRoundX,
} from 'lucide-react';

import { TutorUser } from '@/features/users/types';
import DataTable from '@/components/data-table';
import SearchBox from '@/components/search-box';
import {
	changeUserStatus,
	deallocation,
	deleteUser,
	getAllUsers,
	resetPasswordByAdmin,
} from '@/features/users/api';
import { HeaderSorting } from '@/components/header-sorting';
import ContainerWrapper from '@/components/container-wrapper';
import AccountStatusDropDown from '@/features/users/components/account-status-dropdown';
import { useAuth } from '@/context/auth.context';
import { useUserFormModal } from '@/features/users/store/user-form-modal';
import { useDeleteModalStore } from '@/hooks/useDeleteModalStore';
import { toast } from 'sonner';
import UserFormModal from '@/features/users/components/user-form-modal';
import DeleteDialog from '@/components/delete-dialog';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { USER_ROLE } from '@/constants';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import AllocateTutor from '@/features/users/components/allocate-tutor';
import ExportButton from '@/components/export-button';
import ResetPasswordConfirmationModal from '@/features/users/components/reset-password-confirmation-modal';
import Deallocation from '@/features/users/components/deallocation';
import { useNavigate } from 'react-router-dom';
import TransferStudentModal from '@/features/users/components/transfer-student-modal';
import { getGenderName } from '@/utils';
import ResponsiveTitle from '@/components/responsive/responsive-title';
import ResponsiveButton from '@/components/responsive/responsive-button';
import ChangeStatusToggleModal from '@/features/users/components/change-status-toggle-modal';

const TutorList = () => {
	const { user } = useAuth();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { isOpen, setIsOpen } = useUserFormModal();
	const {
		selectedId,
		name: deletedName,
		setOpen,
		setSelectedId,
		setName: setDeletedName,
	} = useDeleteModalStore();

	const [selectedTutorName, setSelectedTutorName] = useState('');
	const [selectedTutorId, setSelectedTutorId] = useState<number | null>(null);
	const [isOpenAllocationModal, setIsOpenAllocationModal] = useState(false);
	const [
		deallocationStudentConfirmation,
		setDeallocationStudentConfirmation,
	] = useState(false);
	const [resetPasswordUserId, setResetPasswordUserId] = useState<
		number | null
	>(null);
	const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
	const [resetPasswordConfirmation, setResetPasswordConfirmation] =
		useState(false);
	const [isTransferStudentModal, setIsTransferStudentModal] = useState(false);
	const [statusUserId, setStatusUserId] = useState<number | null>(null);
	const [statusOpen, setStatusOpen] = useState(false);

	const { data, isLoading, refetch } = useQuery<HTTPResponse<TutorUser[]>>({
		queryKey: ['get-all-users-tutor'],
		queryFn: async (): Promise<HTTPResponse<TutorUser[]>> =>
			await getAllUsers('role=tutor').then((response) => {
				if (response.data.code === 200) {
					return response.data as HTTPResponse<TutorUser[]>;
				}

				throw new Error('Fetch Tutor Listing Fail!');
			}),
	});

	const { mutateAsync } = useMutation<HTTPResponse<boolean>, unknown, number>(
		{
			mutationFn: async (id: number): Promise<HTTPResponse<boolean>> =>
				await deleteUser(id)
					.then((response) => {
						if (response.data.code === 200) {
							queryClient.invalidateQueries({
								queryKey: ['get-all-users-tutor'],
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
			await resetPasswordByAdmin(`userId=${resetPasswordUserId}`)
				.then((response) => {
					if (response.data.code === 200) {
						toast.success(response.data.message);
						setResetPasswordConfirmation(false);
						setSelectedTutorName('');
						setResetPasswordUserId(null);

						return response.data;
					}

					throw new Error('Reset Password Fail!');
				})
				.catch((e) => {
					setResetPasswordConfirmation(false);
					setSelectedTutorName('');
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

	const { mutateAsync: handleDeallocationStudents } = useMutation({
		mutationFn: async (): Promise<HTTPResponse<boolean>> =>
			await deallocation(`tutorId=${selectedTutorId}`)
				.then((response) => {
					if (response.status === 204) {
						toast.success(
							`${selectedTutorName}'s students are deallocated`
						);
						setDeallocationStudentConfirmation(false);
						setSelectedTutorName('');

						return response.data;
					}

					throw new Error('Deallocation Fail!');
				})
				.catch((e) => {
					setDeallocationStudentConfirmation(false);
					setSelectedTutorName('');
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

	const userListColumns: ColumnDef<TutorUser>[] = [
		{
			id: 'no',
			header: 'No.',
			cell: (params) => params.row.index + 1,
		},
		{
			id: 'username',
			header: ({ column }) => (
				<HeaderSorting column={column} title="UserName" />
			),
			accessorKey: 'username',
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
			id: 'specialization',
			header: ({ column }) => (
				<HeaderSorting column={column} title="Specialization" />
			),
			accessorKey: 'specializationName',
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
												`/dashboard/management/tutor/${params.row.original.id}`
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
										setSelectedTutorName(
											params.row.original.name
										);
										setResetPasswordUserId(
											params.row.original.id
										);
									}}
								>
									<SquareAsterisk /> Reset Password
								</DropdownMenuItem>

								<DropdownMenuSeparator />
							</DropdownMenuGroup>

							<DropdownMenuGroup>
								<DropdownMenuItem
									disabled={!params.row.original.status}
									onClick={() => {
										setSelectedTutorId(
											params.row.original.id
										);
										setIsOpenAllocationModal(true);
									}}
								>
									<UserRoundCheck /> Assign Students
								</DropdownMenuItem>

								<DropdownMenuItem
									disabled={!params.row.original.status}
									onClick={() => {
										setDeallocationStudentConfirmation(
											true
										);
										setSelectedTutorId(
											params.row.original.id
										);
										setSelectedTutorName(
											params.row.original.name
										);
									}}
								>
									<UserRoundX /> Deallocate Students
								</DropdownMenuItem>

								<DropdownMenuItem
									disabled={!params.row.original.status}
									onClick={() => {
										setIsTransferStudentModal(true);
										setSelectedTutorName(
											params.row.original.name
										);
										setSelectedTutorId(
											params.row.original.id
										);
									}}
								>
									<RefreshCcw /> Transfer Students
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
			key: 'specializationName',
			header: 'Specialization',
		},
		{
			key: 'genderName',
			header: 'Gender',
		},
	];

	useEffect(() => {
		if (!resetPasswordConfirmation) {
			setSelectedTutorName('');
		}
	}, [resetPasswordConfirmation]);

	useEffect(() => {
		if (!deallocationStudentConfirmation) {
			setSelectedTutorName('');
			setSelectedTutorId(null);
		}
	}, [deallocationStudentConfirmation]);

	useEffect(() => {
		if (!isTransferStudentModal) {
			setSelectedTutorId(null);
			setSelectedTutorName('');
		}
	}, []);

	return (
		<>
			<div className="mb-3 flex justify-between">
				<ResponsiveTitle title="Tutor Management" />
				<ResponsiveButton
					text="Add Tutor"
					icon={UserPlus}
					handleClick={() => setIsOpen(true)}
				/>
			</div>
			<ContainerWrapper>
				<div className="mb-3 flex flex-wrap justify-between gap-3">
					<div className="flex flex-wrap gap-3">
						<SearchBox placeholder="Search Tutor" />
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
							fileName="tutor_list"
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
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				selectedUserId={selectedUserId}
				roleId={4}
				roleName="Tutor"
				setSelectedUserId={setSelectedUserId}
			/>

			<ResetPasswordConfirmationModal
				name={selectedTutorName}
				isOpen={resetPasswordConfirmation}
				setIsOpen={setResetPasswordConfirmation}
				handleReset={() => handleResetPassword()}
			/>

			{selectedTutorId && selectedTutorName && (
				<TransferStudentModal
					isOpen={isTransferStudentModal}
					setIsOpen={setIsTransferStudentModal}
					tutorData={{
						id: selectedTutorId,
						name: selectedTutorName,
					}}
					tutorList={data?.data ?? []}
				/>
			)}

			<Deallocation
				type="tutor"
				name={selectedTutorName}
				isOpen={deallocationStudentConfirmation}
				setIsOpen={setDeallocationStudentConfirmation}
				handleReset={() => handleDeallocationStudents()}
			/>

			<DeleteDialog
				title="Delete User"
				description={`Are you sure to delete ${deletedName}`}
				handleDelete={handleMutationDelete}
			/>

			<AllocateTutor
				isOpen={isOpenAllocationModal}
				setIsOpen={setIsOpenAllocationModal}
				selectedTutorId={selectedTutorId}
				setSelectedTutorId={setSelectedTutorId}
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

export default TutorList;
