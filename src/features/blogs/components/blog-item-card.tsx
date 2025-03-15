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
import { useOpenBlogMutationDialogStore } from '../store/open-blog-mutation-dialog-store';
import { format } from 'date-fns';
import useConfirmDialog from '@/hooks/use-confirm-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBlogReact, deleteBlog } from '../api';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import CommentsContainer from './comments-container';
import EmojiPickerComponent from '@/components/emoji-picker-component';
import { useMemo } from 'react';
import { useAuth } from '@/context/auth.context';

interface BlogItemCardProps {
	blog: Blog;
}

export default function BlogItemCard({ blog }: BlogItemCardProps) {
	const { user } = useAuth();
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

	const { mutateAsync: createBlogReactFn } = useMutation({
		mutationFn: async ({
			blogId,
			react,
		}: {
			blogId: number;
			react: string | null;
		}): Promise<HTTPResponse> =>
			await createBlogReact({ blogId, react })
				.then((response) => {
					if (response.status === 201 || response.status === 204) {
						queryClient.invalidateQueries({
							queryKey: ['get-all-blogs-for-current-user'],
						});
						queryClient.invalidateQueries({
							queryKey: ['get-all-blogs-by-current-user'],
						});

						return response.data;
					}

					throw new Error('Blog react create Fail!');
				})
				.catch((e) => {
					setIsOpen({
						isOpen: false,
						blog: null,
					});

					toast.error(e.response?.data?.data ?? 'Request Failed', {
						description:
							e.response?.data?.message ??
							'Something wrong plz try again',
					});
					throw e;
				}),
	});

	const handleCreateBlogReact = async (react: string) => {
		if (blog && react !== '' && user) {
			let newReact: string | null = null;
			const [currentUserReaction] = blog.reactList.filter(
				(r) => r.authorId === user?.id && r.authorName === user?.name
			);

			if (currentUserReaction) {
				if (currentUserReaction.react !== react) {
					newReact = react;
				}
			} else {
				newReact = react;
			}

			await createBlogReactFn({ blogId: blog.id, react: newReact });
		}
	};

	const groupedReactions = useMemo(() => {
		return blog.reactList?.reduce(
			(acc, react) => {
				acc[react.react] = (acc[react.react] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>
		);
	}, [blog.reactList]);

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
						<div className="flex w-full items-center justify-between gap-x-3">
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
							{blog.authorId === user?.id && (
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
										onClick={async () =>
											await handleBlogDelete()
										}
										variant="destructive"
										size="sm"
									>
										Delete
									</Button>
								</div>
							)}
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<p className="whitespace-pre-line">{blog.content}</p>
				</CardContent>
				<CardFooter className="flex justify-between border-t p-4">
					<div className="flex items-center gap-1">
						{groupedReactions &&
							Object.entries(groupedReactions).map(
								([emoji, count]) => (
									<Button
										key={emoji}
										variant="ghost"
										size="sm"
										className="gap-1"
									>
										{emoji} {count}
									</Button>
								)
							)}
						<div>
							<EmojiPickerComponent
								onEmojiSelect={async (e) => {
									await handleCreateBlogReact(e.native);
								}}
							/>
						</div>
					</div>
				</CardFooter>
				<CommentsContainer blog={blog} />
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
