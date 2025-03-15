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
import { useOpenEventMutationDialogStore } from '../store/open-event-mutation-dialog-store';
import DatePicker from '@/components/date-picker';
import { USER_ROLE } from '@/constants';

const eventCreateSchema = z.object({
	title: z.string().min(5, {
		message: 'Title must be at least 5 characters.',
	}),
	description: z.string().min(10, {
		message: 'Description must be at least 10 characters.',
	}),
	startdate: z.date({
		required_error: 'Event start date is required.',
	}),
	enddate: z.date({
		required_error: 'Event start date is required.',
	}),
	tutorId: z.number().optional(),
});

export type EventCreateSchema = z.infer<typeof eventCreateSchema>;

export default function EventMutationDialog() {
	const { user } = useAuth();
	const {
		event: initialEvent,
		isOpen,
		setIsOpen,
	} = useOpenEventMutationDialogStore();
	const queryClient = useQueryClient();
	const form = useForm<z.infer<typeof eventCreateSchema>>({
		resolver: zodResolver(eventCreateSchema),
		defaultValues: {
			title: '',
			description: '',
		},
	});

	const {
		mutateAsync: createNewEventFn,
		isPending: createNewEventIsPending,
	} = useMutation<HTTPResponse, unknown, EventCreateSchema>({
		mutationFn: async (
			createEventBody: EventCreateSchema
		): Promise<HTTPResponse> =>
			await create(createEventBody)
				.then((response) => {
					if (response.status === 201) {
						queryClient.invalidateQueries({
							queryKey: ['get-all-events'],
						});

						setIsOpen({ isOpen: false, event: null });
						return response.data;
					}

					throw new Error('Event creation Fail!');
				})
				.catch((e) => {
					setIsOpen({
						isOpen: false,
						event: null,
					});

					toast.error(e.response?.data?.data ?? 'Request Failed', {
						description:
							e.response?.data?.message ??
							'Something wrong plz try again',
					});
					throw e;
				}),
	});

	const { mutateAsync: updateEventFn } = useMutation({
		mutationFn: async ({
			id,
			updateEventBody,
		}: {
			id: number;
			updateEventBody: EventCreateSchema;
		}): Promise<HTTPResponse> =>
			await update(id, updateEventBody)
				.then((response) => {
					if (response.status === 204) {
						queryClient.invalidateQueries({
							queryKey: ['get-all-events'],
						});

						setIsOpen({ isOpen: false, event: null });
						return response.data;
					}

					throw new Error('Event update Fail!');
				})
				.catch((e) => {
					setIsOpen({
						isOpen: false,
						event: null,
					});

					toast.error(e.response?.data?.data ?? 'Request Failed', {
						description:
							e.response?.data?.message ??
							'Something wrong plz try again',
					});
					throw e;
				}),
	});

	const handleEventMutation = async (
		values: z.infer<typeof eventCreateSchema>
	) => {
		if (!user) {
			return;
		}
		if (user.roleName !== USER_ROLE.TUTOR) {
			return;
		}
		const body = {
			...values,
			tutorId: user?.id,
		};

		if (!!initialEvent) {
			toast.success('Successfully update the event');
		} else {
			const res = await createNewEventFn(body);
			toast.success(res.message);
		}
	};

	useEffect(() => {
		if (initialEvent) {
			form.setValue('title', initialEvent.title);
			form.setValue('description', initialEvent.description);
		}
	}, [initialEvent]);

	const isPending = createNewEventIsPending;

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(isOpen) => {
				setIsOpen({ isOpen, event: null });
				if (!isOpen) {
					form.reset();
				}
			}}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{!!initialEvent
							? 'Edit Event'
							: 'Create New Event'}{' '}
					</DialogTitle>
					<DialogDescription>Announce an Event</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleEventMutation)}
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
											placeholder="New Event Title"
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
											placeholder="Event description..."
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
								{!!initialEvent ? 'Save' : 'Create'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
