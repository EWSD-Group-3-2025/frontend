import ContainerWrapper from '@/components/container-wrapper';
import DataTable from '@/components/data-table';
import DeleteDialog from '@/components/delete-dialog';
import { HeaderSorting } from '@/components/header-sorting';
import ResponsiveModal from '@/components/responsive-modal';
import SearchBox from '@/components/search-box';
import { Button } from '@/components/ui/button';
import { deleteCourse } from '@/features/courses/api';
import { useDeleteModalStore } from '@/hooks/useDeleteModalStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { Plus, SquarePen, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const CourseList = () => {
	const queryClient = useQueryClient();
	const { selectedId, setOpen, setSelectedId } = useDeleteModalStore();

	const [name, setName] = useState('');
	const [openModal, setOpenModal] = useState(false);
	const [courseId, setCourseId] = useState<number | null>(null);

	const { mutateAsync: deleteCourseFn } = useMutation<
		HTTPResponse<boolean>,
		unknown,
		number
	>({
		mutationFn: async (id: number): Promise<HTTPResponse<boolean>> =>
			await deleteCourse(id)
				.then((response) => {
					if (response.data.code === 200) {
						queryClient.invalidateQueries({
							queryKey: ['get-all-users'],
						});
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
	});

	const handleMutationDelete = () => {
		if (selectedId) {
			deleteCourseFn(selectedId);
		}
	};

	const courseListColumns: ColumnDef<Department>[] = [
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

	const data: Department[] = [
		{ id: 1, name: 'Alice Johnson' },
		{ id: 2, name: 'Bob Smith' },
		{ id: 3, name: 'Charlie Brown' },
		{ id: 4, name: 'David Wilson' },
		{ id: 5, name: 'Emily Davis' },
	];

	return (
		<>
			<div className="mb-3 flex justify-between">
				<h1 className="font-roboto-slab text-3xl font-semibold">
					Course List
				</h1>
				<Button onClick={() => setOpenModal(true)}>
					<Plus />
					Create Course
				</Button>
			</div>
			<ContainerWrapper>
				<div className="mb-3 flex gap-5">
					<SearchBox />
				</div>
				<DataTable
					columns={courseListColumns}
					// isLoading={isLoading}
					data={data}
				/>
			</ContainerWrapper>

			<ResponsiveModal isOpen={openModal} setIsOpen={setOpenModal}>
				<div className="p-7">
					<h2 className="font-roboto-slab text-3xl">
						Course {courseId ? 'Update' : 'Create'}
					</h2>
				</div>
			</ResponsiveModal>

			<DeleteDialog
				title="Delete User"
				description={`Are you sure to delete ${name}`}
				handleDelete={handleMutationDelete}
			/>
		</>
	);
};

export default CourseList;
