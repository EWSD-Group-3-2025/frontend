'use client';

import { useMedia } from 'react-use';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
import { Drawer, DrawerContent, DrawerTitle } from './ui/drawer';
import { cn } from '@/utils';

interface ResponsiveModalProps {
	children: React.ReactNode;
	isOpen: boolean;
	className?: string;
	setIsOpen: (open: boolean) => void;
}

export default function ResponsiveModal({
	children,
	isOpen,
	className,
	setIsOpen,
}: ResponsiveModalProps) {
	const isDesktop = useMedia('(min-width: 768px)', true);

	if (isDesktop) {
		return (
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent
					className={cn(
						'hide-scroll-bar min-h-[70vh] w-full overflow-y-auto border-none p-0 sm:max-w-lg',
						className
					)}
				>
					<DialogTitle className="hidden"></DialogTitle>
					{children}
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Drawer open={isOpen} onOpenChange={setIsOpen}>
			<DrawerContent>
				<DrawerTitle className="hidden"></DrawerTitle>
				<div
					className={cn(
						'hide-scroll-bar min-h-[70vh] overflow-y-auto',
						className
					)}
				>
					{children}
				</div>
			</DrawerContent>
		</Drawer>
	);
}
