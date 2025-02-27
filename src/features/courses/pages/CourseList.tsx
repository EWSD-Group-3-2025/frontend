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

import { deleteCourse, getAllCourses } from '@/features/courses/api';
import { HeaderSorting } from '@/components/header-sorting';
import ContainerWrapper from '@/components/container-wrapper';
import { useDeleteModalStore } from '@/hooks/useDeleteModalStore';
import CourseCreateModal from '@/features/courses/components/CourseCreateModal';
import CourseUpdateModal from '@/features/courses/components/CourseUpdateModal';

const courseCreateSchema = z.object({
	name: z.array(z.string()).nonempty('Please at least one item'),
});

const courseUpdateSchema = z.object({
	name: z.string().min(1, 'Name Required'),
});

export type CourseCreateForm = z.infer<typeof courseCreateSchema>;
export type CourseUpdateForm = z.infer<typeof courseUpdateSchema>;

const CourseList = () => {
	const queryClient = useQueryClient();
	const { selectedId, setOpen, setSelectedId } = useDeleteModalStore();

	const [name, setName] = useState('');
	const [openModal, setOpenModal] = useState(false);
	const [courseId, setCourseId] = useState<number | null>(null);
	const [courseName, setCourseName] = useState('');

	const { data, isLoading } = useQuery<HTTPResponse<Course[]>>({
		queryKey: ['get-all-courses'],
		queryFn: async (): Promise<HTTPResponse<Course[]>> =>
			await getAllCourses().then((response) => {
				if (response.data.code === 200) {
					return response.data;
				}

				throw new Error('Fetch Course Listing Fail!');
			}),
	});

	const { mutateAsync: deleteCourseFn } = useMutation<
		HTTPResponse<boolean>,
		unknown,
		number
	>({
		mutationFn: async (id: number): Promise<HTTPResponse<boolean>> =>
			await deleteCourse(id)
				.then((response) => {
					if (response.status === 204) {
						queryClient.invalidateQueries({
							queryKey: ['get-all-courses'],
						});
						setOpen(false);

						return response.data;
					}

					throw new Error('Course Delete Fail!');
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

	const courseListColumns: ColumnDef<Course>[] = [
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
							setCourseId(params.row.original.id);
							setCourseName(params.row.original.name);
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
					isLoading={isLoading}
					data={data?.data ?? []}
				/>
			</ContainerWrapper>

			{courseId ? (
				<CourseUpdateModal
					open={openModal}
					setOpen={setOpenModal}
					courseName={courseName}
					id={courseId}
					setCourseId={setCourseId}
					setCourseName={setCourseName}
				/>
			) : (
				<CourseCreateModal
					open={openModal}
					setOpen={setOpenModal}
					setCourseId={setCourseId}
				/>
			)}

			<DeleteDialog
				title="Delete Course"
				description={`Are you sure to delete ${name}`}
				handleDelete={handleMutationDelete}
			/>
		</>
	);
};

export default CourseList;
