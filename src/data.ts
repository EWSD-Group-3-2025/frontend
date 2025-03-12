import { Document } from './features/documents/types';

export const tutors = [
	{
		id: 't1',
		name: 'Dr. Jane Doe',
		email: 'jane.doe@university.edu',
		department: 'Computer Science',
		avatar: '/placeholder.svg?height=32&width=32',
	},
	{
		id: 't2',
		name: 'Dr. Michael Jack',
		email: 'michael.jack@university.edu',
		department: 'Computer Science',
		avatar: '/placeholder.svg?height=32&width=32',
	},
];

export const students = [
	{
		id: 's1',
		name: 'John Smith',
		email: 'john.smith@university.edu',
		course: 'Introduction to Programming',
		avatar: '/placeholder.svg?height=32&width=32',
	},
	{
		id: 's2',
		name: 'Alice Johnson',
		email: 'alice.johnson@university.edu',
		course: 'Data Structures and Algorithms',
		avatar: '/placeholder.svg?height=32&width=32',
	},
];

export const messages = [
	{
		id: 'msg-1',
		sender: students[0],
		recipient: tutors[0],
		content: 'Hello, Dr. Doe. I have a question about the assignment.',
		timestamp: '2024-03-08T10:00:00Z',
		read: true,
	},
	{
		id: 'msg-2',
		sender: tutors[0],
		recipient: students[0],
		content: "Hi John, I'll get back to you shortly.",
		timestamp: '2024-03-08T10:30:00Z',
		read: true,
	},
];

export const meetings = [
	{
		id: 'm1',
		title: 'Weekly Check-in',
		date: '2024-03-15T14:00:00Z',
		time: '2:00 PM',
		type: 'Virtual',
		with: students[0].name,
	},
	{
		id: 'm2',
		title: 'Project Discussion',
		date: '2024-03-22T10:00:00Z',
		time: '10:00 AM',
		type: 'In-Person',
		with: students[1].name,
	},
];

export const documents: Document[] = [
	{
		id: 1,
		title: 'Assignment 1',
		description: 'First assignment for Introduction to Programming',
		createdAt: new Date('2024-03-01T12:00:00Z'),
		updatedAt: new Date('2024-03-01T12:00:00Z'),
		storedUUID: 'lsajdflajsfdlsajfj',
		fileUrl: 'fileurl',
		filetype: 'pdf',
		storedName: 'Assignment 1',
		userId: 1,
		entityType: 6,
	},
	{
		id: 2,
		title: 'Assignment 2',
		description: 'First assignment for Introduction to Programming',
		createdAt: new Date('2024-03-01T12:00:00Z'),
		updatedAt: new Date('2024-03-01T12:00:00Z'),
		storedUUID: 'lsajdflajsfdlsajfj',
		fileUrl: 'fileurl',
		filetype: 'pdf',
		storedName: 'Assignment 2',
		userId: 1,
		entityType: 6,
	},
];

export const blogPosts = [
	{
		id: 'post-1',
		title: 'My Experience with eTutoring',
		content:
			"I've had a great experience using the eTutoring system. It's been very helpful in understanding the course material.",
		date: '2024-03-05T16:00:00Z',
		author: students[0],
		tags: ['reflection', 'experience'],
		likes: 10,
		comments: [],
	},
	{
		id: 'post-2',
		title: 'Tips for Success in Online Learning',
		content:
			'Here are some tips for success in online learning: stay organized, manage your time effectively, and communicate with your instructors and classmates.',
		date: '2024-03-12T18:00:00Z',
		author: tutors[0],
		tags: ['tips', 'online learning'],
		likes: 5,
		comments: [],
	},
];
