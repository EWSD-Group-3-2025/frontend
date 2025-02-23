import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';

import {
	CircleUser,
	Ellipsis,
	SquarePen,
	Trash2,
	UserPlus,
	UserRoundCheck,
	Users,
} from 'lucide-react';

import { StudentUser } from '@/features/users/types';
import DataTable from '@/components/data-table';
import SearchBox from '@/components/search-box';
import { deleteUser, getAllUsers, showUser } from '@/features/users/api';
import { HeaderSorting } from '@/components/header-sorting';
import ContainerWrapper from '@/components/container-wrapper';
import AccountStatusDropDown from '@/features/users/components/account-status-dropdown';
import { Button } from '@/components/ui/button';
import UserFormModal, {
	UserFormValue,
} from '@/features/users/components/user-form-modal';
import DeleteDialog from '@/components/delete-dialog';
import { useAuth } from '@/context/auth.context';
import { useUserFormModal } from '@/features/users/store/user-form-modal';
import { useDeleteModalStore } from '@/hooks/useDeleteModalStore';
import { toast } from 'sonner';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { USER_ROLE } from '@/constants';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import AllocateTutor from '@/features/users/components/allocate-tutor';
import dayjs from 'dayjs';

const StudentList = () => {
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const { isOpen, setIsOpen } = useUserFormModal();
	const { selectedId, name, setOpen, setSelectedId, setName } =
		useDeleteModalStore();

	const [isOpenAllocationModal, setIsOpenAllocationModal] = useState(false);
	const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
	const [selectedStudent, setSelectedStudent] = useState<StudentUser | null>(
		null
	);

	const { data, isLoading } = useQuery<HTTPResponse<StudentUser[]>>({
		queryKey: ['get-all-users-student'],
		queryFn: async (): Promise<HTTPResponse<StudentUser[]>> => {
			const response = await getAllUsers('role=student');
			if (response.data.code === 200) {
				return response.data as HTTPResponse<StudentUser[]>;
			}

			throw new Error('Fetch Student Listing Fail!');
		},
	});

	const { data: userShow } = useQuery<HTTPResponse<UserFormValue>>({
		queryKey: ['get-user-by-id'],
		queryFn: async (): Promise<HTTPResponse<UserFormValue>> =>
			await showUser(Number(selectedUserId)).then((response) => {
				if (response.data.code === 200) {
					return response.data;
				}

				throw new Error('Fetch User Show Fail!');
			}),
		enabled: !!selectedUserId,
	});

	const { mutateAsync } = useMutation<HTTPResponse<boolean>, unknown, number>(
		{
			mutationFn: async (id: number): Promise<HTTPResponse<boolean>> =>
				await deleteUser(id)
					.then((response) => {
						if (response.data.code === 200) {
							queryClient.invalidateQueries({
								queryKey: ['get-all-users-student'],
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

	const userListColumns: ColumnDef<StudentUser>[] = [
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
			id: 'isAssigned',
			header: ({ column }) => (
				<HeaderSorting column={column} title="Is Assigned" />
			),
			accessorKey: 'allocateTutorId',
			cell: (params) => (
				<>
					{params.row.original.allocateTutorId ? (
						<Badge className="bg-green-200 text-font-black hover:bg-green-200">
							Assigned
						</Badge>
					) : (
						<Badge className="hover:bg-destructive-hover bg-destructive">
							Not Assigned
						</Badge>
					)}
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
							<DropdownMenuGroup>
								<DropdownMenuItem
									disabled={!params.row.original.status}
									onClick={() => {
										setSelectedStudent(params.row.original);
										setIsOpenAllocationModal(true);
									}}
								>
									<UserRoundCheck />{' '}
									{params.row.original.allocateTutorId
										? 'Reallocate'
										: 'Allocate'}{' '}
									Tutor
								</DropdownMenuItem>
							</DropdownMenuGroup>
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
					Student Management
				</h1>
				<div className="">
					<Button
						className="me-2"
						variant="outline"
						onClick={() => setIsOpenAllocationModal(true)}
					>
						<Users className="font-bold" />
						Bulk Allocation
					</Button>
					<Button onClick={() => setIsOpen(true)}>
						<UserPlus className="font-bold" />
						Create Student
					</Button>
				</div>
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
				roleId={3}
				formData={userShow?.data}
				roleName="Student"
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
				setSelectedStudent={setSelectedStudent}
				selectedStudent={selectedStudent}
			/>
		</>
	);
};

export default StudentList;
