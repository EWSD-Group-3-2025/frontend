import * as z from 'zod';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { updateCourse } from '@/features/courses/api';
import RequiredStar from '@/components/ui/required-star';
import ResponsiveModal from '@/components/responsive-modal';

type CourseUpdateModalProp = {
	open: boolean;
	courseName: string;
	setOpen: Dispatch<SetStateAction<boolean>>;
	setCourseId: Dispatch<SetStateAction<number | null>>;
	setCourseName: Dispatch<SetStateAction<string>>;
	id: number;
};

const courseUpdateSchema = z.object({
	name: z.string().min(1, 'Name Required'),
});

export type CourseUpdateForm = z.infer<typeof courseUpdateSchema>;

const CourseUpdateModal = ({
	open,
	setOpen,
	courseName,
	setCourseId,
	setCourseName,
	id,
}: CourseUpdateModalProp) => {
	const queryClient = useQueryClient();

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
					toast.error(e.response?.data?.data ?? 'Request Failed', {
						description:
							e.response?.data?.message ??
							'Something wrong plz try again',
					});

					return e.response.data;
				}),
	});

	const form = useForm<CourseUpdateForm>({
		resolver: zodResolver(courseUpdateSchema),
		defaultValues: {
			name: courseName,
		},
	});

	function onSubmit(values: CourseUpdateForm) {
		mutateAsync(values);
	}

	useEffect(() => {
		if (!open) {
			setOpen(false);
			setCourseId(null);
			setCourseName('');
			form.reset({
				name: '',
			});
		}
	}, [open]);

	return (
		<ResponsiveModal
			className="sm:min-h-[50vh] md:min-h-[30vh]"
			isOpen={open}
			setIsOpen={setOpen}
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
									<FormLabel>
										Name <RequiredStar />
									</FormLabel>
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
