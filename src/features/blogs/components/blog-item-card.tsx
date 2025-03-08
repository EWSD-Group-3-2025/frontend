import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Blog } from '@/features/blogs/types';
import { MessageSquare, ThumbsUp } from 'lucide-react';
import { useOpenBlogMutationDialogStore } from '../store/open-blog-mutation-dialog-store';
import { format } from 'date-fns';

interface BlogItemCardProps {
	blog: Blog;
}

export default function BlogItemCard({ blog }: BlogItemCardProps) {
	const { setIsOpen } = useOpenBlogMutationDialogStore();

	return (
		<Card key={blog.id}>
			<CardHeader>
				<div className="flex items-center gap-4">
					<Avatar>
						<AvatarFallback>
							{blog.authorName.charAt(0)}
						</AvatarFallback>
					</Avatar>
					<div>
						<CardTitle className="text-xl">{blog.title}</CardTitle>
						<CardDescription>
							<span>
								{format(
									new Date(blog.createdAt),
									'do MMMM yyyy'
								)}
							</span>
						</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<p className="whitespace-pre-line">{blog.content}</p>
				{/* <div className="mt-4 flex flex-wrap gap-2">
                                        {blog.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div> */}
			</CardContent>
			<CardFooter className="flex justify-between border-t p-4">
				<div className="flex items-center gap-4">
					<Button variant="ghost" size="sm" className="gap-1">
						<ThumbsUp className="h-4 w-4" />
						{/* <span>{blog.likes}</span> */}
					</Button>
					<Button variant="ghost" size="sm" className="gap-1">
						<MessageSquare className="h-4 w-4" />
						{/* <span>{blog.comments.length}</span> */}
					</Button>
				</div>
				<div className="flex gap-2">
					<Button
						onClick={() => {
							setIsOpen({ isOpen: true, blog });
						}}
						variant="outline"
						size="sm"
					>
						Edit
					</Button>
					<Button variant="destructive" size="sm">
						Delete
					</Button>
				</div>
			</CardFooter>
		</Card>
	);
}
