import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, FileUp } from 'lucide-react';
import { useAuth } from '@/context/auth.context';
import { useOpenDocumentMutationDialogStore } from '../store/open-document-mutation-dialog-store';
import DocumentMutationDialog from './document-mutation-dialog';
import DocumentItem, { DocumentItemSkeleton } from './document-item';
import { useQuery } from '@tanstack/react-query';
import { Document } from '../types';
import { getAll } from '../api';

export function DocumentsView() {
	const { setIsOpen } = useOpenDocumentMutationDialogStore();
	const { user } = useAuth();

	const { data: getAllDocuments, isLoading: isLoadingGetAllDocuments } =
		useQuery<HTTPResponse<Document[]>>({
			queryKey: ['get-all-documents'],
			queryFn: async (): Promise<HTTPResponse<Document[]>> =>
				await getAll().then((response) => {
					if (response.data.code === 200) {
						return response.data;
					}

					throw new Error('Fetch all documents fail!');
				}),
		});

	const myDocuments = getAllDocuments?.data.filter(
		(doc) => doc.userId === user?.id
	);
	const sharedDocuments = getAllDocuments?.data.filter(
		(doc) => doc.userId !== user?.id
	);

	return (
		<>
			<DocumentMutationDialog />
			<div className="flex flex-col gap-6">
				<div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
					<h1 className="text-2xl font-bold tracking-tight">
						Documents
					</h1>

					<Button
						onClick={() => {
							setIsOpen({ isOpen: true, document: null });
						}}
					>
						Upload Document
					</Button>
				</div>

				<Tabs defaultValue="all">
					<TabsList className="mb-4">
						<TabsTrigger value="all">All Documents</TabsTrigger>
						<TabsTrigger value="my">My Documents</TabsTrigger>
						<TabsTrigger value="shared">Shared With Me</TabsTrigger>
					</TabsList>
					<TabsContent value="all" className="space-y-4">
						{isLoadingGetAllDocuments ? (
							[1, 2, 3].map((i) => (
								<DocumentItemSkeleton key={i} />
							))
						) : getAllDocuments?.data &&
						  getAllDocuments.data.length > 0 ? (
							getAllDocuments?.data?.map((doc) => (
								<DocumentItem key={doc.id} doc={doc} />
							))
						) : (
							<Card>
								<CardContent className="flex flex-col items-center justify-center p-6">
									<div className="rounded-full bg-muted p-3">
										<FileUp className="h-6 w-6 text-muted-foreground" />
									</div>
									<h3 className="mt-3 font-medium">
										No uploaded documents found
									</h3>
								</CardContent>
							</Card>
						)}
					</TabsContent>
					<TabsContent value="my" className="space-y-4">
						{isLoadingGetAllDocuments ? (
							[1, 2, 3].map((i) => (
								<DocumentItemSkeleton key={i} />
							))
						) : myDocuments && myDocuments?.length > 0 ? (
							myDocuments?.map((doc) => (
								<DocumentItem key={doc.id} doc={doc} />
							))
						) : (
							<Card>
								<CardContent className="flex flex-col items-center justify-center p-6">
									<div className="rounded-full bg-muted p-3">
										<FileUp className="h-6 w-6 text-muted-foreground" />
									</div>
									<h3 className="mt-3 font-medium">
										No documents uploaded
									</h3>
									<p className="text-sm text-muted-foreground">
										Upload a document to get started
									</p>
									<Button
										className="mt-4"
										onClick={() => {
											setIsOpen({
												isOpen: true,
												document: null,
											});
										}}
									>
										Upload Document
									</Button>
								</CardContent>
							</Card>
						)}
					</TabsContent>
					<TabsContent value="shared" className="space-y-4">
						{isLoadingGetAllDocuments ? (
							[1, 2, 3].map((i) => (
								<DocumentItemSkeleton key={i} />
							))
						) : sharedDocuments && sharedDocuments?.length > 0 ? (
							sharedDocuments.map((doc) => (
								<DocumentItem key={doc.id} doc={doc} />
							))
						) : (
							<Card>
								<CardContent className="flex flex-col items-center justify-center p-6">
									<div className="rounded-full bg-muted p-3">
										<FileText className="h-6 w-6 text-muted-foreground" />
									</div>
									<h3 className="mt-3 font-medium">
										No shared documents
									</h3>
									<p className="text-sm text-muted-foreground">
										Documents shared with you will appear
										here
									</p>
								</CardContent>
							</Card>
						)}
					</TabsContent>
				</Tabs>
			</div>
		</>
	);
}
