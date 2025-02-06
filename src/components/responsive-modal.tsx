'use client';

import { useMedia } from 'react-use';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
import { Drawer, DrawerContent, DrawerTitle } from './ui/drawer';

interface ResponsiveModalProps {
	children: React.ReactNode;
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
}

export default function ResponsiveModal({
	children,
	isOpen,
	setIsOpen,
}: ResponsiveModalProps) {
	const isDesktop = useMedia('(min-width: 1024px)', true);

	if (isDesktop) {
		return (
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent className="hide-scroll-bar min-h-[70vh] w-full overflow-y-auto border-none p-0 sm:max-w-lg">
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
				<div className="hide-scroll-bar min-h-[70vh] overflow-y-auto">
					{children}
				</div>
			</DrawerContent>
		</Drawer>
	);
}
