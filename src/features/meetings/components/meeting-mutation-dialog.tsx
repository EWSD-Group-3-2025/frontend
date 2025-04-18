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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuth } from '@/context/auth.context';
import { Button } from '@/components/ui/button';
import DatePicker from '@/components/date-picker';
import { USER_ROLE } from '@/constants';
import { useOpenMeetingMutationDialogStore } from '../store/open-meeting-mutation-dialog-store';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { create, update } from '../api';
import { getTutorAllocationStudents } from '@/features/users/api';
import {
	MultiSelector,
	MultiSelectorContent,
	MultiSelectorInput,
	MultiSelectorItem,
	MultiSelectorList,
	MultiSelectorTrigger,
} from '@/components/ui/multi-select';
import { Skeleton } from '@/components/ui/skeleton';

const meetingCreateSchema = z.object({
	hostId: z.number({ required_error: 'Host id is required' }).optional(),
	meetingType: z.string({ required_error: 'Meeting type is required' }),
	description: z
		.string({ required_error: 'Description is required' })
		.min(10, {
			message: 'Description must be at least 10 characters.',
		}),
	startTime: z.date({
		required_error: 'Meeting start time is required.',
	}),
	endTime: z.date({
		required_error: 'Meeting end time is required.',
	}),
	location: z.string({ required_error: 'Location is required' }).min(3, {
		message: 'Location must be at least 3 characters.',
	}),
	link: z.string().optional(),
	participantIds: z.array(z.string()),
	participantNames: z.array(z.string()),
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
			link: '',
			location: '',
			description: '',
			meetingType: '1',
			startTime: initialMeeting?.startTime,
			endTime: initialMeeting?.endTime,
		},
	});

	const resetForm = () => {
		form.resetField('startTime');
		form.resetField('endTime');
		form.resetField('description');
		form.resetField('link');
		form.resetField('location');
		form.resetField('participantIds');
		form.resetField('participantNames');
	};

	const {
		data: getAllTutorStudents,
		isLoading: isLoadingGetAllTutorStudents,
	} = useQuery<HTTPResponse<{ id: number; name: string }[]>>({
		queryKey: ['get-all-tutor-students', user?.id],
		queryFn: async (): Promise<
			HTTPResponse<{ id: number; name: string }[]>
		> =>
			await getTutorAllocationStudents(user?.id!).then((response) => {
				if (response.data.code === 200) {
					return response.data;
				}

				throw new Error('Fetch all get tutor students fail!');
			}),
	});

	const { mutateAsync: createNewMeetingFn } = useMutation<
		HTTPResponse,
		unknown,
		MeetingCreateSchema
	>({
		mutationFn: async (
			createMeetingBody: MeetingCreateSchema
		): Promise<HTTPResponse> =>
			await create(createMeetingBody)
				.then((response) => {
					if (response.status === 200) {
						queryClient.invalidateQueries({
							queryKey: ['get-all-meetings'],
						});

						setIsOpen({ isOpen: false, meeting: null });
						resetForm();
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
					if (response.status === 200) {
						queryClient.invalidateQueries({
							queryKey: ['get-all-meetings'],
						});

						setIsOpen({ isOpen: false, meeting: null });
						resetForm();
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
		if (values.participantIds.length === 0) {
			toast.error('Meeting participant is required');
			return;
		}
		if (values.participantNames.length === 0) {
			toast.error('Meeting participant is required');
			return;
		}

		const body = {
			...values,
			hostId: user?.id,
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
			form.setValue('description', initialMeeting.description);
			form.setValue('link', initialMeeting.link);
			form.setValue('location', initialMeeting.location);
			form.setValue('startTime', new Date(initialMeeting.startTime));
			form.setValue('endTime', new Date(initialMeeting.endTime));
			form.setValue(
				'participantIds',
				initialMeeting.meetingMembers
					?.filter((m) => m.userId !== user?.id)
					?.map((m) => m.userId.toString())
			);
			form.setValue(
				'participantNames',
				initialMeeting?.meetingMembers
					?.filter((m) => m.userId !== user?.id)
					?.map((m) => m.name)
			);
		}

		return () => {
			resetForm();
		};
	}, [initialMeeting]);

	const isPending = false;
	const watched = form.watch();

	useEffect(() => {
		if (watched?.participantNames?.length > 0) {
			const participantIds = getAllTutorStudents?.data
				?.map((ts) => {
					if (watched?.participantNames?.includes(ts?.name)) {
						return ts.id.toString();
					} else {
						return '';
					}
				})
				.filter((v) => v !== '')!;
			form.setValue('participantIds', participantIds);
		} else {
			form.setValue('participantIds', []);
		}
	}, [watched]);

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(isOpen) => {
				setIsOpen({ isOpen, meeting: null });
				if (!isOpen) {
					resetForm();
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
							name="participantNames"
							render={({ field }) => (
								<FormItem className="flex flex-col space-y-4">
									<FormLabel>
										Select Meeting Participant
									</FormLabel>
									<FormControl>
										{isLoadingGetAllTutorStudents ? (
											<Skeleton className="h-[40px] w-full" />
										) : (
											<MultiSelector
												values={
													field?.value?.map(String) ||
													[]
												}
												onValuesChange={field.onChange}
											>
												<MultiSelectorTrigger className="ring-gray-500 focus-within:ring-2 focus-within:ring-slate-500">
													<MultiSelectorInput placeholder="Select Student" />
												</MultiSelectorTrigger>
												<MultiSelectorContent>
													<MultiSelectorList>
														{getAllTutorStudents?.data?.map(
															(student) => (
																<MultiSelectorItem
																	key={student.id.toString()}
																	value={student.name.toString()}
																>
																	{
																		student.name
																	}
																</MultiSelectorItem>
															)
														)}
													</MultiSelectorList>
												</MultiSelectorContent>
											</MultiSelector>
										)}
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex w-full gap-x-4">
							<FormField
								control={form.control}
								name="startTime"
								render={({ field }) => (
									<FormItem className="flex w-full flex-col space-y-4">
										<FormLabel>Start Time</FormLabel>
										<DatePicker
											enableTimePicker
											value={field.value}
											onChange={field.onChange}
										/>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="endTime"
								render={({ field }) => (
									<FormItem className="flex w-full flex-col space-y-4">
										<FormLabel>End Time</FormLabel>
										<DatePicker
											enableTimePicker
											value={field.value}
											onChange={field.onChange}
										/>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="flex w-full gap-x-4">
							<FormField
								control={form.control}
								name="meetingType"
								render={({ field }) => (
									<FormItem className="flex w-full flex-col space-y-4">
										<FormLabel>Meeting Type</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select meeting type" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="1">
													Virtual
												</SelectItem>
												<SelectItem value="2">
													In-Person
												</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="location"
								render={({ field }) => (
									<FormItem className="flex w-full flex-col space-y-4">
										<FormLabel>Location</FormLabel>
										<FormControl>
											<Input
												disabled={isPending}
												placeholder="Meeting Location..."
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						{watched.meetingType === '1' && (
							<FormField
								control={form.control}
								name="link"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Link</FormLabel>
										<FormControl>
											<Input
												disabled={isPending}
												placeholder="Meeting Link..."
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}
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
