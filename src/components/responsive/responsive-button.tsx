import { ElementType } from 'react';

import { Button, ButtonProps } from '@/components/ui/button';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { useMedia } from 'react-use';

type ResponsiveButtonProps = {
	text: string;
	icon: ElementType;
	variant?: ButtonProps['variant'];
	handleClick: () => void;
};
const ResponsiveButton = ({
	text,
	icon: Icon,
	variant,
	handleClick,
}: ResponsiveButtonProps) => {
	const isDesktop = useMedia('(min-width: 450px)', true);

	if (isDesktop) {
		return (
			<Button
				variant={variant ?? 'default'}
				className="text-white [&_svg]:size-6 xs:[&_svg]:size-4"
				onClick={handleClick}
			>
				<Icon />
				<span className="hidden xs:block">{text}</span>
			</Button>
		);
	}

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant={variant ?? 'default'}
						className="text-white [&_svg]:size-6 xs:[&_svg]:size-4"
						onClick={handleClick}
					>
						<Icon />
						<span className="hidden xs:block">{text}</span>
					</Button>
				</TooltipTrigger>
				<TooltipContent className="bg-slate-500">
					<p>{text}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export default ResponsiveButton;
