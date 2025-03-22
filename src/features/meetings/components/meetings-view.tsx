import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video } from 'lucide-react';
import { useAuth } from '@/context/auth.context';
import { useQuery } from '@tanstack/react-query';
import { USER_ROLE } from '@/constants';
import { useOpenMeetingMutationDialogStore } from '@/features/meetings/store/open-meeting-mutation-dialog-store';
import MeetingMutationDialog from './meeting-mutation-dialog';
import MeetingItem, { MeetingItemSkeleton } from './meeting-item';
import { Meeting } from '../types';
import { getAll } from '../api';

export function MeetingsView() {
	const { setIsOpen } = useOpenMeetingMutationDialogStore();
	const { user } = useAuth();

	const { data: getAllMeetings, isLoading: isLoadingGetAllMeetings } =
		useQuery<HTTPResponse<Meeting[]>>({
			queryKey: ['get-all-meetings'],
			queryFn: async (): Promise<HTTPResponse<Meeting[]>> =>
				await getAll().then((response) => {
					if (response.data.code === 200) {
						return response.data;
					}

					throw new Error('Fetch all meetings fail!');
				}),
		});

	return (
		<>
			<MeetingMutationDialog />
			<div className="flex flex-col gap-6">
				<div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
					<h1 className="text-2xl font-bold tracking-tight">
						Meetings
					</h1>
					{user?.roleName === USER_ROLE.TUTOR && (
						<Button
							onClick={() => {
								setIsOpen({ isOpen: true, meeting: null });
							}}
						>
							Create new Meeting
						</Button>
					)}
				</div>

				<div className="space-y-4">
					{isLoadingGetAllMeetings ? (
						[1, 2, 3].map((i) => <MeetingItemSkeleton key={i} />)
					) : getAllMeetings?.data &&
					  getAllMeetings.data.length > 0 ? (
						getAllMeetings?.data?.map((meeting) => {
							const isOwner = meeting.meetingMembers.some(
								(mm) =>
									mm.roleName === 'ROLE_TUTOR' &&
									mm.userId === user?.id
							);

							return (
								<MeetingItem
									key={meeting.id}
									meeting={meeting}
									isOwner={isOwner}
								/>
							);
						})
					) : (
						<Card>
							<CardContent className="flex flex-col items-center justify-center p-6">
								<div className="rounded-full bg-muted p-3">
									<Video className="h-6 w-6 text-muted-foreground" />
								</div>
								<h3 className="mt-3 font-medium">
									No meeting found
								</h3>
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</>
	);
}
