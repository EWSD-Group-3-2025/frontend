import * as z from 'zod';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { Dispatch, SetStateAction, useEffect } from 'react';
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
import ResponsiveModal from '@/components/responsive-modal';
import { Input } from '@/components/ui/input';
import { updateSpecialization } from '@/features/specialization/api';

type SpecializationUpdateModalProp = {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	specializationName: string;
	setSpecializationId: Dispatch<SetStateAction<number | null>>;
	setSpecializationName: Dispatch<SetStateAction<string>>;
	id: number;
};

const specializationUpdateSchema = z.object({
	name: z.string().min(1, 'Name Required'),
});

export type SpecializationUpdateForm = z.infer<
	typeof specializationUpdateSchema
>;

const SpecializationUpdateModal = ({
	open,
	setOpen,
	specializationName,
	setSpecializationId,
	setSpecializationName,
	id,
}: SpecializationUpdateModalProp) => {
	const queryClient = useQueryClient();

	const { mutateAsync } = useMutation({
		mutationFn: async (body: SpecializationUpdateForm) =>
			await updateSpecialization(id, {
				id: id,
				name: body.name,
			})
				.then((response) => {
					if (response.status === 204) {
						queryClient.invalidateQueries({
							queryKey: ['get-all-specializations'],
						});
						setSpecializationId(null);
						form.reset({
							name: '',
						});
						setOpen(false);
						toast.success('Specialization Updated Successfully');
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

	const form = useForm<SpecializationUpdateForm>({
		resolver: zodResolver(specializationUpdateSchema),
		defaultValues: {
			name: specializationName,
		},
	});

	function onSubmit(values: SpecializationUpdateForm) {
		mutateAsync(values);
	}

	useEffect(() => {
		if (!open) {
			setOpen(false);
			setSpecializationId(null);
			setSpecializationName('');
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
					Specialization Update
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

export default SpecializationUpdateModal;
