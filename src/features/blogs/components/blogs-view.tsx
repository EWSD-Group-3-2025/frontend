import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { blogPosts as initialBlogPosts } from '@/data';
import BlogMutationDialog from './blog-mutation-dialog';
import { useQuery } from '@tanstack/react-query';
import {
	getBlogsByCurrentUser,
	getBlogsForCurrentUser,
} from '@/features/blogs/api';
import { Blog } from '@/features/blogs/types';
import BlogItemCard, { BlogItemCardSkeleton } from './blog-item-card';
import BlogNotFoundCard from './blog-not-found-card';
import { useOpenBlogMutationDialogStore } from '../store/open-blog-mutation-dialog-store';

export function BlogView() {
	const { setIsOpen } = useOpenBlogMutationDialogStore();
	const [commentDialogOpen, setCommentDialogOpen] = useState(false);

	const {
		data: getAllBlogsByCurrentUser,
		isLoading: isLoadingGetAllBlogsByCurrentUser,
	} = useQuery<HTTPResponse<Blog[]>>({
		queryKey: ['get-all-blogs-by-current-user'],
		queryFn: async (): Promise<HTTPResponse<Blog[]>> =>
			await getBlogsByCurrentUser().then((response) => {
				if (response.data.code === 200) {
					return response.data;
				}

				throw new Error('Fetch Blogs by current user fail!');
			}),
	});

	const {
		data: getAllBlogsForCurrentUser,
		isLoading: isLoadingGetAllBlogsForCurrentUser,
	} = useQuery<HTTPResponse<Blog[]>>({
		queryKey: ['get-all-blogs-for-current-user'],
		queryFn: async (): Promise<HTTPResponse<Blog[]>> =>
			await getBlogsForCurrentUser().then((response) => {
				if (response.data.code === 200) {
					return response.data;
				}

				throw new Error('Fetch Blogs for current user fail!');
			}),
	});

	const handleAddComment = (e: React.FormEvent) => {
		e.preventDefault();
		// In a real app, you would add the comment to the blog post
		setCommentDialogOpen(false);
	};

	return (
		<>
			<BlogMutationDialog />
			<div className="flex flex-col gap-6">
				<div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
					<h1 className="text-2xl font-bold tracking-tight">Blog</h1>
					<Button
						onClick={() => {
							setIsOpen({ isOpen: true, blog: null });
						}}
					>
						Create New Blog
					</Button>
				</div>

				<Tabs defaultValue="all">
					<TabsList className="mb-4">
						<TabsTrigger value="all">All Blogs</TabsTrigger>
						<TabsTrigger value="my">My Blogs</TabsTrigger>
					</TabsList>
					<TabsContent value="all" className="space-y-6">
						{getAllBlogsForCurrentUser &&
						getAllBlogsForCurrentUser?.data.length > 0 ? (
							isLoadingGetAllBlogsForCurrentUser ? (
								[1, 2].map((i) => (
									<BlogItemCardSkeleton key={i} />
								))
							) : (
								getAllBlogsForCurrentUser?.data.map((blog) => (
									<BlogItemCard key={blog.id} blog={blog} />
								))
							)
						) : (
							<BlogNotFoundCard />
						)}
					</TabsContent>
					<TabsContent value="my" className="space-y-6">
						{getAllBlogsByCurrentUser &&
						getAllBlogsByCurrentUser?.data.length > 0 ? (
							isLoadingGetAllBlogsByCurrentUser ? (
								[1, 2].map((i) => (
									<BlogItemCardSkeleton key={i} />
								))
							) : (
								getAllBlogsByCurrentUser?.data.map((blog) => (
									<BlogItemCard key={blog.id} blog={blog} />
								))
							)
						) : (
							<BlogNotFoundCard />
						)}
					</TabsContent>
				</Tabs>

				<Dialog
					open={commentDialogOpen}
					onOpenChange={setCommentDialogOpen}
				>
					<DialogContent>
						<form onSubmit={handleAddComment}>
							<DialogHeader>
								<DialogTitle>Add Comment</DialogTitle>
								<DialogDescription>
									Add a comment to this blog post.
								</DialogDescription>
							</DialogHeader>
							<div className="grid gap-4 py-4">
								<div className="grid gap-2">
									<Label htmlFor="comment">Comment</Label>
									<Textarea
										id="comment"
										placeholder="Your thoughts or feedback"
										className="resize-none"
										rows={5}
										required
									/>
								</div>
							</div>
							<DialogFooter>
								<Button type="submit">Submit Comment</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>
			</div>
		</>
	);
}
