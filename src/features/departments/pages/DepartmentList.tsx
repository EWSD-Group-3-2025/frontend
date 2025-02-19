import { toast } from 'sonner';
import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Plus, SquarePen, Trash2 } from 'lucide-react';
import DataTable from '@/components/data-table';
import { Button } from '@/components/ui/button';
import SearchBox from '@/components/search-box';
import DeleteDialog from '@/components/delete-dialog';

import {
	deleteDepartment,
	getAllDepartments,
} from '@/features/departments/api';
import { HeaderSorting } from '@/components/header-sorting';
import ContainerWrapper from '@/components/container-wrapper';
import { useDeleteModalStore } from '@/hooks/useDeleteModalStore';
import DepartmentCreateModal from '@/features/departments/components/DepartmentCreateModal';
import DepartmentUpdateModal from '@/features/departments/components/DepartmentUpdateModal';

const DepartmentList = () => {
	const queryClient = useQueryClient();
	const { selectedId, setOpen, setSelectedId } = useDeleteModalStore();

	const [name, setName] = useState('');
	const [openModal, setOpenModal] = useState(false);
	const [departmentId, setDepartmentId] = useState<number | null>(null);

	const { data, isLoading } = useQuery<HTTPResponse<Department[]>>({
		queryKey: ['get-all-departments'],
		queryFn: async (): Promise<HTTPResponse<Department[]>> =>
			await getAllDepartments().then((response) => {
				if (response.data.code === 200) {
					return response.data;
				}

				throw new Error('Fetch Department Listing Fail!');
			}),
	});

	const { mutateAsync: deleteDepartmentFn } = useMutation<
		HTTPResponse<boolean>,
		unknown,
		number
	>({
		mutationFn: async (id: number): Promise<HTTPResponse<boolean>> =>
			await deleteDepartment(id)
				.then((response) => {
					if (response.status === 204) {
						queryClient.invalidateQueries({
							queryKey: ['get-all-departments'],
						});
						setOpen(false);

						return response.data;
					}

					throw new Error('Department Delete Fail!');
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
	});

	const handleMutationDelete = () => {
		if (selectedId) {
			deleteDepartmentFn(selectedId);
		}
	};

	const departmentListColumns: ColumnDef<Department>[] = [
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
			id: 'action',
			header: 'Action',
			cell: (params) => (
				<div>
					<Button
						size="sm"
						className="me-3 transition-all duration-300 active:scale-105 dark:text-font-white"
						onClick={() => {
							setOpenModal(true);
							setDepartmentId(params.row.original.id);
						}}
					>
						<SquarePen />
					</Button>

					<Button
						size="sm"
						className="bg-red-500 transition-all duration-300 hover:bg-red-500 active:scale-105 dark:text-font-white"
						onClick={() => {
							setName(params.row.original.name);
							setSelectedId(Number(params.row.original.id));
							setOpen(true);
						}}
					>
						<Trash2 />
					</Button>
				</div>
			),
		},
	];

	return (
		<>
			<div className="mb-3 flex justify-between">
				<h1 className="font-roboto-slab text-3xl font-semibold">
					Department List
				</h1>
				<Button onClick={() => setOpenModal(true)}>
					<Plus />
					Create Department
				</Button>
			</div>
			<ContainerWrapper>
				<div className="mb-3 flex gap-5">
					<SearchBox />
				</div>
				<DataTable
					columns={departmentListColumns}
					isLoading={isLoading}
					data={data?.data ?? []}
				/>
			</ContainerWrapper>

			{departmentId ? (
				<DepartmentUpdateModal
					open={openModal}
					setOpen={setOpenModal}
					id={departmentId}
					setDepartmentId={setDepartmentId}
				/>
			) : (
				<DepartmentCreateModal
					open={openModal}
					setOpen={setOpenModal}
					setDepartmentId={setDepartmentId}
				/>
			)}

			<DeleteDialog
				title="Delete User"
				description={`Are you sure to delete ${name}`}
				handleDelete={handleMutationDelete}
			/>
		</>
	);
};

export default DepartmentList;
