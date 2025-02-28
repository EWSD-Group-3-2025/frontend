//! TODO Must remove ts ignore
// @ts-nocheck
import { useState } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { BookOpen, MessageSquare, PenSquare, ThumbsUp } from 'lucide-react';
import { blogPosts as initialBlogPosts } from '@/data';
import { useAuth } from '@/context/auth.context';

export function BlogView() {
	const { user } = useAuth();
	const [blogPosts, setBlogPosts] = useState(initialBlogPosts);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [commentDialogOpen, setCommentDialogOpen] = useState(false);
	const [activePost, setActivePost] = useState<string | null>(null);

	const myPosts = blogPosts.filter((post) => post.author.id === user?.id);
	const otherPosts = blogPosts.filter((post) => post.author.id !== user?.id);

	const handleCreatePost = (e: React.FormEvent) => {
		e.preventDefault();

		// In a real app, you would save the blog post to the database
		setDialogOpen(false);
	};

	const handleAddComment = (e: React.FormEvent) => {
		e.preventDefault();

		// In a real app, you would add the comment to the blog post
		setCommentDialogOpen(false);
	};

	const openCommentDialog = (postId: string) => {
		setActivePost(postId);
		setCommentDialogOpen(true);
	};

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
				<h1 className="text-2xl font-bold tracking-tight">Blog</h1>
				<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
					<DialogTrigger asChild>
						<Button>
							<PenSquare className="mr-2 h-4 w-4" />
							Create Post
						</Button>
					</DialogTrigger>
					<DialogContent>
						<form onSubmit={handleCreatePost}>
							<DialogHeader>
								<DialogTitle>Create Blog Post</DialogTitle>
								<DialogDescription>
									Share your thoughts, experiences, or
									questions.
								</DialogDescription>
							</DialogHeader>
							<div className="grid gap-4 py-4">
								<div className="grid gap-2">
									<Label htmlFor="title">Title</Label>
									<Input
										id="title"
										placeholder="My Experience with..."
										required
									/>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="content">Content</Label>
									<Textarea
										id="content"
										placeholder="Write your blog post here..."
										className="min-h-[200px] resize-none"
										required
									/>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="tags">
										Tags (comma separated)
									</Label>
									<Input
										id="tags"
										placeholder="reflection, experience, question"
									/>
								</div>
							</div>
							<DialogFooter>
								<Button type="submit">Publish</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>
			</div>

			<Tabs defaultValue="all">
				<TabsList className="mb-4">
					<TabsTrigger value="all">All Posts</TabsTrigger>
					<TabsTrigger value="my">My Posts</TabsTrigger>
				</TabsList>
				<TabsContent value="all" className="space-y-6">
					{blogPosts.map((post) => (
						<Card key={post.id}>
							<CardHeader>
								<div className="flex items-center gap-4">
									<Avatar>
										<AvatarImage
											src={post.author.avatar}
											alt={post.author.name}
										/>
										<AvatarFallback>
											{post.author.name.charAt(0)}
										</AvatarFallback>
									</Avatar>
									<div>
										<CardTitle>{post.title}</CardTitle>
										<CardDescription>
											By {post.author.name} •{' '}
											{new Date(
												post.date
											).toLocaleDateString()}
										</CardDescription>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<p className="whitespace-pre-line">
									{post.content}
								</p>
								<div className="mt-4 flex flex-wrap gap-2">
									{post.tags.map((tag) => (
										<span
											key={tag}
											className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
										>
											{tag}
										</span>
									))}
								</div>
							</CardContent>
							<CardFooter className="flex justify-between border-t p-4">
								<div className="flex items-center gap-4">
									<Button
										variant="ghost"
										size="sm"
										className="gap-1"
									>
										<ThumbsUp className="h-4 w-4" />
										<span>{post.likes}</span>
									</Button>
									<Button
										variant="ghost"
										size="sm"
										className="gap-1"
										onClick={() =>
											openCommentDialog(post.id)
										}
									>
										<MessageSquare className="h-4 w-4" />
										<span>{post.comments.length}</span>
									</Button>
								</div>
								<Button
									variant="outline"
									size="sm"
									onClick={() => openCommentDialog(post.id)}
								>
									Add Comment
								</Button>
							</CardFooter>
						</Card>
					))}
				</TabsContent>
				<TabsContent value="my" className="space-y-6">
					{myPosts.length > 0 ? (
						myPosts.map((post) => (
							<Card key={post.id}>
								<CardHeader>
									<div className="flex items-center gap-4">
										<Avatar>
											<AvatarImage
												src={post.author.avatar}
												alt={post.author.name}
											/>
											<AvatarFallback>
												{post.author.name.charAt(0)}
											</AvatarFallback>
										</Avatar>
										<div>
											<CardTitle>{post.title}</CardTitle>
											<CardDescription>
												{new Date(
													post.date
												).toLocaleDateString()}
											</CardDescription>
										</div>
									</div>
								</CardHeader>
								<CardContent>
									<p className="whitespace-pre-line">
										{post.content}
									</p>
									<div className="mt-4 flex flex-wrap gap-2">
										{post.tags.map((tag) => (
											<span
												key={tag}
												className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
											>
												{tag}
											</span>
										))}
									</div>
								</CardContent>
								<CardFooter className="flex justify-between border-t p-4">
									<div className="flex items-center gap-4">
										<Button
											variant="ghost"
											size="sm"
											className="gap-1"
										>
											<ThumbsUp className="h-4 w-4" />
											<span>{post.likes}</span>
										</Button>
										<Button
											variant="ghost"
											size="sm"
											className="gap-1"
										>
											<MessageSquare className="h-4 w-4" />
											<span>{post.comments.length}</span>
										</Button>
									</div>
									<div className="flex gap-2">
										<Button variant="outline" size="sm">
											Edit
										</Button>
										<Button variant="destructive" size="sm">
											Delete
										</Button>
									</div>
								</CardFooter>
							</Card>
						))
					) : (
						<Card>
							<CardContent className="flex flex-col items-center justify-center p-6">
								<div className="rounded-full bg-muted p-3">
									<BookOpen className="h-6 w-6 text-muted-foreground" />
								</div>
								<h3 className="mt-3 font-medium">
									No blog posts yet
								</h3>
								<p className="text-sm text-muted-foreground">
									Create your first blog post to share your
									thoughts
								</p>
								<Button
									className="mt-4"
									onClick={() => setDialogOpen(true)}
								>
									Create Post
								</Button>
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
								Add a comment to this blog post.
							</DialogDescription>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<div className="grid gap-2">
								<Label htmlFor="comment">Comment</Label>
								<Textarea
									id="comment"
									placeholder="Your thoughts or feedback"
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
