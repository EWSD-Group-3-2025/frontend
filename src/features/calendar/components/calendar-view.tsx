import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth.context';
import { useQuery } from '@tanstack/react-query';
import { USER_ROLE } from '@/constants';
import EventMutationDialog from '@/features/events/components/event-mutation-dialog';
import { useOpenEventMutationDialogStore } from '@/features/events/store/open-event-mutation-dialog-store';
import { Event } from '@/features/events/types';
import { getAll as getAllEvents } from '@/features/events/api';
import TaskCalendar, { NormalizedDataInterface } from './task-calendar';
import { Meeting } from '@/features/meetings/types';
import { getAll as getAllMeetings } from '@/features/meetings/api';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function CalendarView() {
	const { setIsOpen } = useOpenEventMutationDialogStore();
	const [normalizedData, setNormalizedData] = useState<
		NormalizedDataInterface[]
	>([]);
	const { user } = useAuth();

	const { data: getAllEventsData, isLoading: isLoadingGetAllEvents } =
		useQuery<HTTPResponse<Event[]>>({
			queryKey: ['get-all-events'],
			queryFn: async (): Promise<HTTPResponse<Event[]>> =>
				await getAllEvents().then((response) => {
					if (response.data.code === 200) {
						return response.data;
					}

					throw new Error('Fetch all events fail!');
				}),
		});

	const { data: getAllMeetingsData, isLoading: isLoadingGetAllMeetings } =
		useQuery<HTTPResponse<Meeting[]>>({
			queryKey: ['get-all-meetings'],
			queryFn: async (): Promise<HTTPResponse<Meeting[]>> =>
				await getAllMeetings().then((response) => {
					if (response.data.code === 200) {
						return response.data;
					}

					throw new Error('Fetch all meetings fail!');
				}),
		});

	const isLoading = isLoadingGetAllEvents || isLoadingGetAllMeetings;

	useEffect(() => {
		const normalizedEvents = getAllEventsData?.data.map((meeting) => ({
			id: meeting.id,
			title: meeting.title,
			description: meeting.description,
			start: meeting.startdate,
			end: meeting.enddate,
			type: 'meeting',
			location: null,
			link: null,
		}));

		const normalizedMeetings = getAllMeetingsData?.data.map((event) => ({
			id: event.id,
			title: event.description,
			description: event.description,
			start: event.startTime,
			end: event.endTime,
			type: 'event',
			location: null,
			link: null,
		}));

		if (normalizedEvents && normalizedMeetings) {
			const normalizedData = [
				...normalizedEvents!,
				...normalizedMeetings!,
			].sort(
				(a, b) =>
					new Date(a.start).getTime() - new Date(b.start).getTime()
			);

			setNormalizedData(normalizedData);
		}
	}, [getAllMeetingsData, getAllEventsData]);

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
				{isLoading ? (
					<Skeleton className="h-500 w-full" />
				) : (
					<TaskCalendar data={normalizedData!} />
				)}
			</div>
		</>
	);
}
