import * as z from 'zod';
import { toast } from 'sonner';
import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Plus, SquarePen, Trash2 } from 'lucide-react';

import DataTable from '@/components/data-table';
import { Button } from '@/components/ui/button';
import SearchBox from '@/components/search-box';
import DeleteDialog from '@/components/delete-dialog';

import { HeaderSorting } from '@/components/header-sorting';
import ContainerWrapper from '@/components/container-wrapper';
import { useDeleteModalStore } from '@/hooks/useDeleteModalStore';
import {
	deleteSpecialization,
	getAllSpecializations,
} from '@/features/specialization/api';
import SpecializationUpdateModal from '@/features/specialization/components/SpecializationUpdateModal';
import SpecializationCreateModal from '@/features/specialization/components/SpecializationCreateModal';

const specializationCreateSchema = z.object({
	name: z.array(z.string()).nonempty('Please at least one item'),
});

const specializationUpdateSchema = z.object({
	name: z.string().min(1, 'Name Required'),
});

export type SpecializationCreateForm = z.infer<
	typeof specializationCreateSchema
>;
export type SpecializationUpdateForm = z.infer<
	typeof specializationUpdateSchema
>;

const SpecializationList = () => {
	const queryClient = useQueryClient();
	const { selectedId, setOpen, setSelectedId } = useDeleteModalStore();

	const [name, setName] = useState('');
	const [openModal, setOpenModal] = useState(false);
	const [specializationId, setSpecializationId] = useState<number | null>(
		null
	);
	const [specializationName, setSpecializationName] = useState('');

	const { data, isLoading } = useQuery<HTTPResponse<Specialization[]>>({
		queryKey: ['get-all-specializations'],
		queryFn: async (): Promise<HTTPResponse<Specialization[]>> =>
			await getAllSpecializations().then((response) => {
				if (response.data.code === 200) {
					return response.data;
				}

				throw new Error('Fetch Specialization Listing Fail!');
			}),
	});

	const { mutateAsync: deleteSpecializationFn } = useMutation<
		HTTPResponse<boolean>,
		unknown,
		number
	>({
		mutationFn: async (id: number): Promise<HTTPResponse<boolean>> =>
			await deleteSpecialization(id)
				.then((response) => {
					if (response.status === 204) {
						queryClient.invalidateQueries({
							queryKey: ['get-all-specializations'],
						});
						setOpen(false);
						setSelectedId(null);
						setName('');
						toast.success('Specialization Deleted Successfully');

						return response.data;
					}

					throw new Error('Specialization Delete Fail!');
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
			deleteSpecializationFn(selectedId);
		}
	};

	const specializationListColumns: ColumnDef<Specialization>[] = [
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
							setSpecializationId(params.row.original.id);
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
					Specialization List
				</h1>
				<Button onClick={() => setOpenModal(true)}>
					<Plus />
					Create Specialization
				</Button>
			</div>
			<ContainerWrapper>
				<div className="mb-3 flex gap-5">
					<SearchBox />
				</div>
				<DataTable
					columns={specializationListColumns}
					isLoading={isLoading}
					data={data?.data ?? []}
				/>
			</ContainerWrapper>

			{specializationId ? (
				<SpecializationUpdateModal
					open={openModal}
					setOpen={setOpenModal}
					id={specializationId}
					specializationName={specializationName}
					setSpecializationName={setSpecializationName}
					setSpecializationId={setSpecializationId}
				/>
			) : (
				<SpecializationCreateModal
					open={openModal}
					setOpen={setOpenModal}
					setSpecializationId={setSpecializationId}
				/>
			)}

			<DeleteDialog
				title="Delete Specialization"
				description={`Are you sure to delete ${name}`}
				handleDelete={handleMutationDelete}
			/>
		</>
	);
};

export default SpecializationList;
