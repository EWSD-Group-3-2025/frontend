import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import useConfirmDialog from '@/hooks/use-confirm-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { Event } from '../types';
import { Bell } from 'lucide-react';
import { deleteItem } from '../api';
import { toast } from 'sonner';
import { useAuth } from '@/context/auth.context';
import { useOpenEventMutationDialogStore } from '../store/open-event-mutation-dialog-store';

interface EventItemProps {
	event: Event;
}

export default function EventItem({ event }: EventItemProps) {
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const { setIsOpen } = useOpenEventMutationDialogStore();
	const [DeleteConfirmDialog, deleteConfirm] = useConfirmDialog(
		'Are you sure?',
		'This process cannot be undo and will delete the event permanently.'
	);

	const isEventAuthor = event.tutorId === user?.id;

	const { mutateAsync: deleteEventFn, isPending: deleteDocumentPending } =
		useMutation({
			mutationFn: async ({ id }: { id: number }): Promise<HTTPResponse> =>
				await deleteItem(id)
					.then((response) => {
						if (response.status === 204) {
							queryClient.invalidateQueries({
								queryKey: ['get-all-events'],
							});

							return response.data;
						}

						throw new Error('Event delete Fail!');
					})
					.catch((e) => {
						setIsOpen({
							isOpen: false,
							event: null,
						});

						toast.error(
							e.response?.data?.data ?? 'Request Failed',
							{
								description:
									e.response?.data?.message ??
									'Something wrong plz try again',
							}
						);
						throw e;
					}),
		});

	const handleEventDelete = async () => {
		if (event) {
			const isOk = await deleteConfirm();

			if (isOk) {
				await deleteEventFn({ id: event.id });
				toast.success('Successfully deleted the event');
			}
		}
	};

	return (
		<>
			<DeleteConfirmDialog />
			<Card key={event.id}>
				<CardContent className="p-6">
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div className="flex items-start gap-4">
							<div className="rounded-lg bg-muted p-2">
								<Bell className="h-8 w-8 text-primary" />
							</div>
							<div>
								<h3 className="font-semibold">{event.title}</h3>
								<p className="text-sm text-muted-foreground">
									Created at{' '}
									{new Date(
										event.createdAt
									).toLocaleDateString()}
								</p>
								<p className="mt-1 text-sm">
									{event.description}
								</p>
							</div>
						</div>
						<div className="flex flex-wrap gap-2">
							{isEventAuthor && (
								<>
									<Button
										disabled={deleteDocumentPending}
										onClick={() => {
											setIsOpen({
												isOpen: true,
												event: event,
											});
										}}
										variant="outline"
										size="sm"
									>
										Edit
									</Button>
									<Button
										disabled={deleteDocumentPending}
										onClick={handleEventDelete}
										variant="destructive"
										size="sm"
									>
										Delete
									</Button>
								</>
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		</>
	);
}

export const EventItemSkeleton = () => {
	return (
		<Card className="space-y-2">
			<Skeleton className="h-[70px] w-full" />
		</Card>
	);
};
