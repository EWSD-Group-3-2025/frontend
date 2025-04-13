import { Star, Download, Edit, Trash } from 'lucide-react';

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
import BookMutationDialog from './book-mutation-dialog';
import { useOpenBookMutationDialogStore } from '../store/open-book-mutation-dialog-store';
import { downloadFile } from '@/utils/client-side-file-download';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteItem, getAll } from '@/features/books/api';
import { Skeleton } from '@/components/ui/skeleton';
import { userStore } from '@/store/use-user-data-store';
import useConfirmDialog from '@/hooks/use-confirm-dialog';
import { toast } from 'sonner';
import { USER_ROLE } from '@/constants';

enum BookCategory {
	COMPUTER_SCIENCE = 1,
	PROGRAMMING = 2,
	PROJECT_MANAGEMENT = 3,
	DATABASE = 4,
	OPERATION_SYSTEM = 5,
}

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

function getCategoryColor(categoryName: string) {
	switch (categoryName.toLowerCase()) {
		case 'computer science':
			return 'bg-teal-300 hover:bg-teal-400';
		case 'programming':
			return 'bg-blue-500 hover:bg-blue-600';
		case 'project management':
			return 'bg-yellow-500 hover:bg-yellow-600';
		case 'database':
			return 'bg-green-500 hover:bg-green-600';
		case 'operating system':
			return 'bg-purple-500 hover:bg-purple-600';
		default:
			return 'bg-gray-500 hover:bg-gray-600';
	}
}

function canEditOrDelete(resourceUploaderId: number, authId: number): boolean {
	return resourceUploaderId === authId;
}

export function BooksView() {
	const { setIsOpen } = useOpenBookMutationDialogStore();
	const { userData } = userStore();

	const { data, isLoading } = useQuery<HTTPResponse<Book[]>>({
		queryKey: ['get-all-books'],
		queryFn: async (): Promise<HTTPResponse<Book[]>> => {
			const response = await getAll();
			return response.data;
		},
	});
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
						{userData?.roleName !== USER_ROLE.STUDENT && (
							<Button
								onClick={() => {
									setIsOpen({ isOpen: true, book: null });
								}}
								size={'sm'}
							>
								Add New Book
							</Button>
						)}
					</div>
				</div>

				<Tabs defaultValue="ALL" className="w-full">
					<TabsList className="grid h-full w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-6">
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
							{data && !isLoading
								? data?.data.map((resource) => (
										<ResourceCard
											key={resource.id}
											resource={resource}
										/>
									))
								: Array.from({ length: 6 }).map((_, i) => (
										<SkeletonCard key={i} />
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
								{data &&
									!isLoading &&
									type !== 'ALL' &&
									data.data
										.filter(
											(resource) =>
												resource.categoryId ===
												getCategoryById(type)
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
	const { userData } = userStore();
	const queryClient = useQueryClient();
	const { setIsOpen } = useOpenBookMutationDialogStore();
	const [DeleteConfirmDialog, deleteConfirm] = useConfirmDialog(
		'Are you sure?',
		'This process cannot be undo and will delete the books permanently.'
	);
	const { mutateAsync } = useMutation({
		mutationFn: async (id: number) =>
			await deleteItem(id).then((response) => {
				if (response.status === 204) {
					toast.success('Successfully deleted the book');
					setIsOpen({ isOpen: false, book: null });
					queryClient.invalidateQueries({
						queryKey: ['get-all-books'],
					});
					return response.data;
				}
			}),
	});

	const handleDelete = async () => {
		if (resource) {
			const isOk = await deleteConfirm();

			if (isOk) {
				await mutateAsync(resource.id);
				toast.success('Successfully deleted the book');
			}
		}
	};

	return (
		<>
			<DeleteConfirmDialog />

			<Card className="relative flex h-full flex-col overflow-hidden">
				<div className="absolute right-2 top-2 flex gap-1">
					{canEditOrDelete(
						resource.uploaderId,
						userData?.id ?? 0
					) && (
						<>
							<Button
								variant="ghost"
								size="icon"
								onClick={() => {
									setIsOpen({ isOpen: true, book: resource });
								}}
							>
								<Edit className="h-4 w-4" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								onClick={async () => await handleDelete()}
							>
								<Trash className="h-4 w-4 text-red-500" />
							</Button>
						</>
					)}
				</div>
				<CardHeader className="pb-3">
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<Badge
							className={`${getCategoryColor(resource.categoryName)}`}
						>
							{resource.categoryName}
						</Badge>
					</div>
					<CardTitle className="mt-2 text-lg">
						{resource.bookName}
					</CardTitle>
					{resource?.description && (
						<CardDescription className="mt-2 text-lg">
							{resource.description}
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
								downloadFile(
									resource.bookUrl,
									resource.bookName
								);
							}}
						>
							<span>Download</span>
							<Download className="h-3 w-3" />
						</Button>
					</div>
				</CardFooter>
			</Card>
		</>
	);
}

function SkeletonCard() {
	return (
		<Card className="flex h-full flex-col overflow-hidden">
			<CardHeader className="pb-3">
				<Skeleton className="h-6 w-3/4" />
				<Skeleton className="mt-2 h-4 w-1/2" />
			</CardHeader>
			<CardContent className="flex-grow pb-3">
				<div className="flex items-center gap-2">
					<Skeleton className="h-4 w-1/3" />
				</div>
				<div className="mt-3 flex items-center gap-2">
					<Skeleton className="mb-2 h-4 w-1/4" />
				</div>
				<div className="flex items-center gap-2">
					<Skeleton className="h-4 w-1/4" />
				</div>
				<div className="mt-2 flex items-center gap-1">
					{Array.from({ length: 5 }).map((_, i) => (
						<Skeleton key={i} className="h-4 w-4 rounded-full" />
					))}
					<Skeleton className="ml-1 h-4 w-8" />
				</div>
			</CardContent>
			<CardFooter className="flex items-center justify-between pt-0">
				<Skeleton className="h-6 w-20" />
				<Skeleton className="h-8 w-24" />
			</CardFooter>
		</Card>
	);
}

function getCategoryById(categoryKey: string): number | undefined {
	return BookCategory[categoryKey as keyof typeof BookCategory];
}
