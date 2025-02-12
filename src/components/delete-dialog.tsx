import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { useDeleteModalStore } from '@/hooks/useDeleteModalStore';

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
			<DialogContent className="hide-scroll-bar min-h-[70vh] w-full overflow-y-auto border-none p-0 sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
};

export default DeleteDialog;
