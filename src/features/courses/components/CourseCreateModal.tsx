import * as z from 'zod';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { Dispatch, SetStateAction } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth.context';
import { TagsInput } from '@/components/ui/tags-input';
import ResponsiveModal from '@/components/responsive-modal';
import { createCourse } from '@/features/courses/api';

type CourseCreateModalProp = {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	setCourseId: Dispatch<SetStateAction<number | null>>;
};

const courseCreateSchema = z.object({
	names: z.array(z.string()).nonempty('Please at least one item'),
	staffId: z.string().nullable(),
});

export type CourseCreateForm = z.infer<typeof courseCreateSchema>;

const CourseCreateModal = ({
	open,
	setOpen,
	setCourseId,
}: CourseCreateModalProp) => {
	const { user } = useAuth();
	const queryClient = useQueryClient();

	const { mutateAsync } = useMutation({
		mutationFn: async (body: CourseCreateForm) =>
			await createCourse(body)
				.then((response) => {
					if (response.data.code === 201) {
						queryClient.invalidateQueries({
							queryKey: ['get-all-courses'],
						});
						setOpen(false);
						createForm.reset({
							names: [],
							staffId: user?.id.toString() ?? '',
						});
						toast.success(response.data.message);
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

	const createForm = useForm<CourseCreateForm>({
		resolver: zodResolver(courseCreateSchema),
		defaultValues: {
			names: [],
			staffId: user?.id.toString() ?? '',
		},
	});

	function onSubmit(values: CourseCreateForm) {
		mutateAsync(values);
	}

	return (
		<ResponsiveModal
			className="sm:min-h-[50vh] md:min-h-[30vh]"
			isOpen={open}
			setIsOpen={() => {
				setOpen(false);
				setCourseId(null);
				createForm.reset({
					names: [],
					staffId: user?.id.toString() ?? '',
				});
			}}
		>
			<div className="p-7">
				<h2 className="mb-5 font-roboto-slab text-3xl">
					Courses Create
				</h2>

				<Form {...createForm}>
					<form onSubmit={createForm.handleSubmit(onSubmit)}>
						<FormField
							control={createForm.control}
							name="names"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<TagsInput
											value={field.value ?? []}
											onValueChange={field.onChange}
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
			</div>
		</ResponsiveModal>
	);
};

export default CourseCreateModal;
