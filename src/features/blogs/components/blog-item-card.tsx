import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Blog } from '@/features/blogs/types';
import { MessageSquare, ThumbsUp } from 'lucide-react';
import { useOpenBlogMutationDialogStore } from '../store/open-blog-mutation-dialog-store';
import { format } from 'date-fns';
import useConfirmDialog from '@/hooks/use-confirm-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteBlog } from '../api';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface BlogItemCardProps {
	blog: Blog;
}

export default function BlogItemCard({ blog }: BlogItemCardProps) {
	const queryClient = useQueryClient();
	const [DeleteConfirmDialog, deleteConfirm] = useConfirmDialog(
		'Are you sure?',
		'This process cannot be undo and will delete the blog permanently.'
	);
	const { setIsOpen } = useOpenBlogMutationDialogStore();

	const { mutateAsync: deleteBlogFn, isPending: deleteBlogPending } =
		useMutation({
			mutationFn: async ({
				blogId,
			}: {
				blogId: number;
			}): Promise<HTTPResponse> =>
				await deleteBlog(blogId)
					.then((response) => {
						if (response.status === 204) {
							queryClient.invalidateQueries({
								queryKey: ['get-all-blogs-for-current-user'],
							});
							queryClient.invalidateQueries({
								queryKey: ['get-all-blogs-by-current-user'],
							});

							return response.data;
						}

						throw new Error('Blog delete Fail!');
					})
					.catch((e) => {
						setIsOpen({
							isOpen: false,
							blog: null,
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

	const handleBlogDelete = async () => {
		if (blog) {
			const isOk = await deleteConfirm();

			if (isOk) {
				await deleteBlogFn({ blogId: blog.id });
				toast.success('Successfully deleted the blog');
			}
		}
	};

	return (
		<>
			<DeleteConfirmDialog />
			<Card key={blog.id}>
				<CardHeader>
					<div className="flex items-center gap-4">
						<Avatar>
							<AvatarFallback>
								{blog.authorName.charAt(0)}
							</AvatarFallback>
						</Avatar>
						<div>
							<CardTitle className="text-xl">
								{blog.title}
							</CardTitle>
							<CardDescription>
								<span>
									{format(
										new Date(blog.createdAt),
										'do MMMM yyyy'
									)}
								</span>
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<p className="whitespace-pre-line">{blog.content}</p>
					{/* <div className="mt-4 flex flex-wrap gap-2">
                                        {blog.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div> */}
				</CardContent>
				<CardFooter className="flex justify-between border-t p-4">
					<div className="flex items-center gap-4">
						<Button variant="ghost" size="sm" className="gap-1">
							<ThumbsUp className="h-4 w-4" />
							{/* <span>{blog.likes}</span> */}
						</Button>
						<Button variant="ghost" size="sm" className="gap-1">
							<MessageSquare className="h-4 w-4" />
							{/* <span>{blog.comments.length}</span> */}
						</Button>
					</div>
					<div className="flex gap-2">
						<Button
							disabled={deleteBlogPending}
							onClick={() => {
								setIsOpen({ isOpen: true, blog });
							}}
							variant="outline"
							size="sm"
						>
							Edit
						</Button>
						<Button
							disabled={deleteBlogPending}
							onClick={handleBlogDelete}
							variant="destructive"
							size="sm"
						>
							Delete
						</Button>
					</div>
				</CardFooter>
			</Card>
		</>
	);
}

export const BlogItemCardSkeleton = () => {
	return (
		<Card className="space-y-2">
			<Skeleton className="h-[60px] w-full" />
			<Skeleton className="h-[180px] w-full" />
		</Card>
	);
};
