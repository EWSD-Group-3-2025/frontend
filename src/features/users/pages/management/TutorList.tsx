import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';

import {
	CircleUser,
	Ellipsis,
	SquarePen,
	Trash2,
	UserPlus,
	UserRoundCheck,
} from 'lucide-react';

import { User } from '@/features/users/types';
import DataTable from '@/components/data-table';
import SearchBox from '@/components/search-box';
import { deleteUser, getAllUsers } from '@/features/users/api';
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
import { useState } from 'react';
import dayjs from 'dayjs';
import AllocateTutor from '@/features/users/components/allocate-tutor';

const TutorList = () => {
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const { isOpen, setIsOpen } = useUserFormModal();
	const { selectedId, name, setOpen, setSelectedId, setName } =
		useDeleteModalStore();

	const [isOpenAllocationModal, setIsOpenAllocationModal] = useState(false);
	const [selectedTutorId, setSelectedTutorId] = useState<number | null>(null);
	const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

	const { data, isLoading } = useQuery<HTTPResponse<User[]>>({
		queryKey: ['get-all-users-tutor'],
		queryFn: async (): Promise<HTTPResponse<User[]>> =>
			await getAllUsers('role=tutor').then((response) => {
				if (response.data.code === 200) {
					return response.data;
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
							setName(null);

							return response.data;
						}

						throw new Error('User Delete Fail!');
					})
					.catch((e) => {
						setOpen(false);
						setSelectedId(null);
						setName(null);
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
							<DropdownMenuItem
								disabled={!params.row.original.status}
								onClick={() => {
									setSelectedTutorId(params.row.original.id);
									setIsOpenAllocationModal(true);
								}}
							>
								<UserRoundCheck /> Assign Students
							</DropdownMenuItem>
							{user?.roleName === USER_ROLE.ADMIN && (
								<>
									<DropdownMenuGroup>
										<DropdownMenuItem>
											<CircleUser /> View Profile
										</DropdownMenuItem>
									</DropdownMenuGroup>
									<DropdownMenuSeparator />
								</>
							)}
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
										setName(params.row.original.name);
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

	return (
		<>
			<div className="mb-3 flex justify-between">
				<h1 className="font-roboto-slab text-3xl font-semibold">
					Tutor Management
				</h1>
				<Button onClick={() => setIsOpen(true)}>
					<UserPlus className="font-bold" />
					Create Tutor
				</Button>
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

			<UserFormModal
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				selectedUserId={selectedUserId}
				roleId={4}
				roleName="Tutor"
				setSelectedUserId={setSelectedUserId}
			/>

			<DeleteDialog
				title="Delete User"
				description={`Are you sure to delete ${name}`}
				handleDelete={handleMutationDelete}
			/>

			<AllocateTutor
				isOpen={isOpenAllocationModal}
				setIsOpen={setIsOpenAllocationModal}
				selectedTutorId={selectedTutorId}
				setSelectedTutorId={setSelectedTutorId}
			/>
		</>
	);
};

export default TutorList;
