import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import { useOpenBlogMutationDialogStore } from '../store/open-blog-mutation-dialog-store';

export default function BlogNotFoundCard() {
	const { setIsOpen } = useOpenBlogMutationDialogStore();
	return (
		<Card>
			<CardContent className="flex flex-col items-center justify-center p-6">
				<div className="rounded-full bg-muted p-3">
					<BookOpen className="h-6 w-6 text-muted-foreground" />
				</div>
				<h3 className="mt-3 font-medium">No blog posts yet</h3>
				<p className="text-sm text-muted-foreground">
					Create your first blog post to share your thoughts
				</p>
				<Button
					onClick={() => {
						setIsOpen({ isOpen: true, blog: null });
					}}
					className="mt-4"
				>
					Create New Blog
				</Button>
			</CardContent>
		</Card>
	);
}
