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
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import UploadcareFileUploader from '@/utils/uploadcare-file-uploader';
import { create, update } from '../api';
import { useAuth } from '@/context/auth.context';
import { Button } from '@/components/ui/button';
import { File, X } from 'lucide-react';
import { useOpenBookMutationDialogStore } from '../store/open-book-mutation-dialog-store';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

const bookCreateSchema = z.object({
	bookName: z.string().min(5, {
		message: 'Book name must be at least 3 characters.',
	}),
	bookDescription: z.string().min(10, {
		message: 'Book Description must be at least 10 characters.',
	}),
	organizationName: z.string().min(3, {
		message: 'Organization name must be at least 3 characters.',
	}),
	organizationUrl: z.string().min(3, {
		message: 'Organization url must be at least 3 characters.',
	}),
	categoryId: z.string(),
	difficultyLevel: z.string().min(1, {
		message: 'Book difficulty level must be at least 1 characters.',
	}),
	rating: z.number().positive(),
	bookUrl: z.string({ required_error: 'Book url is required' }).optional(),
	uploaderId: z.number().optional(),
});

export type BookCreateSchema = z.infer<typeof bookCreateSchema>;

export default function BookMutationDialog() {
	const [uploadCompleteObj, setUploadCompleteObj] = useState<{
		fileUrl: string;
	} | null>(null);
	const { user } = useAuth();
	const {
		book: initialBook,
		isOpen,
		setIsOpen,
	} = useOpenBookMutationDialogStore();
	const queryClient = useQueryClient();

	const form = useForm<z.infer<typeof bookCreateSchema>>({
		resolver: zodResolver(bookCreateSchema),
	});

	const resetForm = () => {
		form.reset();
		setUploadCompleteObj(null);
	};

	const { mutateAsync: createNewBookFn, isPending: createPending } =
		useMutation<HTTPResponse, unknown, BookCreateSchema>({
			mutationFn: async (
				createBookBody: BookCreateSchema
			): Promise<HTTPResponse> =>
				await create(createBookBody)
					.then((response) => {
						if (response.status === 201) {
							queryClient.invalidateQueries({
								queryKey: ['get-all-books'],
							});

							setIsOpen({ isOpen: false, book: null });
							resetForm();
							return response.data;
						}

						throw new Error('Book creation Fail!');
					})
					.catch((e) => {
						setIsOpen({
							isOpen: false,
							book: null,
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

	const { mutateAsync: updateBookFn, isPending: updatePending } = useMutation(
		{
			mutationFn: async ({
				id,
				updateBookBody,
			}: {
				id: number;
				updateBookBody: BookCreateSchema;
			}): Promise<HTTPResponse> =>
				await update(id, updateBookBody)
					.then((response) => {
						if (response.status === 204) {
							queryClient.invalidateQueries({
								queryKey: ['get-all-books'],
							});

							resetForm();
							setIsOpen({ isOpen: false, book: null });
							return response.data;
						}

						throw new Error('Book update Fail!');
					})
					.catch((e) => {
						setIsOpen({
							isOpen: false,
							book: null,
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
		}
	);

	const handleBookMutation = async (
		values: z.infer<typeof bookCreateSchema>
	) => {
		if (!!initialBook) {
			// TODO Check why fileType is null for update
			await updateBookFn({
				id: initialBook.id,
				updateBookBody: {
					...values,
					bookUrl: uploadCompleteObj?.fileUrl,
					uploaderId: user?.id,
				},
			});
			toast.success('Successfully update the book');
		} else {
			console.log({
				...values,
				bookUrl: uploadCompleteObj?.fileUrl,
				uploaderId: user?.id,
			});

			const bookCreatedRes = await createNewBookFn({
				...values,
				bookUrl: uploadCompleteObj?.fileUrl,
				uploaderId: user?.id,
			});
			toast.success(bookCreatedRes.message);
		}
	};

	useEffect(() => {
		if (initialBook) {
			form.setValue('bookName', initialBook.bookName);
			form.setValue('bookDescription', initialBook.bookDescription);
			form.setValue('organizationName', initialBook.organizationName);
			form.setValue('organizationUrl', initialBook.organizationUrl);

			const newUploadObj = {
				fileUrl: initialBook.bookUrl,
			};

			setUploadCompleteObj(newUploadObj);
		}

		return () => {
			resetForm();
		};
	}, [initialBook]);

	const isPending = createPending || updatePending;

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(isOpen) => {
				setIsOpen({ isOpen, book: null });
				if (!isOpen) {
					resetForm();
				}
			}}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{!!initialBook ? 'Edit Book' : 'Upload New Book'}{' '}
					</DialogTitle>
					<DialogDescription>
						Upload a book to share with your tutor or students.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleBookMutation)}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="bookName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											disabled={isPending}
											placeholder="Book Name"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="bookDescription"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											disabled={isPending}
											placeholder="Book description..."
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="categoryId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Category</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field?.value?.toString()}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select a category" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="0">
												COMPUTER SCIENCE
											</SelectItem>
											<SelectItem value="1">
												PROGRAMMING
											</SelectItem>
											<SelectItem value="2">
												PROJECT MANAGEMENT
											</SelectItem>
											<SelectItem value="3">
												DATABASE
											</SelectItem>
											<SelectItem value="4">
												OPERATION SYSTEM
											</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="difficultyLevel"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Difficulty Level</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field?.value?.toString()}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select a Difficulty Level" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="Beginner">
												Beginner
											</SelectItem>
											<SelectItem value="Intermediate">
												Intermediate
											</SelectItem>
											<SelectItem value="Advanced">
												Advanced
											</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="rating"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Rating</FormLabel>
									<Input
										disabled={isPending}
										placeholder="Rating"
										type="number"
										min={1}
										max={5}
										{...field}
									/>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="organizationName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Organization Name</FormLabel>
									<FormControl>
										<Input
											disabled={isPending}
											placeholder="Organization Name..."
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="organizationUrl"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Organization Url</FormLabel>
									<FormControl>
										<Input
											disabled={isPending}
											placeholder="Organization Url..."
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="space-y-3">
							<span>Upload Book</span>
							{!!uploadCompleteObj ? (
								<div className="relative flex items-center gap-x-2">
									<File className="size-10" />
									<div className="">
										<span className="text-wrap text-sm">
											{form.getValues('bookName')}
										</span>
									</div>
									<X
										onClick={() => {
											setUploadCompleteObj(null);
										}}
										className="absolute -right-1.5 -top-1.5 cursor-pointer text-red-500 transition-all hover:text-red-600"
									/>
								</div>
							) : (
								<div>
									<UploadcareFileUploader
										uploadComplete={async ({
											fileUrl,
										}: {
											fileType: string;
											fileUrl: string;
											storedUUID: number;
											storedName: string;
										}) => {
											setUploadCompleteObj({
												fileUrl,
											});
										}}
									/>
								</div>
							)}
						</div>
						<DialogFooter>
							<Button
								disabled={isPending || !uploadCompleteObj}
								type="submit"
							>
								{!!initialBook ? 'Save' : 'Upload'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
