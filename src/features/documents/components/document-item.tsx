import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import useConfirmDialog from '@/hooks/use-confirm-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { Document } from '../types';
import { Download, FileText } from 'lucide-react';
import { downloadFile } from '@/utils/client-side-file-download';
import { useOpenDocumentMutationDialogStore } from '../store/open-document-mutation-dialog-store';
import { deleteItem } from '../api';
import { toast } from 'sonner';
import { useAuth } from '@/context/auth.context';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';

interface DocumentItemProps {
	doc: Document;
}

export default function DocumentItem({ doc }: DocumentItemProps) {
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const { setIsOpen } = useOpenDocumentMutationDialogStore();
	const [DeleteConfirmDialog, deleteConfirm] = useConfirmDialog(
		'Are you sure?',
		'This process cannot be undo and will delete the document permanently.'
	);
	const isDocumentAuthor = user?.id === doc.userId;

	const { mutateAsync: deleteDocumentFn, isPending: deleteDocumentPending } =
		useMutation({
			mutationFn: async ({ id }: { id: number }): Promise<HTTPResponse> =>
				await deleteItem(id)
					.then((response) => {
						if (response.status === 204) {
							queryClient.invalidateQueries({
								queryKey: ['get-all-documents'],
							});

							return response.data;
						}

						throw new Error('Document delete Fail!');
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

	const handleDocumentDelete = async () => {
		if (doc) {
			const isOk = await deleteConfirm();

			if (isOk) {
				await deleteDocumentFn({ id: doc.id });
				toast.success('Successfully deleted the document');
			}
		}
	};

	return (
		<>
			<DeleteConfirmDialog />
			<Card key={doc.id}>
				<CardContent className="p-6">
					<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
						<div className="flex items-start gap-4">
							<div className="rounded-lg bg-muted p-2">
								<FileText className="h-8 w-8 text-primary" />
							</div>
							<div>
								<h3 className="font-semibold">{doc.title}</h3>
								<p className="text-sm text-muted-foreground">
									Uploaded on{' '}
									{new Date(
										doc.createdAt
									).toLocaleDateString()}
								</p>
								<p className="mt-1 text-sm">
									{doc.description}
								</p>
							</div>
						</div>
						<div className="flex flex-wrap gap-2">
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										disabled={deleteDocumentPending}
										variant="outline"
										size="sm"
										onClick={() => {
											downloadFile(
												doc.fileUrl,
												doc.storedName
											);
										}}
									>
										<Download className="mr-2 h-4 w-4" />
										Download
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Download the Document</p>
								</TooltipContent>
							</Tooltip>
							{isDocumentAuthor && (
								<>
									<Button
										disabled={deleteDocumentPending}
										onClick={() => {
											setIsOpen({
												isOpen: true,
												document: doc,
											});
										}}
										variant="outline"
										size="sm"
									>
										Edit
									</Button>
									<Button
										disabled={deleteDocumentPending}
										onClick={handleDocumentDelete}
										variant="destructive"
										size="sm"
									>
										Delete
									</Button>
								</>
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		</>
	);
}

export const DocumentItemSkeleton = () => {
	return (
		<Card className="space-y-2">
			<Skeleton className="h-[70px] w-full" />
		</Card>
	);
};
