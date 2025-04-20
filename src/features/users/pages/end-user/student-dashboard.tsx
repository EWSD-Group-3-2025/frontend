import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Calendar, MessageSquare, Clock, Bell } from 'lucide-react';
import { getStudentDashboard } from '@/features/users/api';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/auth.context';
import { StudentDashboard as StudentDashboardType } from '@/features/users/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate, useParams } from 'react-router-dom';

export function StudentDashboard() {
	const { user } = useAuth();
	const navigate = useNavigate();
	const { id } = useParams();

	const { data, isLoading } = useQuery<HTTPResponse<StudentDashboardType>>({
		queryKey: ['student-dashboard'],
		queryFn: async (): Promise<HTTPResponse<StudentDashboardType>> =>
			await getStudentDashboard(id ? Number(id) : (user?.id ?? 0)).then(
				(response) => {
					if (response.data.code === 200) {
						return response.data;
					}

					throw new Error('Fetch Admin Listing Fail!');
				}
			),
	});

	return (
		<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			<Card className="col-span-full md:col-span-1">
				<CardHeader>
					<CardTitle>My Personal Tutor</CardTitle>
					<CardDescription>
						{data?.data
							? 'Your assigned personal tutor'
							: "You currently doesn't have tutor"}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-4">
						{isLoading ? (
							<div className="flex items-center gap-4">
								<Skeleton className="h-12 w-12 rounded-full" />
								<div>
									<Skeleton className="mb-2 h-4 w-32" />
									<Skeleton className="mb-1 h-3 w-40" />
									<Skeleton className="h-3 w-48" />
								</div>
							</div>
						) : data?.data?.tutorDto !== null ? (
							<>
								<div className="flex gap-4">
									<Avatar className="h-12 w-12">
										<AvatarImage
											src={
												data?.data?.tutorDto.name ?? 'A'
											}
											alt={
												data?.data?.tutorDto.name ?? 'A'
											}
										/>
										<AvatarFallback>
											{data?.data?.tutorDto.name?.charAt(
												0
											) ?? 'N/A'}
										</AvatarFallback>
									</Avatar>
									<div>
										<p className="break-all font-medium">
											{data?.data?.tutorDto.name ?? 'N/A'}
										</p>
										<p className="break-all text-sm text-muted-foreground">
											{data?.data?.tutorDto
												.specializationName ??
												'Specialization not provided'}
										</p>
										<p className="break-all text-sm text-muted-foreground">
											{data?.data?.tutorDto.email ??
												'Email not available'}
										</p>
									</div>
								</div>
								<div className="mt-4 flex flex-wrap gap-2">
									<Button
										size="sm"
										variant="outline"
										className="flex-1"
									>
										<MessageSquare className="mr-2 h-4 w-4" />
										Message
									</Button>
									<Button
										size="sm"
										variant="outline"
										className="flex-1"
									>
										<Calendar className="mr-2 h-4 w-4" />
										Schedule Meeting
									</Button>
								</div>
							</>
						) : (
							<div className="text-center text-gray-500">
								<p>No tutor available at the moment.</p>
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			<Card className="col-span-full md:col-span-1">
				<CardHeader>
					<CardTitle>Recent Activity</CardTitle>
					<CardDescription>Your recent interactions</CardDescription>
				</CardHeader>
				<CardContent>
					{data && (
						<div className="space-y-4">
							<div className="flex items-center gap-4">
								<div className="rounded-full bg-primary/10 p-2">
									<MessageSquare className="h-4 w-4 text-primary" />
								</div>
								<div>
									<p className="text-sm font-medium">
										{data.data.studentDashboardCount
											.newMessageCountForToday > 0 ? (
											<>
												{
													data.data
														.studentDashboardCount
														.newMessageCountForToday
												}{' '}
												new message
												{data.data.studentDashboardCount
													.newMessageCountForToday > 1
													? 's'
													: ''}{' '}
												today
											</>
										) : (
											<>No Messages</>
										)}
									</p>
									<p className="text-xs text-muted-foreground">
										Check your inbox for details
									</p>
								</div>
							</div>
							<div className="flex items-center gap-4">
								<div className="rounded-full bg-primary/10 p-2">
									<Calendar className="h-4 w-4 text-primary" />
								</div>
								<div>
									<p className="text-sm font-medium">
										{data.data.studentDashboardCount
											.meetingCountForToday > 0 ? (
											<>
												{
													data.data
														.studentDashboardCount
														.meetingCountForToday
												}{' '}
												meeting
												{data.data.studentDashboardCount
													.meetingCountForToday > 1
													? 's'
													: ''}{' '}
												upcoming today
											</>
										) : (
											<>No Meeting today</>
										)}
									</p>
									<p className="text-xs text-muted-foreground">
										Check your schedule for details
									</p>
								</div>
							</div>
							<div className="flex items-center gap-4">
								<div className="rounded-full bg-primary/10 p-2">
									<Bell className="h-4 w-4 text-primary" />
								</div>
								<div>
									<p className="text-sm font-medium">
										{data.data.studentDashboardCount
											.eventCountForToday > 0 ? (
											<>
												{
													data.data
														.studentDashboardCount
														.eventCountForToday
												}{' '}
												event
												{data.data.studentDashboardCount
													.eventCountForToday > 1
													? 's'
													: ''}{' '}
												today
											</>
										) : (
											<>No Meeting today</>
										)}
									</p>
									<p className="text-xs text-muted-foreground">
										{data.data.studentDashboardCount
											.eventCountForToday > 0
											? "Don't miss your upcoming event!"
											: 'No events scheduled for today.'}
									</p>
								</div>
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			<Card className="col-span-full md:col-span-1">
				<CardHeader>
					<CardTitle>Upcoming Meetings</CardTitle>
					<CardDescription>Your scheduled meetings</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{data &&
							data.data.dashboardTodayMeetings
								.sort(
									(a, b) =>
										new Date(a.startTime).getTime() -
										new Date(b.startTime).getTime()
								) // Sort by time
								.slice(0, 3) // Show only top 3 items
								.map((meeting) => (
									<div
										key={meeting.id}
										className="flex items-start gap-4"
									>
										<div className="rounded-full bg-primary/10 p-2">
											<Clock className="h-4 w-4 text-primary" />
										</div>
										<div>
											<p className="text-sm font-medium">
												{meeting.description}
											</p>
											<p className="text-xs text-muted-foreground">
												{new Date(
													meeting.startTime
												).toLocaleDateString()}{' '}
												at{' '}
												{new Date(
													meeting.startTime
												).toLocaleTimeString()}
											</p>
											<p className="text-xs text-muted-foreground">
												{meeting.meetingType}
											</p>
										</div>
									</div>
								))}

						{data &&
							data.data.dashboardTodayMeetings.some(
								(student) => student
							) && (
								<Button
									size="sm"
									variant="outline"
									className="w-full"
									onClick={() =>
										navigate('/dashboard/end-user/meetings')
									}
								>
									View All Meeting
								</Button>
							)}
					</div>
				</CardContent>
			</Card>

			<Card className="col-span-full">
				<CardHeader>
					<CardTitle>Recent Messages</CardTitle>
					<CardDescription>Your recent conversations</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{data &&
							data.data.dashboardChatMessages.map(
								(message, i) => {
									console.log(message.senderUsername, 'AAA');

									return (
										<div
											key={i}
											className="flex items-start gap-4"
										>
											<Avatar className="h-8 w-8">
												<AvatarImage
													src={
														message?.senderUsername
													}
													alt={
														message?.senderUsername
													}
												/>
												<AvatarFallback>
													{message?.senderUsername?.charAt(
														0
													)}
												</AvatarFallback>
											</Avatar>
											<div className="flex-1">
												<div className="flex items-center gap-2">
													<p className="text-sm font-medium">
														{message.senderUsername}
													</p>
													<p className="text-xs text-muted-foreground">
														{new Date(
															message.timestamp
														).toLocaleDateString()}
													</p>
												</div>
												<p className="text-sm">
													{message.content}
												</p>
											</div>
										</div>
									);
								}
							)}

						{data &&
							data.data.dashboardChatMessages.some(
								(message) => message
							) && (
								<Button
									size="sm"
									variant="outline"
									className="w-full"
									onClick={() =>
										navigate('/dashboard/end-user/messages')
									}
								>
									View All Messages
								</Button>
							)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
