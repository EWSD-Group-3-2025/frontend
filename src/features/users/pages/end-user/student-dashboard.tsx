import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Calendar, MessageSquare, FileText, Clock } from 'lucide-react';
import { tutors, messages, meetings, documents } from '@/data';

export function StudentDashboard() {
	// Get assigned tutor
	const myTutor = tutors[0];

	// Get recent messages
	const recentMessages = messages.slice(0, 3);

	// Get upcoming meetings
	const upcomingMeetings = meetings
		.filter((meeting) => new Date(meeting.date) > new Date())
		.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
		.slice(0, 2);

	// TODO Use recent documents
	// Get recent documents
	const recentDocuments = documents.slice(0, 3);
	console.log(recentDocuments);

	return (
		<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			<Card className="col-span-full md:col-span-1">
				<CardHeader>
					<CardTitle>My Personal Tutor</CardTitle>
					<CardDescription>
						Your assigned personal tutor
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex items-center gap-4">
						<Avatar className="h-12 w-12">
							<AvatarImage
								src={myTutor.avatar}
								alt={myTutor.name}
							/>
							<AvatarFallback>
								{myTutor.name.charAt(0)}
							</AvatarFallback>
						</Avatar>
						<div>
							<p className="font-medium">{myTutor.name}</p>
							<p className="text-sm text-muted-foreground">
								{myTutor.department}
							</p>
							<p className="text-sm text-muted-foreground">
								{myTutor.email}
							</p>
						</div>
					</div>
					<div className="mt-4 flex gap-2">
						<Button size="sm" variant="outline" className="w-full">
							<MessageSquare className="mr-2 h-4 w-4" />
							Message
						</Button>
						<Button size="sm" variant="outline" className="w-full">
							<Calendar className="mr-2 h-4 w-4" />
							Schedule Meeting
						</Button>
					</div>
				</CardContent>
			</Card>

			<Card className="col-span-full md:col-span-1">
				<CardHeader>
					<CardTitle>Recent Activity</CardTitle>
					<CardDescription>Your recent interactions</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="flex items-center gap-4">
							<div className="rounded-full bg-primary/10 p-2">
								<MessageSquare className="h-4 w-4 text-primary" />
							</div>
							<div>
								<p className="text-sm font-medium">
									3 new messages
								</p>
								<p className="text-xs text-muted-foreground">
									Last message 2 hours ago
								</p>
							</div>
						</div>
						<div className="flex items-center gap-4">
							<div className="rounded-full bg-primary/10 p-2">
								<Calendar className="h-4 w-4 text-primary" />
							</div>
							<div>
								<p className="text-sm font-medium">
									Upcoming meeting
								</p>
								<p className="text-xs text-muted-foreground">
									Tomorrow at 10:00 AM
								</p>
							</div>
						</div>
						<div className="flex items-center gap-4">
							<div className="rounded-full bg-primary/10 p-2">
								<FileText className="h-4 w-4 text-primary" />
							</div>
							<div>
								<p className="text-sm font-medium">
									Document feedback
								</p>
								<p className="text-xs text-muted-foreground">
									Received 1 day ago
								</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card className="col-span-full md:col-span-1">
				<CardHeader>
					<CardTitle>Upcoming Meetings</CardTitle>
					<CardDescription>Your scheduled meetings</CardDescription>
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
										{meeting.type}
									</p>
								</div>
							</div>
						))}
						<Button size="sm" variant="outline" className="w-full">
							View All Meetings
						</Button>
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
						{recentMessages.map((message) => (
							<div
								key={message.id}
								className="flex items-start gap-4"
							>
								<Avatar className="h-8 w-8">
									<AvatarImage
										src={message.sender.avatar}
										alt={message.sender.name}
									/>
									<AvatarFallback>
										{message.sender.name.charAt(0)}
									</AvatarFallback>
								</Avatar>
								<div className="flex-1">
									<div className="flex items-center gap-2">
										<p className="text-sm font-medium">
											{message.sender.name}
										</p>
										<p className="text-xs text-muted-foreground">
											{new Date(
												message.timestamp
											).toLocaleDateString()}
										</p>
									</div>
									<p className="text-sm">{message.content}</p>
								</div>
							</div>
						))}
						<Button size="sm" variant="outline" className="w-full">
							View All Messages
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
