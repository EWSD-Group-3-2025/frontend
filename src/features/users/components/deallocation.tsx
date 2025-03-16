import ModalBox from '@/components/modal-box';
import { Button } from '@/components/ui/button';
import {
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { CircleAlert } from 'lucide-react';

type DeallocationStudentProps = {
	name: string;
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
	handleReset: () => void;
	type: 'student' | 'tutor';
};

const Deallocation = ({
	name,
	isOpen,
	setIsOpen,
	handleReset,
	type,
}: DeallocationStudentProps) => {
	return (
		<ModalBox
			className="min-h-[25vh] p-6"
			isOpen={isOpen}
			setIsOpen={setIsOpen}
		>
			<div className="flex gap-3 [&_svg]:size-10">
				<CircleAlert className="mt-2 text-destructive" />
				<DialogHeader>
					<DialogTitle className="font-roboto-slab text-3xl">
						Deallocate {type === 'student' ? 'Student' : 'Tutor'}
					</DialogTitle>
					<DialogDescription className="text-sm">
						Are you sure you want to deallocate {name}'s{' '}
						{type !== 'student' ? 'student' : 'tutor'}?
					</DialogDescription>
				</DialogHeader>
			</div>
			<div className="flex justify-end gap-3">
				<Button
					className="w-24"
					variant="destructive"
					onClick={handleReset}
				>
					Confirm
				</Button>
				<Button className="w-24" onClick={() => setIsOpen(false)}>
					Cancel
				</Button>
			</div>
		</ModalBox>
	);
};

export default Deallocation;
