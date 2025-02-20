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
import { Input } from '@/components/ui/input';
import { showCourse, updateCourse } from '@/features/courses/api';

type CourseUpdateModalProp = {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	setCourseId: Dispatch<SetStateAction<number | null>>;
	id: number;
};

const courseUpdateSchema = z.object({
	name: z.string().min(1, 'Name Required'),
});

export type CourseUpdateForm = z.infer<typeof courseUpdateSchema>;

const CourseUpdateModal = ({
	open,
	setOpen,
	setCourseId,
	id,
}: CourseUpdateModalProp) => {
	const queryClient = useQueryClient();

	useQuery<HTTPResponse<Course>>({
		queryKey: ['get-course-by-id'],
		queryFn: async (): Promise<HTTPResponse<Course>> =>
			await showCourse(id).then((response) => {
				if (response.data.code === 200) {
					form.reset({ name: response.data.data.name });
					return response.data;
				}

				throw new Error('Fetch Course Show Fail!');
			}),
		enabled: !!id,
	});

	const { mutateAsync } = useMutation({
		mutationFn: async (body: CourseUpdateForm) =>
			await updateCourse(id, {
				id: id,
				name: body.name,
			})
				.then((response) => {
					if (response.status === 204) {
						queryClient.invalidateQueries({
							queryKey: ['get-all-courses'],
						});
						setCourseId(null);
						form.reset({
							name: '',
						});
						setOpen(false);
						toast.success('Course Updated Successfully');
					}
					return response.data;
				})
				.catch((e) => {
					toast.error(e.response?.data?.message ?? 'Request Failed');
					return e.response.data;
				}),
	});

	const form = useForm<CourseUpdateForm>({
		resolver: zodResolver(courseUpdateSchema),
		defaultValues: {
			name: '',
		},
	});

	function onSubmit(values: CourseUpdateForm) {
		mutateAsync(values);
	}

	return (
		<ResponsiveModal
			className="sm:min-h-[50vh] md:min-h-[30vh]"
			isOpen={open}
			setIsOpen={() => {
				setOpen(false);
				setCourseId(null);
				form.reset({
					name: '',
				});
			}}
		>
			<div className="p-7">
				<h2 className="mb-5 font-roboto-slab text-3xl">
					Course Update
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

export default CourseUpdateModal;
