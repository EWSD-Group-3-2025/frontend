import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { writeToString } from 'fast-csv';
import { saveAs } from 'file-saver';

import {
	ChevronDown,
	Ellipsis,
	Plus,
	SquarePen,
	Trash2,
	UserPlus,
} from 'lucide-react';

import { User } from '@/features/users/types';
import DataTable from '@/components/data-table';
import SearchBox from '@/components/search-box';
import { deleteUser, getAllUsers } from '@/features/users/api';
import { HeaderSorting } from '@/components/header-sorting';
import ContainerWrapper from '@/components/container-wrapper';
import AccountStatusDropDown from '@/features/users/components/account-status-dropdown';
import { Button } from '@/components/ui/button';
import { useUserFormModal } from '@/features/users/store/user-form-modal';
import UserFormModal from '@/features/users/components/user-form-modal';
import { Badge } from '@/components/ui/badge';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDeleteModalStore } from '@/hooks/useDeleteModalStore';
import DeleteDialog from '@/components/delete-dialog';
import { toast } from 'sonner';
import { useState } from 'react';

const AdminList = () => {
	const queryClient = useQueryClient();
	const { isOpen, setIsOpen } = useUserFormModal();
	const { selectedId, name, setOpen, setSelectedId, setName } =
		useDeleteModalStore();

	const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

	const exportToCSV = <T extends Record<string, unknown>>(
		data: T[],
		fileName: string
	) => {
		if (!data.length) {
			console.error('No data available to export.');
			return;
		}

		writeToString(data, { headers: true })
			.then((csvData) => {
				const blob = new Blob([csvData], {
					type: 'text/csv;charset=utf-8;',
				});
				saveAs(blob, `${fileName}.csv`);
			})
			.catch((error) => console.error('CSV Export Error:', error));
	};

	const { data, isLoading } = useQuery<HTTPResponse<User[]>>({
		queryKey: ['get-all-users-admin'],
		queryFn: async (): Promise<HTTPResponse<User[]>> =>
			await getAllUsers('role=admin').then((response) => {
				if (response.data.code === 200) {
					return response.data;
				}

				throw new Error('Fetch Admin Listing Fail!');
			}),
	});

	const { mutateAsync } = useMutation<HTTPResponse<boolean>, unknown, number>(
		{
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
							setName(null);

							return response.data;
						}

						throw new Error('User Delete Fail!');
					})
					.catch((e) => {
						setOpen(false);
						setSelectedId(null);
						setName(null);
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
				<h1 className="font-roboto-slab text-2xl font-semibold transition-all duration-300 ease-linear sm:text-3xl">
					Admin Management
				</h1>
				<Button onClick={() => setIsOpen(true)}>
					<UserPlus className="font-bold" />
					Add Admin
				</Button>
			</div>
			<ContainerWrapper>
				<div className="mb-3 flex justify-between">
					<div className="flex gap-5">
						<SearchBox placeholder="Search admin" />
						<div className="block min-w-32">
							<AccountStatusDropDown />
						</div>
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button className="relative flex items-center justify-between gap-2 rounded-md p-3 text-white shadow-lg">
								<Plus size={18} />
								<span>New</span>
								<ChevronDown className="ms-3" size={18} />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="rounded-lg shadow-lg">
							<DropdownMenuItem
								onClick={() =>
									exportToCSV(
										(data?.data as unknown as Record<
											string,
											unknown
										>[]) ?? [],
										`admin_list${new Date().getTime()}`
									)
								}
							>
								Export as CSV
							</DropdownMenuItem>
							{/* <DropdownMenuItem
								onClick={() => handleExport('XLSX')}
							>
								Export as XLSX
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => handleExport('PDF')}
							>
								Export as PDF
							</DropdownMenuItem> */}
						</DropdownMenuContent>
					</DropdownMenu>
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

			<DeleteDialog
				title="Delete User"
				description={`Are you sure to delete ${name}`}
				handleDelete={handleMutationDelete}
			/>
		</>
	);
};

export default AdminList;
