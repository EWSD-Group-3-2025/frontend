import ModalBox from '@/components/modal-box';
import { Button } from '@/components/ui/button';
import {
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { OctagonAlert } from 'lucide-react';

type ResetPasswordConfirmationModalProps = {
	name: string;
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
	handleReset: () => void;
};

const ResetPasswordConfirmationModal = ({
	name,
	isOpen,
	setIsOpen,
	handleReset,
}: ResetPasswordConfirmationModalProps) => {
	return (
		<ModalBox
			className="min-h-[25vh] p-6"
			isOpen={isOpen}
			setIsOpen={setIsOpen}
		>
			<div className="flex gap-3 [&_svg]:size-10">
				<OctagonAlert className="text-warning" />
				<DialogHeader>
					<DialogTitle className="font-roboto-slab text-3xl">
						Reset Password
					</DialogTitle>
					<DialogDescription className="text-sm">
						Are you sure you want to reset{' '}
						<span className="font-bold text-white">{name}'s</span>{' '}
						password? A reset email will be sent random password to
						their registered email address.
					</DialogDescription>
				</DialogHeader>
			</div>
			<div className="flex justify-end gap-3">
				<Button
					className="w-24 bg-warning hover:bg-warning/90"
					variant="default"
					onClick={handleReset}
				>
					Reset
				</Button>
				<Button className="w-24" onClick={() => setIsOpen(false)}>
					Cancel
				</Button>
			</div>
		</ModalBox>
	);
};

export default ResetPasswordConfirmationModal;
