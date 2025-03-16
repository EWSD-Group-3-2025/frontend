import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { useAuth } from '@/context/auth.context';
import { useQuery } from '@tanstack/react-query';
import { getAll } from '../api';
import { USER_ROLE } from '@/constants';
import EventItem, { EventItemSkeleton } from './event-item';
import { useOpenEventMutationDialogStore } from '../store/open-event-mutation-dialog-store';
import EventMutationDialog from './event-mutation-dialog';
import { Event } from '../types';

export function EventsView() {
	const { setIsOpen } = useOpenEventMutationDialogStore();
	const { user } = useAuth();

	const { data: getAllEvents, isLoading: isLoadingGetAllEvents } = useQuery<
		HTTPResponse<Event[]>
	>({
		queryKey: ['get-all-events'],
		queryFn: async (): Promise<HTTPResponse<Event[]>> =>
			await getAll().then((response) => {
				if (response.data.code === 200) {
					return response.data;
				}

				throw new Error('Fetch all events fail!');
			}),
	});
	console.log(getAllEvents);

	return (
		<>
			<EventMutationDialog />
			<div className="flex flex-col gap-6">
				<div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
					<h1 className="text-2xl font-bold tracking-tight">
						Events
					</h1>
					{user?.roleName === USER_ROLE.TUTOR && (
						<Button
							onClick={() => {
								setIsOpen({ isOpen: true, event: null });
							}}
						>
							Create new Event
						</Button>
					)}
				</div>

				<div className="space-y-4">
					{isLoadingGetAllEvents ? (
						[1, 2, 3].map((i) => <EventItemSkeleton key={i} />)
					) : getAllEvents?.data && getAllEvents.data.length > 0 ? (
						getAllEvents?.data?.map((event) => (
							<EventItem key={event.id} event={event} />
						))
					) : (
						<Card>
							<CardContent className="flex flex-col items-center justify-center p-6">
								<div className="rounded-full bg-muted p-3">
									<Bell className="h-6 w-6 text-muted-foreground" />
								</div>
								<h3 className="mt-3 font-medium">
									No event announcement found
								</h3>
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</>
	);
}
