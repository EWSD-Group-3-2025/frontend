import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { createNewBlog, updateBlog } from '@/features/blogs/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useOpenBlogMutationDialogStore } from '../store/open-blog-mutation-dialog-store';

const blogCreateSchema = z.object({
	title: z.string().min(5, {
		message: 'Title must be at least 5 characters.',
	}),
	content: z.string().min(10, {
		message: 'Content must be at least 10 characters.',
	}),
});

export type BlogCreateSchema = z.infer<typeof blogCreateSchema>;

export default function BlogMutationDialog() {
	const {
		blog: initialBlog,
		isOpen,
		setIsOpen,
	} = useOpenBlogMutationDialogStore();
	const queryClient = useQueryClient();

	const form = useForm<z.infer<typeof blogCreateSchema>>({
		resolver: zodResolver(blogCreateSchema),
		defaultValues: {
			title: '',
			content: '',
		},
	});

	const { mutateAsync: createNewBlogFn, isPending: createNewBlogPending } =
		useMutation<HTTPResponse, unknown, BlogCreateSchema>({
			mutationFn: async (
				createBlogBody: BlogCreateSchema
			): Promise<HTTPResponse> =>
				await createNewBlog(createBlogBody)
					.then((response) => {
						if (response.status === 201) {
							queryClient.invalidateQueries({
								queryKey: ['get-all-blogs-for-current-user'],
							});
							queryClient.invalidateQueries({
								queryKey: ['get-all-blogs-by-current-user'],
							});
							setIsOpen({ isOpen: false, blog: null });
							return response.data;
						}

						throw new Error('Blog creation Fail!');
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

	const { mutateAsync: updateBlogFn, isPending: updateBlogPending } =
		useMutation({
			mutationFn: async ({
				blogId,
				createBlogBody,
			}: {
				blogId: number;
				createBlogBody: BlogCreateSchema;
			}): Promise<HTTPResponse> =>
				await updateBlog(blogId, createBlogBody)
					.then((response) => {
						if (response.status === 200) {
							queryClient.invalidateQueries({
								queryKey: ['get-all-blogs-for-current-user'],
							});
							queryClient.invalidateQueries({
								queryKey: ['get-all-blogs-by-current-user'],
							});
							setIsOpen({ isOpen: false, blog: null });
							return response.data;
						}

						throw new Error('Blog update Fail!');
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

	const handleBlogMutation = async (
		values: z.infer<typeof blogCreateSchema>
	) => {
		if (!!initialBlog) {
			const blogUpdateRes = await updateBlogFn({
				blogId: initialBlog.id,
				createBlogBody: values,
			});
			toast.success(blogUpdateRes.message);
		} else {
			const blogCreatedRes = await createNewBlogFn(values);
			toast.success(blogCreatedRes.message);
		}
	};

	useEffect(() => {
		if (initialBlog) {
			form.setValue('title', initialBlog.title);
			form.setValue('content', initialBlog.content);
		}
	}, [initialBlog]);

	const isPending = createNewBlogPending || updateBlogPending;

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(isOpen) => {
				setIsOpen({ isOpen, blog: null });
			}}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{!!initialBlog ? 'Edit Blog' : 'Create New Blog'}{' '}
					</DialogTitle>
					<DialogDescription>
						Share your thoughts, experiences, or questions.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleBlogMutation)}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input
											disabled={isPending}
											placeholder="New Blog Title"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="content"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Content</FormLabel>
									<FormControl>
										<Textarea
											disabled={isPending}
											placeholder="Blog description..."
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<Button disabled={isPending} type="submit">
								{!!initialBlog ? 'Save' : 'Publish'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
