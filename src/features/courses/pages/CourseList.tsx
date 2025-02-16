import * as z from 'zod';
import { toast } from 'sonner';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ColumnDef } from '@tanstack/react-table';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Plus, SquarePen, Trash2 } from 'lucide-react';

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import DataTable from '@/components/data-table';
import { Button } from '@/components/ui/button';
import SearchBox from '@/components/search-box';
import DeleteDialog from '@/components/delete-dialog';

import {
	createCourse,
	deleteCourse,
	getAllCourses,
	showCourse,
	updateCourse,
} from '@/features/courses/api';
import { Input } from '@/components/ui/input';
import { TagsInput } from '@/components/ui/tags-input';
import { HeaderSorting } from '@/components/header-sorting';
import ResponsiveModal from '@/components/responsive-modal';
import ContainerWrapper from '@/components/container-wrapper';
import { useDeleteModalStore } from '@/hooks/useDeleteModalStore';

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

	// const { data, isLoading } = useQuery<HTTPResponse<Course[]>>({
	// 	queryKey: ['get-all-courses'],
	// 	queryFn: async (): Promise<HTTPResponse<Course[]>> =>
	// 		await getAllCourses().then((response) => {
	// 			if (response.data.code === 200) {
	// 				return response.data;
	// 			}

	// 			throw new Error('Fetch Course Listing Fail!');
	// 		}),
	// });

	// const { data: courseShowData, isLoading } = useQuery<HTTPResponse<Course>>({
	// 	queryKey: ['get-course-by-id'],
	// 	queryFn: async (): Promise<HTTPResponse<Course>> =>
	// 		await showCourse(Number(courseId)).then((response) => {
	// 			if (response.data.code === 200) {
	// 				return response.data;
	// 			}

	// 			throw new Error('Fetch Course Show Fail!');
	// 		}),
	// 	enabled: !!courseId,
	// });

	const { mutateAsync: createCourseFn } = useMutation({
		mutationFn: async (body: CourseCreateForm) =>
			await createCourse(body)
				.then((response) => {
					if (response.data.code === 201) {
						toast.success(response.data.message);
					}
					return response.data;
				})
				.catch((e) => {
					toast.error(e.response?.data?.message ?? 'Request Failed');

					return e.response.data;
				}),
	});

	const { mutateAsync: updateCourseFn } = useMutation({
		mutationFn: async (body: CourseUpdateForm) =>
			await updateCourse(courseId!, { id: courseId!, name: body.name })
				.then((response) => {
					if (response.data.code === 200) {
						toast.success(response.data.message);
					}
					return response.data;
				})
				.catch((e) => {
					toast.error(e.response?.data?.message ?? 'Request Failed');
					return e.response.data;
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
					if (response.data.code === 200) {
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
						onClick={() => {
							setOpenModal(true);
							setCourseId(params.row.original.id);
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

	const data: Department[] = [
		{ id: 1, name: 'Alice Johnson' },
		{ id: 2, name: 'Bob Smith' },
		{ id: 3, name: 'Charlie Brown' },
		{ id: 4, name: 'David Wilson' },
		{ id: 5, name: 'Emily Davis' },
	];

	const createForm = useForm<CourseCreateForm>({
		resolver: zodResolver(courseCreateSchema),
		defaultValues: {
			name: [],
		},
	});

	const updateForm = useForm<CourseUpdateForm>({
		resolver: zodResolver(courseUpdateSchema),
		defaultValues: {
			name: '',
		},
	});

	function onSubmit(values: CourseCreateForm | CourseUpdateForm) {
		if (courseId) {
			updateCourseFn(values as CourseUpdateForm);
		} else {
			createCourseFn(values as CourseCreateForm);
		}
	}

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

			<ResponsiveModal
				className="sm:min-h-[50vh] md:min-h-[30vh]"
				isOpen={openModal}
				setIsOpen={() => {
					setOpenModal(false);
					setCourseId(null);
					createForm.reset();
					updateForm.reset();
				}}
			>
				<div className="p-7">
					<h2 className="mb-5 font-roboto-slab text-3xl">
						Course {courseId ? 'Update' : 'Create'}
					</h2>
					{courseId ? (
						<Form {...updateForm}>
							<form onSubmit={updateForm.handleSubmit(onSubmit)}>
								<FormField
									control={updateForm.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Name</FormLabel>
											<FormControl>
												<Input
													placeholder="Please enter Course Name"
													type=""
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<div className="mt-5 flex justify-end">
									<Button type="submit">Submit</Button>
								</div>
							</form>
						</Form>
					) : (
						<Form {...createForm}>
							<form onSubmit={createForm.handleSubmit(onSubmit)}>
								<FormField
									control={createForm.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Course Name</FormLabel>
											<FormControl>
												<TagsInput
													value={field.value}
													onValueChange={
														field.onChange
													}
													placeholder="Please enter Course Name"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<div className="mt-5 flex justify-end">
									<Button type="submit">Submit</Button>
								</div>
							</form>
						</Form>
					)}
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
