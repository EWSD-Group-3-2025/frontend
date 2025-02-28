'use client';

import type React from 'react';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarPlus, Video, Users } from 'lucide-react';
import { meetings as initialMeetings, students, tutors } from '@/data';
import { useAuth } from '@/context/auth.context';
import { USER_ROLE } from '@/constants';
import { Calendar } from '@/components/ui/calendar';

export function MeetingsView() {
	const { user } = useAuth();
	const [meetings, setMeetings] = useState(initialMeetings);
	const [date, setDate] = useState<Date | undefined>(new Date());
	const [dialogOpen, setDialogOpen] = useState(false);

	const contacts = user?.roleName === USER_ROLE.STUDENT ? tutors : students;

	const upcomingMeetings = meetings
		.filter((meeting) => new Date(meeting.date) > new Date())
		.sort(
			(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
		);

	const pastMeetings = meetings
		.filter((meeting) => new Date(meeting.date) <= new Date())
		.sort(
			(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
		);

	const handleCreateMeeting = (e: React.FormEvent) => {
		e.preventDefault();

		// In a real app, you would save the meeting to the database
		setDialogOpen(false);
	};

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
				<h1 className="text-2xl font-bold tracking-tight">Meetings</h1>
				<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
					<DialogTrigger asChild>
						<Button>
							<CalendarPlus className="mr-2 h-4 w-4" />
							Schedule Meeting
						</Button>
					</DialogTrigger>
					<DialogContent>
						<form onSubmit={handleCreateMeeting}>
							<DialogHeader>
								<DialogTitle>Schedule a Meeting</DialogTitle>
								<DialogDescription>
									Create a new meeting with a student or
									tutor.
								</DialogDescription>
							</DialogHeader>
							<div className="grid gap-4 py-4">
								<div className="grid gap-2">
									<Label htmlFor="title">Meeting Title</Label>
									<Input
										id="title"
										placeholder="Weekly Check-in"
										required
									/>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="with">With</Label>
									<Select required>
										<SelectTrigger>
											<SelectValue placeholder="Select a person" />
										</SelectTrigger>
										<SelectContent>
											{contacts.map((contact) => (
												<SelectItem
													key={contact.id}
													value={contact.id}
												>
													{contact.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div className="grid gap-2">
									<Label>Date</Label>
									<Calendar
										mode="single"
										selected={date}
										onSelect={setDate}
										className="rounded-md border"
									/>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div className="grid gap-2">
										<Label htmlFor="time">Time</Label>
										<Input id="time" type="time" required />
									</div>
									<div className="grid gap-2">
										<Label htmlFor="duration">
											Duration
										</Label>
										<Select defaultValue="30">
											<SelectTrigger>
												<SelectValue placeholder="Duration" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="15">
													15 minutes
												</SelectItem>
												<SelectItem value="30">
													30 minutes
												</SelectItem>
												<SelectItem value="45">
													45 minutes
												</SelectItem>
												<SelectItem value="60">
													1 hour
												</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="type">Meeting Type</Label>
									<Select defaultValue="virtual">
										<SelectTrigger>
											<SelectValue placeholder="Meeting Type" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="virtual">
												Virtual
											</SelectItem>
											<SelectItem value="in-person">
												In-Person
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="notes">Notes</Label>
									<Input
										id="notes"
										placeholder="Any additional information"
									/>
								</div>
							</div>
							<DialogFooter>
								<Button type="submit">Schedule Meeting</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>
			</div>

			<Tabs defaultValue="upcoming">
				<TabsList className="mb-4">
					<TabsTrigger value="upcoming">Upcoming</TabsTrigger>
					<TabsTrigger value="past">Past</TabsTrigger>
				</TabsList>
				<TabsContent value="upcoming" className="space-y-4">
					{upcomingMeetings.length > 0 ? (
						upcomingMeetings.map((meeting) => (
							<Card key={meeting.id}>
								<CardContent className="p-6">
									<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
										<div className="flex items-start gap-4">
											<Avatar className="mt-1 h-10 w-10">
												<AvatarImage
													src="/placeholder.svg?height=40&width=40"
													alt="Avatar"
												/>
												<AvatarFallback>
													{meeting.with.charAt(0)}
												</AvatarFallback>
											</Avatar>
											<div>
												<h3 className="font-semibold">
													{meeting.title}
												</h3>
												<p className="text-sm text-muted-foreground">
													With {meeting.with}
												</p>
												<div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
													<span>
														{new Date(
															meeting.date
														).toLocaleDateString()}{' '}
														at {meeting.time}
													</span>
													<span>•</span>
													<span>{meeting.type}</span>
												</div>
											</div>
										</div>
										<div className="flex gap-2">
											{meeting.type === 'Virtual' && (
												<Button
													variant="outline"
													size="sm"
												>
													<Video className="mr-2 h-4 w-4" />
													Join
												</Button>
											)}
											<Button variant="outline" size="sm">
												Reschedule
											</Button>
											<Button
												variant="destructive"
												size="sm"
											>
												Cancel
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						))
					) : (
						<Card>
							<CardContent className="flex flex-col items-center justify-center p-6">
								<div className="rounded-full bg-muted p-3">
									<CalendarPlus className="h-6 w-6 text-muted-foreground" />
								</div>
								<h3 className="mt-3 font-medium">
									No upcoming meetings
								</h3>
								<p className="text-sm text-muted-foreground">
									Schedule a meeting to get started
								</p>
								<Button
									className="mt-4"
									onClick={() => setDialogOpen(true)}
								>
									Schedule Meeting
								</Button>
							</CardContent>
						</Card>
					)}
				</TabsContent>
				<TabsContent value="past" className="space-y-4">
					{pastMeetings.length > 0 ? (
						pastMeetings.map((meeting) => (
							<Card key={meeting.id}>
								<CardContent className="p-6">
									<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
										<div className="flex items-start gap-4">
											<Avatar className="mt-1 h-10 w-10">
												<AvatarImage
													src="/placeholder.svg?height=40&width=40"
													alt="Avatar"
												/>
												<AvatarFallback>
													{meeting.with.charAt(0)}
												</AvatarFallback>
											</Avatar>
											<div>
												<h3 className="font-semibold">
													{meeting.title}
												</h3>
												<p className="text-sm text-muted-foreground">
													With {meeting.with}
												</p>
												<div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
													<span>
														{new Date(
															meeting.date
														).toLocaleDateString()}{' '}
														at {meeting.time}
													</span>
													<span>•</span>
													<span>{meeting.type}</span>
												</div>
											</div>
										</div>
										<div className="flex gap-2">
											<Button variant="outline" size="sm">
												View Notes
											</Button>
											<Button variant="outline" size="sm">
												Schedule Follow-up
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						))
					) : (
						<Card>
							<CardContent className="flex flex-col items-center justify-center p-6">
								<div className="rounded-full bg-muted p-3">
									<Users className="h-6 w-6 text-muted-foreground" />
								</div>
								<h3 className="mt-3 font-medium">
									No past meetings
								</h3>
								<p className="text-sm text-muted-foreground">
									Your meeting history will appear here
								</p>
							</CardContent>
						</Card>
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
}
