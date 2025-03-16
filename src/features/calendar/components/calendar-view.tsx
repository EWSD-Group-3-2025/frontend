import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth.context';
import { useQuery } from '@tanstack/react-query';
import { USER_ROLE } from '@/constants';
import EventMutationDialog from '@/features/events/components/event-mutation-dialog';
import { useOpenEventMutationDialogStore } from '@/features/events/store/open-event-mutation-dialog-store';
import { Event } from '@/features/events/types';
import { getAll } from '@/features/events/api';
import TaskCalendar from './task-calendar';

export function CalendarView() {
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
	console.log(getAllEvents, isLoadingGetAllEvents);

	return (
		<>
			<EventMutationDialog />
			<div className="flex flex-col gap-6">
				<div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
					<h1 className="text-2xl font-bold tracking-tight">
						Calendar View
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
				{isLoadingGetAllEvents ? (
					<p>Loading...</p>
				) : (
					<TaskCalendar data={getAllEvents?.data!} />
				)}
			</div>
		</>
	);
}
