import { cn } from '@/utils';
import { ReactNode } from 'react';

const ContainerWrapper = ({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) => {
	return (
		<div
			className={cn(
				'h-[calc(100vh-160px)] rounded-md bg-container-bg p-7 shadow-wrapper',
				className
			)}
		>
			{children}
		</div>
	);
};

export default ContainerWrapper;
