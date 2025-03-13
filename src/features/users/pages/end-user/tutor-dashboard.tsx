import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import {
	Calendar,
	MessageSquare,
	FileText,
	Clock,
	Search,
	AlertCircle,
} from 'lucide-react';

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
import { StudentUser } from '@/features/users/types';
import { students, messages, meetings } from '@/data';
import { getTutorDashboard } from '@/features/users/api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useParams } from 'react-router-dom';

export default function TutorDashboard() {
	const { user } = useAuth();
	const { id } = useParams();
	const [searchQuery, setSearchQuery] = useState('');

	// TODO Use recent messages
	// Get recent messages
	const recentMessages = messages.slice(0, 3);
	console.log(recentMessages);

	// Get upcoming meetings
	const upcomingMeetings = meetings
		.filter((meeting) => new Date(meeting.date) > new Date())
		.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
		.slice(0, 2);

	// Students with no interaction for 7 days
	const inactiveStudents = students.slice(0, 2);

	const { data, isLoading } = useQuery<HTTPResponse<StudentUser[]>>({
		queryKey: ['tutor-dashboard'],
		queryFn: async (): Promise<HTTPResponse<StudentUser[]>> =>
			await getTutorDashboard(id ? Number(id) : (user?.id ?? 0)).then(
				(response) => {
					if (response.data.code === 200) {
						return response.data;
					}

					throw new Error('Fetch Tutor Dashboard Fail!');
				}
			),
	});

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
						<div className="space-y-4">
							<div className="flex items-center gap-4">
								<div className="rounded-full bg-primary/10 p-2">
									<MessageSquare className="h-4 w-4 text-primary" />
								</div>
								<div>
									<p className="text-sm font-medium">
										12 new messages
									</p>
									<p className="text-xs text-muted-foreground">
										From 5 students
									</p>
								</div>
							</div>
							<div className="flex items-center gap-4">
								<div className="rounded-full bg-primary/10 p-2">
									<Calendar className="h-4 w-4 text-primary" />
								</div>
								<div>
									<p className="text-sm font-medium">
										8 upcoming meetings
									</p>
									<p className="text-xs text-muted-foreground">
										Next meeting in 2 hours
									</p>
								</div>
							</div>
							<div className="flex items-center gap-4">
								<div className="rounded-full bg-primary/10 p-2">
									<FileText className="h-4 w-4 text-primary" />
								</div>
								<div>
									<p className="text-sm font-medium">
										5 documents to review
									</p>
									<p className="text-xs text-muted-foreground">
										3 are urgent
									</p>
								</div>
							</div>
							<div className="flex items-center gap-4">
								<div className="rounded-full bg-destructive/10 p-2">
									<AlertCircle className="h-4 w-4 text-destructive" />
								</div>
								<div>
									<p className="text-sm font-medium">
										2 students need attention
									</p>
									<p className="text-xs text-muted-foreground">
										No interaction for 7+ days
									</p>
								</div>
							</div>
						</div>
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
							{upcomingMeetings.map((meeting) => (
								<div
									key={meeting.id}
									className="flex items-start gap-4"
								>
									<div className="rounded-full bg-primary/10 p-2">
										<Clock className="h-4 w-4 text-primary" />
									</div>
									<div>
										<p className="text-sm font-medium">
											{meeting.title}
										</p>
										<p className="text-xs text-muted-foreground">
											{new Date(
												meeting.date
											).toLocaleDateString()}{' '}
											at {meeting.time}
										</p>
										<p className="text-xs text-muted-foreground">
											With {meeting.with}
										</p>
									</div>
								</div>
							))}
							<Button
								size="sm"
								variant="outline"
								className="w-full"
							>
								View All Meetings
							</Button>
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
							{inactiveStudents.map((student) => (
								<div
									key={student.id}
									className="flex items-start gap-4"
								>
									<Avatar className="h-8 w-8">
										<AvatarImage
											src={student.avatar}
											alt={student.name}
										/>
										<AvatarFallback>
											{student.name.charAt(0)}
										</AvatarFallback>
									</Avatar>
									<div className="flex-1">
										<p className="text-sm font-medium">
											{student.name}
										</p>
										<p className="text-xs text-muted-foreground">
											Last interaction: 8 days ago
										</p>
									</div>
									<Button size="sm" variant="outline">
										<MessageSquare className="mr-2 h-4 w-4" />
										Message
									</Button>
								</div>
							))}
							<Button
								size="sm"
								variant="outline"
								className="w-full"
							>
								View All
							</Button>
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
									{data && data.data && data.data.length > 0
										? data.data.map((student) => (
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
														>
															<MessageSquare className="mr-2 h-4 w-4" />
															Message
														</Button>
														<Button
															size="sm"
															variant="outline"
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
									data.data.filter(
										(student) => !student.inactive
									).length > 0 ? (
										data.data
											.filter(
												(student) => !student.inactive
											)
											.map((student) => (
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
														>
															<MessageSquare className="mr-2 h-4 w-4" />
															Message
														</Button>
														<Button
															size="sm"
															variant="outline"
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
									data.data.filter(
										(student) => student.inactive
									).length > 0 ? (
										data.data
											.filter(
												(student) => student.inactive
											)
											.map((student) => (
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
														>
															<MessageSquare className="mr-2 h-4 w-4" />
															Message
														</Button>
														<Button
															size="sm"
															variant="outline"
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
