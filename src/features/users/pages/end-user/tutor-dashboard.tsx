import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { Calendar, MessageSquare, FileText, Clock, Search } from 'lucide-react';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth.context';
import { Skeleton } from '@/components/ui/skeleton';
import {
	StudentUser,
	TutorDashboard as TutorDashboardType,
} from '@/features/users/types';
import { getTutorDashboard } from '@/features/users/api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate, useParams } from 'react-router-dom';

export default function TutorDashboard() {
	const { user } = useAuth();
	const { id } = useParams();
	const navigate = useNavigate();
	const [searchQuery, setSearchQuery] = useState('');

	const { data, isLoading } = useQuery<HTTPResponse<TutorDashboardType>>({
		queryKey: ['tutor-dashboard'],
		queryFn: async (): Promise<HTTPResponse<TutorDashboardType>> =>
			await getTutorDashboard(id ? Number(id) : (user?.id ?? 0)).then(
				(response) => {
					if (response.data.code === 200) {
						return response.data;
					}

					throw new Error('Fetch Tutor Dashboard Fail!');
				}
			),
	});

	const filterStudents = (students: StudentUser[]) => {
		return students.filter((student) =>
			student.name.toLowerCase().includes(searchQuery.toLowerCase())
		);
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<h2 className="text-xl font-bold">Tutor Dashboard</h2>
				<div className="relative w-full sm:w-64">
					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						type="search"
						placeholder="Search students..."
						className="pl-8"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
			</div>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				<Card className="col-span-full md:col-span-1">
					<CardHeader>
						<CardTitle>Overview</CardTitle>
						<CardDescription>
							Your tutoring statistics
						</CardDescription>
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
											{data.data.tutorDashboardCount
												.newMessageCountForToday > 0 ? (
												<>
													{
														data.data
															.tutorDashboardCount
															.newMessageCountForToday
													}{' '}
													new message
													{data.data
														.tutorDashboardCount
														.newMessageCountForToday >
													1
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
											{data.data.tutorDashboardCount
												.meetingCountForToday > 0 ? (
												<>
													{
														data.data
															.tutorDashboardCount
															.meetingCountForToday
													}{' '}
													meeting
													{data.data
														.tutorDashboardCount
														.meetingCountForToday >
													1
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
										<FileText className="h-4 w-4 text-primary" />
									</div>
									<div>
										<p className="text-sm font-medium">
											{data.data.tutorDashboardCount
												.documentCountForToday > 0 ? (
												<>
													{
														data.data
															.tutorDashboardCount
															.documentCountForToday
													}{' '}
													document
													{data.data
														.tutorDashboardCount
														.documentCountForToday >
													1
														? 's'
														: ''}{' '}
													to review today
												</>
											) : (
												<>
													No documents to review today
												</>
											)}
										</p>
										<p className="text-xs text-muted-foreground">
											{data.data.tutorDashboardCount
												.documentCountForToday > 0
												? 'Make sure to review them on time.'
												: "You're all caught up!"}
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
						<CardDescription>
							Your scheduled meetings
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{data &&
							data.data.dashboardTodayMeetings.length > 0 ? (
								data.data.dashboardTodayMeetings
									.sort(
										(a, b) =>
											new Date(a.startTime).getTime() -
											new Date(b.startTime).getTime()
									) // Sort by startTime
									.slice(0, 3) // Get only the next 3 meetings
									.map((meeting) => (
										<React.Fragment key={meeting.id}>
											<div className="flex items-start gap-4">
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
												</div>
											</div>
										</React.Fragment>
									))
							) : (
								<p>No Upcoming Meetings</p>
							)}

							{data &&
								data.data.dashboardTodayMeetings.length > 0 && (
									<Button
										size="sm"
										variant="outline"
										className="w-full"
										onClick={() =>
											navigate(
												'/dashboard/end-user/meetings'
											)
										}
									>
										View All Meetings
									</Button>
								)}
						</div>
					</CardContent>
				</Card>

				<Card className="col-span-full md:col-span-1">
					<CardHeader>
						<CardTitle>Students Needing Attention</CardTitle>
						<CardDescription>
							No interaction for 7+ days
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{data &&
							data.data.students.some(
								(student) => student.inactive
							) ? (
								data.data.students
									.filter(
										(student) =>
											student.inactive &&
											student.inactiveDays >= 20
									)
									.map((student) => (
										<div
											key={student.id}
											className="flex items-center justify-between rounded-lg border p-4"
										>
											<div className="flex items-center gap-4">
												<Avatar className="h-10 w-10">
													<AvatarImage
														src={student.name}
														alt={student.name}
													/>
													<AvatarFallback>
														{student.name.charAt(0)}
													</AvatarFallback>
												</Avatar>
												<div>
													<p className="font-medium">
														{student.name}
													</p>
													<p className="text-sm text-muted-foreground">
														{student.courseName}
													</p>
													<p className="text-xs text-destructive">
														No interaction for{' '}
														{student.inactiveDays}{' '}
														days
													</p>
												</div>
											</div>
											<div className="flex gap-2">
												<Button
													size="sm"
													variant="outline"
												>
													<MessageSquare
														className="mr-2 h-4 w-4"
														onClick={() =>
															navigate(
																'/dashboard/end-user/messages'
															)
														}
													/>
													Message
												</Button>
												<Button
													size="sm"
													variant="outline"
												>
													<Calendar
														className="mr-2 h-4 w-4"
														onClick={() =>
															navigate(
																'/dashboard/end-user/meetings'
															)
														}
													/>
													Schedule
												</Button>
											</div>
										</div>
									))
							) : (
								<p className="text-xs text-slate-400">
									There are No Urgent Inactive Students
								</p>
							)}

							{data &&
								data.data.students.some(
									(student) => student.inactive
								) && (
									<Button
										size="sm"
										variant="outline"
										className="w-full"
										onClick={() =>
											navigate(
												'/dashboard/end-user/messages'
											)
										}
									>
										View All
									</Button>
								)}
						</div>
					</CardContent>
				</Card>
			</div>

			<Card className="col-span-full">
				<CardHeader>
					<CardTitle>My Tutees</CardTitle>
					<CardDescription>Students assigned to you</CardDescription>
				</CardHeader>
				<CardContent>
					<Tabs defaultValue="all">
						<TabsList className="mb-4">
							<TabsTrigger value="all">All Students</TabsTrigger>
							<TabsTrigger value="active">Active</TabsTrigger>
							<TabsTrigger value="inactive">Inactive</TabsTrigger>
						</TabsList>
						{isLoading ? (
							<div className="space-y-4">
								{Array.from({ length: 5 }).map((_, index) => (
									<div
										key={index}
										className="flex items-center justify-between rounded-lg border p-4"
									>
										<div className="flex items-center gap-4">
											<Skeleton className="h-10 w-10 rounded-full" />
											<div>
												<Skeleton className="mb-1 h-4 w-32" />
												<Skeleton className="h-3 w-24" />
											</div>
										</div>
										<div className="flex gap-2">
											<Skeleton className="h-8 w-20" />
											<Skeleton className="h-8 w-20" />
										</div>
									</div>
								))}
							</div>
						) : (
							<>
								<TabsContent value="all" className="space-y-4">
									{data && data.data.students.length > 0
										? filterStudents(
												data.data.students
											).map((student) => (
												<div
													key={student.id}
													className="flex items-center justify-between rounded-lg border p-4"
												>
													<div className="flex items-center gap-4">
														<Avatar className="h-10 w-10">
															<AvatarImage
																src={
																	student.name
																}
																alt={
																	student.name
																}
															/>
															<AvatarFallback>
																{student.name.charAt(
																	0
																)}
															</AvatarFallback>
														</Avatar>
														<div>
															<p className="font-medium">
																{student.name}
															</p>
															<p className="text-sm text-muted-foreground">
																{
																	student.courseName
																}
															</p>
														</div>
													</div>
													<div className="flex gap-2">
														<Button
															size="sm"
															variant="outline"
															onClick={() =>
																navigate(
																	'/dashboard/end-user/messages'
																)
															}
														>
															<MessageSquare className="mr-2 h-4 w-4" />
															Message
														</Button>
														<Button
															size="sm"
															variant="outline"
															onClick={() =>
																navigate(
																	'/dashboard/end-user/meetings'
																)
															}
														>
															<Calendar className="mr-2 h-4 w-4" />
															Schedule
														</Button>
													</div>
												</div>
											))
										: 'There is No Students'}
								</TabsContent>

								<TabsContent
									value="active"
									className="space-y-4"
								>
									{data &&
									filterStudents(data.data.students).filter(
										(student) => !student.inactive
									).length > 0 ? (
										data.data.students
											.filter(
												(student) => !student.inactive
											)
											?.map((student) => (
												<div
													key={student.id}
													className="flex items-center justify-between rounded-lg border p-4"
												>
													<div className="flex items-center gap-4">
														<Avatar className="h-10 w-10">
															<AvatarImage
																src={
																	student.name
																}
																alt={
																	student.name
																}
															/>
															<AvatarFallback>
																{student.name.charAt(
																	0
																)}
															</AvatarFallback>
														</Avatar>
														<div>
															<p className="font-medium">
																{student.name}
															</p>
															<p className="text-sm text-muted-foreground">
																{
																	student.courseName
																}
															</p>
														</div>
													</div>
													<div className="flex gap-2">
														<Button
															size="sm"
															variant="outline"
															onClick={() =>
																navigate(
																	'/dashboard/end-user/messages'
																)
															}
														>
															<MessageSquare className="mr-2 h-4 w-4" />
															Message
														</Button>
														<Button
															size="sm"
															variant="outline"
															onClick={() =>
																navigate(
																	'/dashboard/end-user/meetings'
																)
															}
														>
															<Calendar className="mr-2 h-4 w-4" />
															Schedule
														</Button>
													</div>
												</div>
											))
									) : (
										<p>There are No Active Students</p>
									)}
								</TabsContent>

								<TabsContent
									value="inactive"
									className="space-y-4"
								>
									{data &&
									data.data.students.filter(
										(student) => student.inactive
									).length > 0 ? (
										filterStudents(data.data.students)
											.filter(
												(student) => student.inactive
											)
											?.map((student) => (
												<div
													key={student.id}
													className="flex items-center justify-between rounded-lg border p-4"
												>
													<div className="flex items-center gap-4">
														<Avatar className="h-10 w-10">
															<AvatarImage
																src={
																	student.name
																}
																alt={
																	student.name
																}
															/>
															<AvatarFallback>
																{student.name.charAt(
																	0
																)}
															</AvatarFallback>
														</Avatar>
														<div>
															<p className="font-medium">
																{student.name}
															</p>
															<p className="text-sm text-muted-foreground">
																{
																	student.courseName
																}
															</p>
															<p className="text-xs text-destructive">
																No interaction
																for{' '}
																{
																	student.inactiveDays
																}{' '}
																days
															</p>
														</div>
													</div>
													<div className="flex gap-2">
														<Button
															size="sm"
															variant="outline"
															onClick={() =>
																navigate(
																	'/dashboard/end-user/messages'
																)
															}
														>
															<MessageSquare className="mr-2 h-4 w-4" />
															Message
														</Button>
														<Button
															size="sm"
															variant="outline"
															onClick={() =>
																navigate(
																	'/dashboard/end-user/meetings'
																)
															}
														>
															<Calendar className="mr-2 h-4 w-4" />
															Schedule
														</Button>
													</div>
												</div>
											))
									) : (
										<p>There are No Inactive Students</p>
									)}
								</TabsContent>
							</>
						)}
					</Tabs>
				</CardContent>
			</Card>
		</div>
	);
}
