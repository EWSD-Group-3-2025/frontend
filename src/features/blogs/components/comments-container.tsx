import { FormEvent, useState } from 'react';
import { Blog } from '../types';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Edit, Trash } from 'lucide-react';
import { CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNewComment, deleteComment, updateComment } from '../api';
import { toast } from 'sonner';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface CommentsContainerProps {
	blog: Blog;
}

export default function CommentsContainer({ blog }: CommentsContainerProps) {
	const queryClient = useQueryClient();
	const [newComment, setNewComment] = useState('');
	const [editMode, setEditMode] = useState<number | null>(null);
	const [editCommentText, setEditCommentText] = useState('');

	const { mutateAsync: createCommentFn, isPending: createCommentPending } =
		useMutation({
			mutationFn: async ({
				blogId,
				commentText,
			}: {
				blogId: number;
				commentText: string;
			}): Promise<HTTPResponse> =>
				await createNewComment({ blogId, commentText })
					.then((response) => {
						if (response.status === 201) {
							queryClient.invalidateQueries({
								queryKey: ['get-all-blogs-for-current-user'],
							});
							queryClient.invalidateQueries({
								queryKey: ['get-all-blogs-by-current-user'],
							});

							return response.data;
						}

						throw new Error('Blog comment create Fail!');
					})
					.catch((e) => {
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

	const { mutateAsync: updateCommentFn, isPending: updateCommentPending } =
		useMutation({
			mutationFn: async ({
				commentId,
				blogId,
				commentText,
			}: {
				commentId: number;
				blogId: number;
				commentText: string;
			}): Promise<HTTPResponse> =>
				await updateComment({ commentId, blogId, commentText })
					.then((response) => {
						if (response.status === 200) {
							queryClient.invalidateQueries({
								queryKey: ['get-all-blogs-for-current-user'],
							});
							queryClient.invalidateQueries({
								queryKey: ['get-all-blogs-by-current-user'],
							});

							return response.data;
						}

						throw new Error('Blog comment update Fail!');
					})
					.catch((e) => {
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

	const { mutateAsync: deleteCommentFn, isPending: deleteCommentPending } =
		useMutation({
			mutationFn: async ({
				commentId,
			}: {
				commentId: number;
			}): Promise<HTTPResponse> =>
				await deleteComment({ commentId })
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

						throw new Error('Blog comment delete Fail!');
					})
					.catch((e) => {
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

	const handleAddComment = async (e?: FormEvent) => {
		e?.preventDefault();

		if (blog && newComment !== '') {
			const res = await createCommentFn({
				blogId: blog.id,
				commentText: newComment,
			});
			toast.success(res.message);
			setNewComment('');
		}
	};

	const handleUpdateComment = async (e?: FormEvent) => {
		e?.preventDefault();

		if (blog && editCommentText !== '' && editMode !== null) {
			const res = await updateCommentFn({
				commentId: editMode,
				blogId: blog.id,
				commentText: editCommentText,
			});
			toast.success(res.message);
			setEditCommentText('');
			setEditMode(null);
		}
	};

	const handleDeleteComment = async (commentId: number) => {
		if (!!commentId) {
			await deleteCommentFn({
				commentId: commentId,
			});
			toast.success('Comment deleted successfully');
		}
	};

	const isPending =
		createCommentPending || updateCommentPending || deleteCommentPending;

	return (
		<CardContent className="border-t pt-4">
			<h3 className="mb-2 text-lg font-semibold">Comments</h3>
			{/* Add Comment */}
			<form
				onSubmit={handleAddComment}
				className="mb-4 flex flex-col gap-2"
			>
				<Textarea
					disabled={isPending}
					placeholder="Add a comment..."
					value={newComment}
					onChange={(e) => {
						setNewComment(e.target.value);
					}}
					onKeyDown={async (e) => {
						if (e.code === 'Enter') {
							await handleAddComment();
						}
					}}
					className="flex-1"
				/>
				<Button disabled={isPending} type="submit">
					Comment
				</Button>
			</form>

			<div className="mt-8 space-y-3">
				{blog?.commentList?.map((comment) => (
					<div
						key={comment.id}
						className="flex items-center justify-between border-b pb-4 last:border-b-0"
					>
						{editMode === comment.id ? (
							<form
								onSubmit={handleUpdateComment}
								className="flex w-full flex-col gap-2"
							>
								<Textarea
									value={editCommentText}
									onKeyDown={async (e) => {
										if (e.code === 'Enter') {
											await handleUpdateComment();
										}
									}}
									onChange={(e) =>
										setEditCommentText(e.target.value)
									}
									className="flex-1"
								/>
								<div className="flex items-center gap-x-2">
									<Button
										type="button"
										variant="ghost"
										onClick={() => setEditMode(null)}
									>
										Cancel
									</Button>
									<Button type="submit">Save</Button>
								</div>
							</form>
						) : (
							<div className="flex flex-1 gap-x-2">
								<Avatar>
									<AvatarFallback>
										{comment.commenterName.charAt(0)}
									</AvatarFallback>
								</Avatar>
								<div>
									<div className="flex items-center gap-x-2">
										<p className="text-sm text-muted-foreground">
											{comment.commenterName}
										</p>
										<span className="text-xs text-muted-foreground">
											{format(
												new Date(comment.createdAt),
												'do MMM yyyy, hh:mm a'
											)}
										</span>
									</div>
									<p className="text-sm text-muted-foreground">
										{comment.commentText}
									</p>
								</div>
							</div>
						)}
						<div className="flex gap-2">
							<Button
								size="sm"
								variant="ghost"
								onClick={() => {
									setEditMode(comment.id);
									setEditCommentText(comment.commentText);
								}}
							>
								<Edit className="h-4 w-4" />
							</Button>
							<Button
								size="sm"
								variant="destructive"
								onClick={async () => {
									await handleDeleteComment(comment.id);
								}}
							>
								<Trash className="h-4 w-4" />
							</Button>
						</div>
					</div>
				))}
			</div>
		</CardContent>
	);
}
