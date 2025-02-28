//! TODO Must remove ts ignore
// @ts-nocheck
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
	FileText,
	Upload,
	Download,
	MessageSquare,
	FileUp,
} from 'lucide-react';
import { documents as initialDocuments } from '@/data';
import { useAuth } from '@/context/auth.context';

export function DocumentsView() {
	const { user } = useAuth();
	const [documents, setDocuments] = useState(initialDocuments);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [commentDialogOpen, setCommentDialogOpen] = useState(false);
	const [activeDocument, setActiveDocument] = useState<string | null>(null);

	const myDocuments = documents.filter((doc) => doc.owner.id === user?.id);
	const sharedDocuments = documents.filter(
		(doc) => doc.owner.id !== user?.id
	);

	const handleUploadDocument = (e: React.FormEvent) => {
		e.preventDefault();

		// In a real app, you would upload the document to the server
		setDialogOpen(false);
	};

	const handleAddComment = (e: React.FormEvent) => {
		e.preventDefault();

		// In a real app, you would add the comment to the document
		setCommentDialogOpen(false);
	};

	const openCommentDialog = (docId: string) => {
		setActiveDocument(docId);
		setCommentDialogOpen(true);
	};

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
				<h1 className="text-2xl font-bold tracking-tight">Documents</h1>
				<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
					<DialogTrigger asChild>
						<Button>
							<Upload className="mr-2 h-4 w-4" />
							Upload Document
						</Button>
					</DialogTrigger>
					<DialogContent>
						<form onSubmit={handleUploadDocument}>
							<DialogHeader>
								<DialogTitle>Upload Document</DialogTitle>
								<DialogDescription>
									Upload a document to share with your tutor
									or students.
								</DialogDescription>
							</DialogHeader>
							<div className="grid gap-4 py-4">
								<div className="grid gap-2">
									<Label htmlFor="title">
										Document Title
									</Label>
									<Input
										id="title"
										placeholder="Assignment Draft"
										required
									/>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="description">
										Description
									</Label>
									<Textarea
										id="description"
										placeholder="Brief description of the document"
										className="resize-none"
									/>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="file">File</Label>
									<div className="flex items-center gap-2">
										<Input
											id="file"
											type="file"
											className="flex-1"
											required
										/>
									</div>
								</div>
							</div>
							<DialogFooter>
								<Button type="submit">Upload</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>
			</div>

			<Tabs defaultValue="all">
				<TabsList className="mb-4">
					<TabsTrigger value="all">All Documents</TabsTrigger>
					<TabsTrigger value="my">My Documents</TabsTrigger>
					<TabsTrigger value="shared">Shared With Me</TabsTrigger>
				</TabsList>
				<TabsContent value="all" className="space-y-4">
					{documents.map((doc) => (
						<Card key={doc.id}>
							<CardContent className="p-6">
								<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
									<div className="flex items-start gap-4">
										<div className="rounded-lg bg-muted p-2">
											<FileText className="h-8 w-8 text-primary" />
										</div>
										<div>
											<h3 className="font-semibold">
												{doc.title}
											</h3>
											<p className="text-sm text-muted-foreground">
												Uploaded by {doc.owner.name} on{' '}
												{new Date(
													doc.uploadDate
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
										<Button
											variant="outline"
											size="sm"
											onClick={() =>
												openCommentDialog(doc.id)
											}
										>
											<MessageSquare className="mr-2 h-4 w-4" />
											Comment
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</TabsContent>
				<TabsContent value="my" className="space-y-4">
					{myDocuments.length > 0 ? (
						myDocuments.map((doc) => (
							<Card key={doc.id}>
								<CardContent className="p-6">
									<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
										<div className="flex items-start gap-4">
											<div className="rounded-lg bg-muted p-2">
												<FileText className="h-8 w-8 text-primary" />
											</div>
											<div>
												<h3 className="font-semibold">
													{doc.title}
												</h3>
												<p className="text-sm text-muted-foreground">
													Uploaded on{' '}
													{new Date(
														doc.uploadDate
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
											<Button
												variant="outline"
												size="sm"
												onClick={() =>
													openCommentDialog(doc.id)
												}
											>
												<MessageSquare className="mr-2 h-4 w-4" />
												Comment
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
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
									onClick={() => setDialogOpen(true)}
								>
									Upload Document
								</Button>
							</CardContent>
						</Card>
					)}
				</TabsContent>
				<TabsContent value="shared" className="space-y-4">
					{sharedDocuments.length > 0 ? (
						sharedDocuments.map((doc) => (
							<Card key={doc.id}>
								<CardContent className="p-6">
									<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
										<div className="flex items-start gap-4">
											<div className="rounded-lg bg-muted p-2">
												<FileText className="h-8 w-8 text-primary" />
											</div>
											<div>
												<h3 className="font-semibold">
													{doc.title}
												</h3>
												<p className="text-sm text-muted-foreground">
													Shared by {doc.owner.name}{' '}
													on{' '}
													{new Date(
														doc.uploadDate
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
											<Button
												variant="outline"
												size="sm"
												onClick={() =>
													openCommentDialog(doc.id)
												}
											>
												<MessageSquare className="mr-2 h-4 w-4" />
												Comment
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
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
									Documents shared with you will appear here
								</p>
							</CardContent>
						</Card>
					)}
				</TabsContent>
			</Tabs>

			<Dialog
				open={commentDialogOpen}
				onOpenChange={setCommentDialogOpen}
			>
				<DialogContent>
					<form onSubmit={handleAddComment}>
						<DialogHeader>
							<DialogTitle>Add Comment</DialogTitle>
							<DialogDescription>
								Add a comment to this document.
							</DialogDescription>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<div className="grid gap-2">
								<Label htmlFor="comment">Comment</Label>
								<Textarea
									id="comment"
									placeholder="Your feedback or comment"
									className="resize-none"
									rows={5}
									required
								/>
							</div>
						</div>
						<DialogFooter>
							<Button type="submit">Submit Comment</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
