import * as z from 'zod';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { Dispatch, SetStateAction } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import ResponsiveModal from '@/components/responsive-modal';
import { showDepartment, updateDepartment } from '@/features/departments/api';
import { Input } from '@/components/ui/input';

type DepartmentCreateModalProp = {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	setDepartmentId: Dispatch<SetStateAction<number | null>>;
	id: number;
};

const departmentUpdateSchema = z.object({
	name: z.string().min(1, 'Name Required'),
});

export type DepartmentUpdateForm = z.infer<typeof departmentUpdateSchema>;

const DepartmentUpdateModal = ({
	open,
	setOpen,
	setDepartmentId,
	id,
}: DepartmentCreateModalProp) => {
	const queryClient = useQueryClient();

	useQuery<HTTPResponse<Department>>({
		queryKey: ['get-department-by-id'],
		queryFn: async (): Promise<HTTPResponse<Department>> =>
			await showDepartment(id).then((response) => {
				if (response.data.code === 200) {
					form.reset({ name: response.data.data.name });
					return response.data;
				}

				throw new Error('Fetch Department Show Fail!');
			}),
		enabled: !!id,
	});

	const { mutateAsync } = useMutation({
		mutationFn: async (body: DepartmentUpdateForm) =>
			await updateDepartment(id, {
				id: id,
				name: body.name,
			})
				.then((response) => {
					if (response.status === 204) {
						queryClient.invalidateQueries({
							queryKey: ['get-all-departments'],
						});
						setDepartmentId(null);
						form.reset({
							name: '',
						});
						setOpen(false);
						toast.success('Department Updated Successfully');
					}
					return response.data;
				})
				.catch((e) => {
					toast.error(e.response?.data?.message ?? 'Request Failed');
					return e.response.data;
				}),
	});

	const form = useForm<DepartmentUpdateForm>({
		resolver: zodResolver(departmentUpdateSchema),
		defaultValues: {
			name: '',
		},
	});

	function onSubmit(values: DepartmentUpdateForm) {
		mutateAsync(values);
	}

	return (
		<ResponsiveModal
			className="sm:min-h-[50vh] md:min-h-[30vh]"
			isOpen={open}
			setIsOpen={() => {
				setOpen(false);
				setDepartmentId(null);
				form.reset({
					name: '',
				});
			}}
		>
			<div className="p-7">
				<h2 className="mb-5 font-roboto-slab text-3xl">
					Department Update
				</h2>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							control={form.control}
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
			</div>
		</ResponsiveModal>
	);
};

export default DepartmentUpdateModal;
