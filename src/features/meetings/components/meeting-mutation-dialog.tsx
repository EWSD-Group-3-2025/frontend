//! TODO When updating start and end date the date is not correctly pick
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { create, update } from '../api';
import { useAuth } from '@/context/auth.context';
import { Button } from '@/components/ui/button';
import DatePicker from '@/components/date-picker';
import { USER_ROLE } from '@/constants';
import { useOpenMeetingMutationDialogStore } from '../store/open-meeting-mutation-dialog-store';

const meetingCreateSchema = z.object({
	title: z.string().min(5, {
		message: 'Title must be at least 5 characters.',
	}),
	description: z.string().min(10, {
		message: 'Description must be at least 10 characters.',
	}),
	startdate: z.date({
		required_error: 'Meeting start date is required.',
	}),
	enddate: z.date({
		required_error: 'Meeting start date is required.',
	}),
	tutorId: z.number().optional(),
});

export type MeetingCreateSchema = z.infer<typeof meetingCreateSchema>;

export default function MeetingMutationDialog() {
	const { user } = useAuth();
	const {
		meeting: initialMeeting,
		isOpen,
		setIsOpen,
	} = useOpenMeetingMutationDialogStore();
	const queryClient = useQueryClient();
	const form = useForm<z.infer<typeof meetingCreateSchema>>({
		resolver: zodResolver(meetingCreateSchema),
		defaultValues: {
			title: '',
			description: '',
			startdate: initialMeeting?.startdate,
			enddate: initialMeeting?.enddate,
		},
	});

	const {
		mutateAsync: createNewMeetingFn,
		isPending: createNewMeetingIsPending,
	} = useMutation<HTTPResponse, unknown, MeetingCreateSchema>({
		mutationFn: async (
			createMeetingBody: MeetingCreateSchema
		): Promise<HTTPResponse> =>
			await create(createMeetingBody)
				.then((response) => {
					if (response.status === 201) {
						queryClient.invalidateQueries({
							queryKey: ['get-all-meetings'],
						});

						setIsOpen({ isOpen: false, meeting: null });
						return response.data;
					}

					throw new Error('Meeting creation Fail!');
				})
				.catch((e) => {
					setIsOpen({
						isOpen: false,
						meeting: null,
					});

					toast.error(e.response?.data?.data ?? 'Request Failed', {
						description:
							e.response?.data?.message ??
							'Something wrong plz try again',
					});
					throw e;
				}),
	});

	const { mutateAsync: updateMeetingFn } = useMutation({
		mutationFn: async ({
			id,
			updateMeetingBody,
		}: {
			id: number;
			updateMeetingBody: MeetingCreateSchema;
		}): Promise<HTTPResponse> =>
			await update(id, updateMeetingBody)
				.then((response) => {
					if (response.status === 204) {
						queryClient.invalidateQueries({
							queryKey: ['get-all-meetings'],
						});

						setIsOpen({ isOpen: false, meeting: null });
						return response.data;
					}

					throw new Error('Meeting update Fail!');
				})
				.catch((e) => {
					setIsOpen({
						isOpen: false,
						meeting: null,
					});

					toast.error(e.response?.data?.data ?? 'Request Failed', {
						description:
							e.response?.data?.message ??
							'Something wrong plz try again',
					});
					throw e;
				}),
	});

	const handleMeetingMutation = async (
		values: z.infer<typeof meetingCreateSchema>
	) => {
		if (!user) {
			return;
		}
		if (user.roleName !== USER_ROLE.TUTOR) {
			return;
		}
		const body = {
			...values,
			startdate: values.startdate,
			enddate: values.enddate,
			tutorId: user?.id,
		};

		if (!!initialMeeting) {
			await updateMeetingFn({
				id: initialMeeting.id,
				updateMeetingBody: body,
			});
			toast.success('Successfully update the meeting');
		} else {
			const res = await createNewMeetingFn(body);
			toast.success(res.message);
		}
	};

	useEffect(() => {
		if (initialMeeting) {
			form.setValue('title', initialMeeting.title);
			form.setValue('description', initialMeeting.description);
			form.setValue('startdate', new Date(initialMeeting.startdate));
			form.setValue('enddate', new Date(initialMeeting.enddate));
		}

		return () => {
			form.resetField('startdate');
			form.resetField('enddate');
		};
	}, [initialMeeting]);

	const isPending = createNewMeetingIsPending;

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(isOpen) => {
				setIsOpen({ isOpen, meeting: null });
				if (!isOpen) {
					form.reset();
				}
			}}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{!!initialMeeting
							? 'Edit Meeting'
							: 'Create New Meeting'}{' '}
					</DialogTitle>
					<DialogDescription>Announce an Meeting</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleMeetingMutation)}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input
											disabled={isPending}
											placeholder="New Meeting Title"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											disabled={isPending}
											placeholder="Meeting description..."
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="startdate"
							render={({ field }) => (
								<FormItem className="flex flex-col space-y-4">
									<FormLabel>Start Date</FormLabel>
									<DatePicker
										value={field.value}
										onChange={field.onChange}
									/>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="enddate"
							render={({ field }) => (
								<FormItem className="flex flex-col space-y-4">
									<FormLabel>End Date</FormLabel>
									<DatePicker
										value={field.value}
										onChange={field.onChange}
									/>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<Button disabled={isPending} type="submit">
								{!!initialMeeting ? 'Save' : 'Create'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
