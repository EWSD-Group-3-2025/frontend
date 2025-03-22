import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import useConfirmDialog from '@/hooks/use-confirm-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { Meeting } from '../types';
import { Dot, Video } from 'lucide-react';
import { toast } from 'sonner';
import { useOpenMeetingMutationDialogStore } from '../store/open-meeting-mutation-dialog-store';
import { deleteItem } from '../api';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { format } from 'date-fns';

interface MeetingItemProps {
	meeting: Meeting;
	isOwner: boolean;
}

export default function MeetingItem({ meeting, isOwner }: MeetingItemProps) {
	const queryClient = useQueryClient();
	const { setIsOpen } = useOpenMeetingMutationDialogStore();
	const [DeleteConfirmDialog, deleteConfirm] = useConfirmDialog(
		'Are you sure?',
		'This process cannot be undo and will delete the meeting permanently.'
	);

	const isMeetingAuthor = isOwner;

	const { mutateAsync: deleteMeetingFn, isPending: deleteDocumentPending } =
		useMutation({
			mutationFn: async ({ id }: { id: number }): Promise<HTTPResponse> =>
				await deleteItem(id)
					.then((response) => {
						if (response.status === 200) {
							queryClient.invalidateQueries({
								queryKey: ['get-all-meetings'],
							});

							return response.data;
						}

						throw new Error('Meeting delete Fail!');
					})
					.catch((e) => {
						setIsOpen({
							isOpen: false,
							meeting: null,
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

	const handleMeetingDelete = async () => {
		if (meeting) {
			const isOk = await deleteConfirm();

			if (isOk) {
				await deleteMeetingFn({ id: meeting.id });
				toast.success('Successfully deleted the meeting');
			}
		}
	};

	return (
		<>
			<DeleteConfirmDialog />
			<Card key={meeting.id}>
				<CardContent className="p-6">
					<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
						<div className="flex items-start gap-4">
							<div className="rounded-lg bg-muted p-2">
								<Video className="h-8 w-8 text-primary" />
							</div>
							<div>
								<h2 className="text-lg">
									{meeting.description}
								</h2>
								<div className="mt-2 flex items-center text-sm text-muted-foreground">
									<span>
										Start Date:{' '}
										{format(
											new Date(meeting.startTime),
											'yyyy-MM-dd hh:mm a'
										)}
									</span>
									<Dot className="size-7" />
									<span>
										End Date:{' '}
										{format(
											new Date(meeting.endTime),
											'yyyy-MM-dd hh:mm a'
										)}
									</span>
								</div>
								<p className="text-muted-foreground">
									Type:{' '}
									{meeting.meetingType === 1
										? 'Virtual'
										: 'In-Person'}
								</p>
								{meeting.meetingType === 1 &&
									!!meeting.link && (
										<div className="flex items-center gap-x-2">
											<span>Link: </span>
											<Link
												to={meeting.link}
												target="_blank"
												className="hover:underline"
											>
												{meeting.link}
											</Link>
										</div>
									)}
								<p className="mt-2 text-muted-foreground">
									Location: {meeting.location}
								</p>

								<div className="mt-3 flex items-center gap-x-2">
									<p>Participants: </p>
									{meeting.meetingMembers.map(
										(member, index) => (
											<Tooltip>
												<TooltipTrigger>
													<Avatar
														key={index}
														className={`size-10 border border-gray-300 dark:border-gray-600 ${
															index !== 0
																? '-ml-4'
																: ''
														}`}
													>
														<AvatarImage
															src={member?.name}
															alt={member?.name}
														/>
														<AvatarFallback className="text-xl">
															{member?.name
																.charAt(0)
																.toUpperCase()}
														</AvatarFallback>
													</Avatar>
												</TooltipTrigger>
												<TooltipContent>
													<p>{member.name}</p>(
													<span>
														{member.roleName ===
														'ROLE_TUTOR'
															? 'Host'
															: 'Participant'}
													</span>
													)
												</TooltipContent>
											</Tooltip>
										)
									)}
								</div>
							</div>
						</div>
						<div className="flex flex-wrap gap-2">
							{isMeetingAuthor && (
								<>
									<Button
										disabled={deleteDocumentPending}
										onClick={() => {
											setIsOpen({
												isOpen: true,
												meeting: meeting,
											});
										}}
										variant="outline"
										size="sm"
									>
										Edit
									</Button>
									<Button
										disabled={deleteDocumentPending}
										onClick={handleMeetingDelete}
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

export const MeetingItemSkeleton = () => {
	return (
		<Card className="space-y-2">
			<Skeleton className="h-[70px] w-full" />
		</Card>
	);
};
