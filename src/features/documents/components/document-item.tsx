import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import useConfirmDialog from '@/hooks/use-confirm-dialog';
import { useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/auth.context';
import { Document } from '../types';
import { Download, FileText } from 'lucide-react';

interface DocumentItemProps {
	doc: Document;
}

export default function DocumentItem({ doc }: DocumentItemProps) {
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const [DeleteConfirmDialog, deleteConfirm] = useConfirmDialog(
		'Are you sure?',
		'This process cannot be undo and will delete the document permanently.'
	);

	// const { mutateAsync: deleteBlogFn, isPending: deleteBlogPending } =
	// 	useMutation({
	// 		mutationFn: async ({
	// 			blogId,
	// 		}: {
	// 			blogId: number;
	// 		}): Promise<HTTPResponse> =>
	// 			await deleteBlog(blogId)
	// 				.then((response) => {
	// 					if (response.status === 204) {
	// 						queryClient.invalidateQueries({
	// 							queryKey: ['get-all-blogs-for-current-user'],
	// 						});
	// 						queryClient.invalidateQueries({
	// 							queryKey: ['get-all-blogs-by-current-user'],
	// 						});

	// 						return response.data;
	// 					}

	// 					throw new Error('Blog delete Fail!');
	// 				})
	// 				.catch((e) => {
	// 					setIsOpen({
	// 						isOpen: false,
	// 						blog: null,
	// 					});

	// 					toast.error(
	// 						e.response?.data?.data ?? 'Request Failed',
	// 						{
	// 							description:
	// 								e.response?.data?.message ??
	// 								'Something wrong plz try again',
	// 						}
	// 					);
	// 					throw e;
	// 				}),
	// 	});

	// const handleBlogDelete = async () => {
	// 	if (blog) {
	// 		const isOk = await deleteConfirm();

	// 		if (isOk) {
	// 			await deleteBlogFn({ blogId: blog.id });
	// 			toast.success('Successfully deleted the blog');
	// 		}
	// 	}
	// };

	return (
		<>
			<DeleteConfirmDialog />
			<Card key={doc.id}>
				<CardContent className="p-6">
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
							<Button variant="outline" size="sm">
								<Download className="mr-2 h-4 w-4" />
								Download
							</Button>
						</div>
					</div>
				</CardContent>
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
