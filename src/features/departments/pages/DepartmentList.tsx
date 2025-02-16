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
	createDepartment,
	deleteDepartment,
	getAllDepartments,
	showDepartment,
	updateDepartment,
} from '@/features/departments/api';
import { Input } from '@/components/ui/input';
import { TagsInput } from '@/components/ui/tags-input';
import { HeaderSorting } from '@/components/header-sorting';
import ResponsiveModal from '@/components/responsive-modal';
import ContainerWrapper from '@/components/container-wrapper';
import { useDeleteModalStore } from '@/hooks/useDeleteModalStore';

const departmentCreateSchema = z.object({
	name: z.array(z.string()).nonempty('Please at least one item'),
});

const departmentUpdateSchema = z.object({
	name: z.string().min(1, 'Name Required'),
});

export type DepartmentCreateForm = z.infer<typeof departmentCreateSchema>;
export type DepartmentUpdateForm = z.infer<typeof departmentUpdateSchema>;

const DepartmentList = () => {
	const queryClient = useQueryClient();
	const { selectedId, setOpen, setSelectedId } = useDeleteModalStore();

	const [name, setName] = useState('');
	const [openModal, setOpenModal] = useState(false);
	const [departmentId, setDepartmentId] = useState<number | null>(null);

	// const { data, isLoading } = useQuery<HTTPResponse<Department[]>>({
	// 	queryKey: ['get-all-departments'],
	// 	queryFn: async (): Promise<HTTPResponse<Department[]>> =>
	// await getAllDepartments().then((response) => {
	// 			if (response.data.code === 200) {
	// 				return response.data;
	// 			}

	// 			throw new Error('Fetch Department Listing Fail!');
	// 		}),
	// });

	// const { data: departmentShowData, isLoading } = useQuery<HTTPResponse<Department>>({
	// 	queryKey: ['get-department-by-id'],
	// 	queryFn: async (): Promise<HTTPResponse<Department>> =>
	// await showDepartments(Number(departmentId)).then((response) => {
	// 			if (response.data.code === 200) {
	// 				return response.data;
	// 			}

	// 			throw new Error('Fetch Department Show Fail!');
	// 		}),
	// 	enabled: !!departmentId,
	// });

	const { mutateAsync: createDepartmentFn } = useMutation({
		mutationFn: async (body: DepartmentCreateForm) =>
			await createDepartment(body)
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

	const { mutateAsync: updateDepartmentFn } = useMutation({
		mutationFn: async (body: DepartmentUpdateForm) =>
			await updateDepartment(departmentId!, {
				id: departmentId!,
				name: body.name,
			})
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

	const { mutateAsync: deleteDepartmentFn } = useMutation<
		HTTPResponse<boolean>,
		unknown,
		number
	>({
		mutationFn: async (id: number): Promise<HTTPResponse<boolean>> =>
			await deleteDepartment(id)
				.then((response) => {
					if (response.data.code === 200) {
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

	const data: Department[] = [
		{ id: 1, name: 'Alice Johnson' },
		{ id: 2, name: 'Bob Smith' },
		{ id: 3, name: 'Charlie Brown' },
		{ id: 4, name: 'David Wilson' },
		{ id: 5, name: 'Emily Davis' },
	];

	const createForm = useForm<DepartmentCreateForm>({
		resolver: zodResolver(departmentCreateSchema),
		defaultValues: {
			name: [],
		},
	});

	const updateForm = useForm<DepartmentUpdateForm>({
		resolver: zodResolver(departmentUpdateSchema),
		defaultValues: {
			name: '',
		},
	});

	function onSubmit(values: DepartmentCreateForm | DepartmentUpdateForm) {
		if (departmentId) {
			updateDepartmentFn(values as DepartmentUpdateForm);
		} else {
			createDepartmentFn(values as DepartmentCreateForm);
		}
	}

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
					// isLoading={isLoading}
					data={data}
				/>
			</ContainerWrapper>

			<ResponsiveModal
				className="sm:min-h-[50vh] md:min-h-[30vh]"
				isOpen={openModal}
				setIsOpen={() => {
					setOpenModal(false);
					setDepartmentId(null);
					createForm.reset();
					updateForm.reset();
				}}
			>
				<div className="p-7">
					<h2 className="mb-5 font-roboto-slab text-3xl">
						Department {departmentId ? 'Update' : 'Create'}
					</h2>
					{departmentId ? (
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
													placeholder="Please enter Name"
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
											<FormLabel>Name</FormLabel>
											<FormControl>
												<TagsInput
													value={field.value}
													onValueChange={
														field.onChange
													}
													placeholder="Please enter Name"
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

export default DepartmentList;
