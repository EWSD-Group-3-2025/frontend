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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useOpenDocumentMutationDialogStore } from '../store/open-document-mutation-dialog-store';
import UploadcareFileUploader from '@/utils/uploadcare-file-uploader';

const documentCreateSchema = z.object({
	title: z.string().min(5, {
		message: 'Title must be at least 5 characters.',
	}),
	description: z.string().min(10, {
		message: 'Description must be at least 10 characters.',
	}),
});

export type DocumentCreateSchema = z.infer<typeof documentCreateSchema>;

export default function DocumentMutationDialog() {
	const {
		document: initialDocument,
		isOpen,
		setIsOpen,
	} = useOpenDocumentMutationDialogStore();
	const queryClient = useQueryClient();

	const form = useForm<z.infer<typeof documentCreateSchema>>({
		resolver: zodResolver(documentCreateSchema),
		defaultValues: {
			title: '',
			description: '',
		},
	});

	// const { mutateAsync: createNewBlogFn, isPending: createNewBlogPending } =
	// 	useMutation<HTTPResponse, unknown, DocumentCreateSchema>({
	// 		mutationFn: async (
	// 			createDocumentBody: DocumentCreateSchema
	// 		): Promise<HTTPResponse> =>
	// 			// await createNewBlog(createBlogBody)
	// 			// 	.then((response) => {
	// 			// 		if (response.status === 201) {
	// 			// 			queryClient.invalidateQueries({
	// 			// 				queryKey: ['get-all-blogs-for-current-user'],
	// 			// 			});
	// 			// 			queryClient.invalidateQueries({
	// 			// 				queryKey: ['get-all-blogs-by-current-user'],
	// 			// 			});
	// 			// 			setIsOpen({ isOpen: false, document: null });
	// 			// 			return response.data;
	// 			// 		}

	// 			// 		throw new Error('Blog creation Fail!');
	// 			// 	})
	// 			// 	.catch((e) => {
	// 			// 		setIsOpen({
	// 			// 			isOpen: false,
	// 			// 			document: null,
	// 			// 		});

	// 			// 		toast.error(
	// 			// 			e.response?.data?.data ?? 'Request Failed',
	// 			// 			{
	// 			// 				description:
	// 			// 					e.response?.data?.message ??
	// 			// 					'Something wrong plz try again',
	// 			// 			}
	// 			// 		);
	// 			// 		throw e;
	// 			// 	}),
	// 	});

	// const { mutateAsync: updateBlogFn, isPending: updateBlogPending } =
	// 	useMutation({
	// 		mutationFn: async ({
	// 			blogId,
	// 			createBlogBody,
	// 		}: {
	// 			blogId: number;
	// 			updateDocumentBody: DocumentCreateSchema;
	// 		}): Promise<HTTPResponse> =>
	// 			// await updateBlog(blogId, createBlogBody)
	// 			// 	.then((response) => {
	// 			// 		if (response.status === 200) {
	// 			// 			queryClient.invalidateQueries({
	// 			// 				queryKey: ['get-all-blogs-for-current-user'],
	// 			// 			});
	// 			// 			queryClient.invalidateQueries({
	// 			// 				queryKey: ['get-all-blogs-by-current-user'],
	// 			// 			});
	// 			// 			setIsOpen({ isOpen: false, document: null });
	// 			// 			return response.data;
	// 			// 		}

	// 			// 		throw new Error('Blog update Fail!');
	// 			// 	})
	// 			// 	.catch((e) => {
	// 			// 		setIsOpen({
	// 			// 			isOpen: false,
	// 			// 			document: null,
	// 			// 		});

	// 			// 		toast.error(
	// 			// 			e.response?.data?.data ?? 'Request Failed',
	// 			// 			{
	// 			// 				description:
	// 			// 					e.response?.data?.message ??
	// 			// 					'Something wrong plz try again',
	// 			// 			}
	// 			// 		);
	// 			// 		throw e;
	// 			// 	}),
	// 	});

	// const handleBlogMutation = async (
	// 	values: z.infer<typeof documentCreateSchema>
	// ) => {
	// 	if (!!initialDocument) {
	// 		const blogUpdateRes = await updateBlogFn({
	// 			blogId: initialDocument.id,
	// 			createBlogBody: values,
	// 		});
	// 		toast.success(blogUpdateRes.message);
	// 	} else {
	// 		const blogCreatedRes = await createNewBlogFn(values);
	// 		toast.success(blogCreatedRes.message);
	// 	}
	// };

	useEffect(() => {
		if (initialDocument) {
			form.setValue('title', initialDocument.title);
			form.setValue('description', initialDocument.description);
		}
	}, [initialDocument]);

	const isPending = false;

	const watchedValues = form.watch(['title', 'description']);
	const formInputHaveValue =
		watchedValues[0].length > 3 && watchedValues[1].length > 10;

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(isOpen) => {
				setIsOpen({ isOpen, document: null });
			}}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{!!initialDocument
							? 'Edit Document'
							: 'Upload New Document'}{' '}
					</DialogTitle>
					<DialogDescription>
						Upload a document to share with your tutor or students.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(() => {})}
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
											placeholder="New Document Title"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											disabled={isPending}
											placeholder="Document description..."
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="space-y-3">
							<span>Upload Document</span>
							<div
								style={{
									pointerEvents: !formInputHaveValue
										? 'none'
										: 'all',
								}}
							>
								<UploadcareFileUploader
									handleSubmit={async () => {}}
								/>
							</div>
						</div>
						<DialogFooter>
							<Button disabled={isPending} type="submit">
								{!!initialDocument ? 'Save' : 'Upload'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

// <form onSubmit={handleUploadDocument}>
// 	<DialogHeader>
// 		<DialogTitle>Upload Document</DialogTitle>
// 		<DialogDescription>
// 			Upload a document to share with your tutor or students.
// 		</DialogDescription>
// 	</DialogHeader>
// 	<div className="grid gap-4 py-4">
// 		<div className="grid gap-2">
// 			<Label htmlFor="title">Document Title</Label>
// 			<Input id="title" placeholder="Assignment Draft" required />
// 		</div>
// 		<div className="grid gap-2">
// 			<Label htmlFor="description">Description</Label>
// 			<Textarea
// 				id="description"
// 				placeholder="Brief description of the document"
// 				className="resize-none"
// 			/>
// 		</div>
// 		<div className="grid gap-2">
// 			<Label htmlFor="file">File</Label>
// 			<UploadcareFileUploader />
// 		</div>
// 	</div>
// 	<DialogFooter>
// 		<Button type="submit">Upload</Button>
// 	</DialogFooter>
// </form>;
