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
import { useOpenDocumentMutationDialogStore } from '../store/open-document-mutation-dialog-store';
import UploadcareFileUploader from '@/utils/uploadcare-file-uploader';
import { create, update } from '../api';
import { useAuth } from '@/context/auth.context';
import { Button } from '@/components/ui/button';
import { File, X } from 'lucide-react';

const documentCreateSchema = z.object({
	title: z.string().min(5, {
		message: 'Title must be at least 5 characters.',
	}),
	description: z.string().min(10, {
		message: 'Description must be at least 10 characters.',
	}),
	fileType: z
		.string()
		.min(10, {
			message: 'File Type must be at least 10 characters.',
		})
		.optional(),
	fileUrl: z
		.string()
		.min(10, {
			message: 'File Url must be at least 10 characters.',
		})
		.optional(),
	userName: z
		.string()
		.min(10, {
			message: 'User Name must be at least 10 characters.',
		})
		.optional(),
	storedUUID: z.number().optional(),
	storedName: z
		.string()
		.min(10, {
			message: 'Stored Name must be at least 10 characters.',
		})
		.optional(),
	userId: z.number().optional(),
	entityType: z.number().default(6).optional(),
});

export type DocumentCreateSchema = z.infer<typeof documentCreateSchema>;

export default function DocumentMutationDialog() {
	const [uploadCompleteObj, setUploadCompleteObj] = useState<{
		fileType: string;
		fileUrl: string;
		storedUUID: number;
		storedName: string;
	} | null>(null);
	const { user } = useAuth();
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

	const resetForm = () => {
		form.resetField('title');
		form.resetField('description');
		setUploadCompleteObj(null);
	};

	const { mutateAsync: createNewDocumentFn, isPending: createPending } =
		useMutation<HTTPResponse, unknown, DocumentCreateSchema>({
			mutationFn: async (
				createDocumentBody: DocumentCreateSchema
			): Promise<HTTPResponse> =>
				await create(createDocumentBody)
					.then((response) => {
						if (response.status === 201) {
							queryClient.invalidateQueries({
								queryKey: ['get-all-documents', true],
							});
							queryClient.invalidateQueries({
								queryKey: ['get-all-documents', false],
							});

							setIsOpen({ isOpen: false, document: null });
							resetForm();
							return response.data;
						}

						throw new Error('Document creation Fail!');
					})
					.catch((e) => {
						setIsOpen({
							isOpen: false,
							document: null,
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

	const { mutateAsync: updateDocumentFn, isPending: updatePending } =
		useMutation({
			mutationFn: async ({
				id,
				updateDocumentBody,
			}: {
				id: number;
				updateDocumentBody: DocumentCreateSchema;
			}): Promise<HTTPResponse> =>
				await update(id, updateDocumentBody)
					.then((response) => {
						if (response.status === 204) {
							queryClient.invalidateQueries({
								queryKey: ['get-all-documents', true],
							});
							queryClient.invalidateQueries({
								queryKey: ['get-all-documents', false],
							});

							resetForm();
							setIsOpen({ isOpen: false, document: null });
							return response.data;
						}

						throw new Error('Document update Fail!');
					})
					.catch((e) => {
						setIsOpen({
							isOpen: false,
							document: null,
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

	const handleDocumentMutation = async (
		values: z.infer<typeof documentCreateSchema>
	) => {
		if (!!initialDocument) {
			// TODO Check why fileType is null for update
			await updateDocumentFn({
				id: initialDocument.id,
				updateDocumentBody: {
					...values,
					fileType: uploadCompleteObj?.fileType,
					fileUrl: uploadCompleteObj?.fileUrl,
					storedName: uploadCompleteObj?.storedName,
					storedUUID: uploadCompleteObj?.storedUUID,
					userName: user?.name,
					userId: user?.id,
					entityType: 6, // For Document
				},
			});
			toast.success('Successfully update the document');
		} else {
			const documentCreatedRes = await createNewDocumentFn({
				...values,
				fileType: uploadCompleteObj?.fileType,
				fileUrl: uploadCompleteObj?.fileUrl,
				storedName: uploadCompleteObj?.storedName,
				storedUUID: uploadCompleteObj?.storedUUID,
				userName: user?.name,
				userId: user?.id,
				entityType: 6, // For Document
			});
			toast.success(documentCreatedRes.message);
		}
	};

	useEffect(() => {
		if (initialDocument) {
			form.setValue('title', initialDocument.title);
			form.setValue('description', initialDocument.description);

			const newUploadObj = {
				fileType: initialDocument.fileType,
				fileUrl: initialDocument.fileUrl,
				storedName: initialDocument.storedName,
				storedUUID: initialDocument.storedUUID,
			};

			setUploadCompleteObj(newUploadObj);
		}

		return () => {
			resetForm();
		};
	}, [initialDocument]);

	const isPending = createPending || updatePending;
	const watchedValues = form.watch(['title', 'description']);
	const formInputHaveValue =
		watchedValues[0].length > 3 && watchedValues[1].length > 10;

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(isOpen) => {
				setIsOpen({ isOpen, document: null });
				if (!isOpen) {
					resetForm();
				}
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
						onSubmit={form.handleSubmit(handleDocumentMutation)}
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
							{!!uploadCompleteObj ? (
								<div className="relative flex items-center gap-x-2">
									<File className="size-10" />
									<div className="">
										<span className="text-wrap text-sm">
											{uploadCompleteObj.storedName}
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
								<div
									style={{
										pointerEvents: !formInputHaveValue
											? 'none'
											: 'all',
									}}
								>
									<UploadcareFileUploader
										uploadComplete={async ({
											fileType,
											fileUrl,
											storedName,
											storedUUID,
										}: {
											fileType: string;
											fileUrl: string;
											storedUUID: number;
											storedName: string;
										}) => {
											setUploadCompleteObj({
												fileType,
												fileUrl,
												storedName,
												storedUUID,
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
								{!!initialDocument ? 'Save' : 'Upload'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
