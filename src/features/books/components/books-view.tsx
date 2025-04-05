import { Star, Download } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Book } from '../types';
import BookMutationDialog from './book-mutation-dialog';
import { useOpenBookMutationDialogStore } from '../store/open-book-mutation-dialog-store';
import { downloadFile } from '@/utils/client-side-file-download';

const dummyBooks: Book[] = [
	{
		id: 1,
		bookName: 'Introduction to Algorithms',
		categoryId: 0,
		bookDescription: 'This is book description',
		difficultyLevel: 'Advanced',
		rating: 4.8,
		organizationName: 'MIT Press',
		organizationUrl: 'https://mitpress.mit.edu',
		bookUrl: 'bookurl',
		uploaderId: 1,
		categoryName: 'PROGRAMMING',
		uploaderName: 'Alice Johnson',
		createdAt: new Date('2024-01-10T10:00:00Z'),
		updatedAt: new Date('2024-01-15T12:00:00Z'),
	},
	{
		id: 2,
		bookName: 'Clean Code',
		categoryId: 1,
		bookDescription: 'This is book description',
		difficultyLevel: 'Intermediate',
		rating: 4.7,
		organizationName: 'Prentice Hall',
		organizationUrl: 'https://pearson.com',
		bookUrl: 'bookurl',
		uploaderId: 1,
		categoryName: 'COMPUTER_SCIENCE',
		uploaderName: 'Bob Smith',
		createdAt: new Date('2023-12-01T09:00:00Z'),
		updatedAt: new Date('2023-12-05T14:30:00Z'),
	},
	{
		id: 3,
		bookName: 'The Pragmatic Programmer',
		categoryId: 1,
		bookDescription: 'This is book description',
		difficultyLevel: 'Intermediate',
		rating: 4.9,
		organizationName: 'Addison-Wesley',
		organizationUrl: 'https://informit.com',
		bookUrl: 'bookurl',
		uploaderId: 1,
		categoryName: 'COMPUTER_SCIENCE',
		uploaderName: 'Carol Lee',
		createdAt: new Date('2023-11-20T11:15:00Z'),
		updatedAt: new Date('2023-11-22T16:45:00Z'),
	},
	{
		id: 4,
		bookName: 'Database System Concepts',
		categoryId: 2,
		bookDescription: 'This is book description',
		difficultyLevel: 'Advanced',
		rating: 4.6,
		organizationName: 'McGraw-Hill',
		organizationUrl: 'https://mheducation.com',
		bookUrl: 'bookurl',
		uploaderId: 1,
		categoryName: 'COMPUTER_SCIENCE',
		uploaderName: 'David Kim',
		createdAt: new Date('2023-10-10T08:00:00Z'),
		updatedAt: new Date('2023-10-15T10:00:00Z'),
	},
	{
		id: 5,
		bookName: 'Operating System Concepts',
		categoryId: 3,
		bookDescription: 'This is book description',
		difficultyLevel: 'Advanced',
		rating: 4.5,
		organizationName: 'Wiley',
		organizationUrl: 'https://wiley.com',
		bookUrl: 'bookurl',
		uploaderId: 1,
		categoryName: 'COMPUTER_SCIENCE',
		uploaderName: 'Emma Wang',
		createdAt: new Date('2024-02-01T13:00:00Z'),
		updatedAt: new Date('2024-02-05T13:30:00Z'),
	},
	{
		id: 6,
		bookName: 'Agile Project Management',
		categoryId: 4,
		bookDescription: 'This is book description',
		difficultyLevel: 'Beginner',
		rating: 4.2,
		organizationName: "O'Reilly Media",
		organizationUrl: 'https://oreilly.com',
		bookUrl: 'bookurl',
		uploaderId: 1,
		categoryName: 'COMPUTER_SCIENCE',
		uploaderName: 'Frank Zhang',
		createdAt: new Date('2024-03-12T09:45:00Z'),
		updatedAt: new Date('2024-03-15T11:00:00Z'),
	},
	{
		id: 7,
		bookName: 'Computer Networking: A Top-Down Approach',
		categoryId: 0,
		bookDescription: 'This is book description',
		difficultyLevel: 'Intermediate',
		rating: 4.4,
		organizationName: 'Pearson',
		organizationUrl: 'https://pearson.com',
		bookUrl: 'bookurl',
		uploaderId: 1,
		categoryName: 'COMPUTER_SCIENCE',
		uploaderName: 'Grace Liu',
		createdAt: new Date('2023-09-30T07:30:00Z'),
		updatedAt: new Date('2023-10-01T08:00:00Z'),
	},
	{
		id: 8,
		bookName: 'Design Patterns',
		categoryId: 1,
		bookDescription: 'This is book description',
		difficultyLevel: 'Advanced',
		rating: 4.8,
		organizationName: 'Addison-Wesley',
		organizationUrl: 'https://informit.com',
		bookUrl: 'bookurl',
		uploaderId: 1,
		categoryName: 'COMPUTER_SCIENCE',
		uploaderName: 'Hannah Lee',
		createdAt: new Date('2023-08-15T15:00:00Z'),
		updatedAt: new Date('2023-08-16T17:00:00Z'),
	},
	{
		id: 9,
		bookName: 'Scrum: The Art of Doing Twice the Work in Half the Time',
		categoryId: 4,
		bookDescription: 'This is book description',
		difficultyLevel: 'Beginner',
		rating: 4.1,
		organizationName: 'Crown Business',
		organizationUrl: 'https://penguinrandomhouse.com',
		bookUrl: 'bookurl',
		uploaderId: 1,
		categoryName: 'COMPUTER_SCIENCE',
		uploaderName: 'Ian Brown',
		createdAt: new Date('2024-04-01T10:00:00Z'),
		updatedAt: new Date('2024-04-02T12:30:00Z'),
	},
	{
		id: 10,
		bookName: 'Modern Operating Systems',
		categoryId: 3,
		bookDescription: 'This is book description',
		difficultyLevel: 'Advanced',
		rating: 4.3,
		organizationName: 'Pearson',
		organizationUrl: 'https://pearson.com',
		bookUrl: 'bookurl',
		uploaderId: 1,
		categoryName: 'COMPUTER_SCIENCE',
		uploaderName: 'Jane Park',
		createdAt: new Date('2024-03-01T08:00:00Z'),
		updatedAt: new Date('2024-03-02T10:00:00Z'),
	},
	{
		id: 11,
		bookName: 'SQL in 10 Minutes, Sams Teach Yourself',
		categoryId: 2,
		bookDescription: 'This is book description',
		difficultyLevel: 'Beginner',
		rating: 4.0,
		organizationName: 'Sams Publishing',
		organizationUrl: 'https://samspublishing.com',
		bookUrl: 'bookurl',
		uploaderId: 1,
		categoryName: 'COMPUTER_SCIENCE',
		uploaderName: 'Kevin Nguyen',
		createdAt: new Date('2024-01-20T12:00:00Z'),
		updatedAt: new Date('2024-01-22T12:30:00Z'),
	},
	{
		id: 12,
		bookName: 'Head First Programming',
		categoryId: 1,
		bookDescription: 'This is book description',
		difficultyLevel: 'Beginner',
		rating: 4.2,
		organizationName: "O'Reilly Media",
		organizationUrl: 'https://oreilly.com',
		bookUrl: 'bookurl',
		uploaderId: 1,
		categoryName: 'COMPUTER_SCIENCE',
		uploaderName: 'Liam Scott',
		createdAt: new Date('2024-02-10T11:00:00Z'),
		updatedAt: new Date('2024-02-12T13:00:00Z'),
	},
	{
		id: 13,
		bookName: 'Artificial Intelligence: A Modern Approach',
		categoryId: 0,
		bookDescription: 'This is book description',
		difficultyLevel: 'Advanced',
		rating: 4.9,
		organizationName: 'Pearson',
		organizationUrl: 'https://pearson.com',
		bookUrl: 'bookurl',
		uploaderId: 1,
		categoryName: 'COMPUTER_SCIENCE',
		uploaderName: 'Mona Patel',
		createdAt: new Date('2023-12-10T09:30:00Z'),
		updatedAt: new Date('2023-12-12T10:45:00Z'),
	},
	{
		id: 14,
		bookName: 'Beginning Database Design',
		categoryId: 2,
		bookDescription: 'This is book description',
		difficultyLevel: 'Beginner',
		rating: 3.9,
		organizationName: 'Apress',
		organizationUrl: 'https://apress.com',
		bookUrl: 'bookurl',
		uploaderId: 1,
		categoryName: 'COMPUTER_SCIENCE',
		uploaderName: 'Nathan Lee',
		createdAt: new Date('2024-03-18T14:00:00Z'),
		updatedAt: new Date('2024-03-19T15:00:00Z'),
	},
	{
		id: 15,
		bookName: 'Project Management for the Unofficial Project Manager',
		categoryId: 4,
		bookDescription: 'This is book description',
		difficultyLevel: 'Intermediate',
		rating: 4.3,
		organizationName: 'FranklinCovey',
		organizationUrl: 'https://franklincovey.com',
		bookUrl: 'bookurl',
		uploaderId: 1,
		categoryName: 'COMPUTER_SCIENCE',
		uploaderName: 'Olivia Harris',
		createdAt: new Date('2024-04-03T10:45:00Z'),
		updatedAt: new Date('2024-04-04T12:00:00Z'),
	},
];

// Helper function to get color for difficulty level
function getDifficultyColor(level: string) {
	switch (level) {
		case 'beginner':
			return 'bg-green-500 hover:bg-green-600';
		case 'intermediate':
			return 'bg-blue-500 hover:bg-blue-600';
		case 'advanced':
			return 'bg-purple-500 hover:bg-purple-600';
		default:
			return 'bg-gray-500 hover:bg-gray-600';
	}
}

export function BooksView() {
	const { setIsOpen } = useOpenBookMutationDialogStore();
	return (
		<div>
			<BookMutationDialog />
			<div className="mx-auto max-w-7xl space-y-8">
				<div className="space-y-2">
					<h1 className="text-3xl font-bold tracking-tight">
						Learning Resources
					</h1>
					<p className="text-muted-foreground">
						Huge collection of the best learning resources for
						various topics.
					</p>
				</div>

				<div className="flex flex-col items-end justify-end gap-4 sm:flex-row sm:items-center">
					<div>
						<Button
							onClick={() => {
								setIsOpen({ isOpen: true, book: null });
							}}
							size={'sm'}
						>
							Add New Book
						</Button>
					</div>
				</div>

				<Tabs defaultValue="ALL" className="w-full">
					<TabsList className="grid grid-cols-3 md:grid-cols-7 lg:w-auto">
						<TabsTrigger value="ALL">All</TabsTrigger>
						<TabsTrigger value="COMPUTER_SCIENCE">
							Computer Science
						</TabsTrigger>
						<TabsTrigger value="PROGRAMMING">
							Programming
						</TabsTrigger>
						<TabsTrigger value="PROJECT_MANAGEMENT">
							Project Management
						</TabsTrigger>
						<TabsTrigger value="DATABASE">Database</TabsTrigger>
						<TabsTrigger value="OPERATION_SYSTEM">
							Operating System
						</TabsTrigger>
					</TabsList>

					<TabsContent value="ALL" className="mt-6">
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
							{dummyBooks.map((resource) => (
								<ResourceCard
									key={resource.id}
									resource={resource}
								/>
							))}
						</div>
					</TabsContent>

					{[
						'ALL',
						'COMPUTER_SCIENCE',
						'PROGRAMMING',
						'PROJECT_MANAGEMENT',
						'DATABASE',
						'OPERATION_SYSTEM',
					].map((type) => (
						<TabsContent key={type} value={type} className="mt-6">
							<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
								{dummyBooks
									.filter(
										(resource) =>
											resource.categoryName === type
									)
									.map((resource) => (
										<ResourceCard
											key={resource.id}
											resource={resource}
										/>
									))}
							</div>
						</TabsContent>
					))}
				</Tabs>

				<Separator className="my-8" />
			</div>
		</div>
	);
}

// Resource Card Component
function ResourceCard({ resource }: { resource: Book }) {
	return (
		<Card className="flex h-full flex-col overflow-hidden">
			<CardHeader className="pb-3">
				<CardTitle className="mt-2 text-lg">
					{resource.bookName}
				</CardTitle>
				{resource?.bookDescription && (
					<CardDescription className="mt-2 text-lg">
						{resource.bookDescription}
					</CardDescription>
				)}
			</CardHeader>
			<CardContent className="flex-grow pb-3">
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					{resource.uploaderName && (
						<div className="flex items-center gap-1">
							Uploaded <span>By {resource.uploaderName}</span>
						</div>
					)}
				</div>
				<div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
					{resource.organizationName && (
						<div className="flex items-center gap-1">
							<span>{resource.organizationName}</span>
						</div>
					)}
				</div>
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					{resource.organizationUrl && (
						<div className="flex items-center gap-1">
							<span>{resource.organizationUrl}</span>
						</div>
					)}
				</div>

				<div className="mt-2 flex items-center gap-1">
					{Array.from({ length: 5 }).map((_, i) => (
						<Star
							key={i}
							className={`h-4 w-4 ${
								i < Math.floor(resource.rating)
									? 'fill-yellow-400 text-yellow-400'
									: i < resource.rating
										? 'fill-yellow-400 text-yellow-400 opacity-50'
										: 'text-muted-foreground'
							}`}
						/>
					))}
					<span className="ml-1 text-sm">
						{resource.rating.toFixed(1)}
					</span>
				</div>
			</CardContent>
			<CardFooter className="flex items-center justify-between pt-0">
				<Badge
					className={`${getDifficultyColor(resource.difficultyLevel.toLowerCase())} capitalize`}
				>
					{resource.difficultyLevel}
				</Badge>

				<div className="flex items-center gap-2">
					<Button
						size="sm"
						onClick={() => {
							downloadFile(resource.bookUrl, resource.bookName);
						}}
					>
						<span>Download</span>
						<Download className="h-3 w-3" />
					</Button>
				</div>
			</CardFooter>
		</Card>
	);
}
