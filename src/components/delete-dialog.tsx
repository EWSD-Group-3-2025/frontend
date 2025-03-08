import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { useDeleteModalStore } from '@/hooks/useDeleteModalStore';
import { CircleAlert } from 'lucide-react';

type DeleteDialogProps = {
	title: string;
	description: string;
	handleDelete: () => void;
};

const DeleteDialog = ({
	title,
	description,
	handleDelete,
}: DeleteDialogProps) => {
	const { open, setOpen } = useDeleteModalStore();

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="hide-scroll-bar min-h-[20vh] w-full overflow-y-auto border-none p-6 sm:max-w-lg">
				<div className="flex gap-3">
					<CircleAlert className="mt-2 text-destructive" />
					<DialogHeader>
						<DialogTitle className="font-roboto-slab text-3xl">
							{title}
						</DialogTitle>
						<DialogDescription className="">
							{description}
						</DialogDescription>
					</DialogHeader>
				</div>
				<div className="flex justify-end gap-3">
					<Button
						className="w-24"
						variant="destructive"
						onClick={handleDelete}
					>
						Delete
					</Button>
					<Button className="w-24" onClick={() => setOpen(false)}>
						Cancel
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default DeleteDialog;
