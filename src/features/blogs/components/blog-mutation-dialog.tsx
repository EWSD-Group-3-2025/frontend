import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { PenSquare } from 'lucide-react';
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
import { useState } from 'react';
import { createNewBlog } from '@/features/blogs/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

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
	const queryClient = useQueryClient();
	const [dialogOpen, setDialogOpen] = useState(false);

	const form = useForm<z.infer<typeof blogCreateSchema>>({
		resolver: zodResolver(blogCreateSchema),
		defaultValues: {
			title: '',
			content: '',
		},
	});

	const { mutateAsync: createNewBlogFn } = useMutation<
		HTTPResponse,
		unknown,
		BlogCreateSchema
	>({
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
						setDialogOpen(false);
						return response.data;
					}

					throw new Error('Blog creation Fail!');
				})
				.catch((e) => {
					setDialogOpen(false);
					toast.error(e.response?.data?.data ?? 'Request Failed', {
						description:
							e.response?.data?.message ??
							'Something wrong plz try again',
					});
					throw e;
				}),
	});

	const handleBlogMutation = async (
		values: z.infer<typeof blogCreateSchema>
	) => {
		const blogCreatedRes = await createNewBlogFn(values);
		toast.success(blogCreatedRes.message);
	};

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger asChild>
				<Button>
					<PenSquare className="mr-2 h-4 w-4" />
					Create Blog
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create Blog Post</DialogTitle>
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
											placeholder="Blog description..."
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<Button type="submit">Publish</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
