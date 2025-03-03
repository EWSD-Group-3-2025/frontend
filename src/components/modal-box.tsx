import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/utils';
import React from 'react';

interface ResponsiveModalProps {
	children: React.ReactNode;
	isOpen: boolean;
	className?: string;
	setIsOpen: (open: boolean) => void;
}

const ModalBox = ({
	children,
	isOpen,
	className,
	setIsOpen,
}: ResponsiveModalProps) => {
	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent
				className={cn(
					'hide-scroll-bar min-h-[30vh] w-full overflow-y-auto border-none p-0 sm:max-w-lg',
					className
				)}
			>
				<DialogTitle className="hidden"></DialogTitle>
				{children}
			</DialogContent>
		</Dialog>
	);
};

export default ModalBox;
