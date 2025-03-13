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
import ExportButton from '@/components/export-button';
import ResponsiveTitle from '@/components/responsive/responsive-title';
import ResponsiveButton from '@/components/responsive/responsive-button';

const DepartmentList = () => {
	const queryClient = useQueryClient();
	const { selectedId, setOpen, setSelectedId } = useDeleteModalStore();

	const [name, setName] = useState('');
	const [openModal, setOpenModal] = useState(false);
	const [departmentId, setDepartmentId] = useState<number | null>(null);
	const [departmentName, setDepartmentName] = useState('');

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
			deleteDepartmentFn(selectedId);
		}
	};

	const departmentListColumns: ColumnDef<Department>[] = [
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
			id: 'staffName',
			header: 'Created By',
			accessorKey: 'staffName',
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
							setDepartmentName(params.row.original.name);
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
				<ResponsiveTitle title="Department List" />
				<ResponsiveButton
					text="Create Department"
					icon={Plus}
					handleClick={() => setOpenModal(true)}
				/>
			</div>
			<ContainerWrapper>
				<div className="mb-3 flex flex-wrap justify-between gap-3">
					<SearchBox placeholder="Search Department" />
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
					columns={departmentListColumns}
					isLoading={isLoading}
					data={data?.data ?? []}
				/>
			</ContainerWrapper>

			{departmentId ? (
				<DepartmentUpdateModal
					open={openModal}
					setOpen={setOpenModal}
					departmentName={departmentName}
					setDepartmentName={setDepartmentName}
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
				title="Delete Department"
				description={`Are you sure to delete ${name}`}
				handleDelete={handleMutationDelete}
			/>
		</>
	);
};

export default DepartmentList;
