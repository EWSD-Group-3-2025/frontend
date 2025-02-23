import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/utils';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

interface ComboBoxProps<T> {
	data: T[];
	placeholder?: string;
	onSelect: (value: T[keyof T]) => void;
	selectedValue?: T[keyof T];
	className?: string;
	popoverClassName?: string;
	valueKey?: keyof T;
	labelKey?: keyof T;
	extraLabelKey?: (keyof T)[];
}

export const ComboBox = <T extends Record<string, any>>({
	data,
	placeholder = 'Select option...',
	onSelect,
	selectedValue,
	className,
	popoverClassName,
	valueKey = 'value',
	labelKey = 'label',
	extraLabelKey = [],
}: ComboBoxProps<T>) => {
	const [open, setOpen] = React.useState(false);
	const [value, setValue] = React.useState<T[keyof T]>(
		selectedValue ?? ('' as T[keyof T])
	);

	React.useEffect(() => {
		setValue(selectedValue ?? ('' as T[keyof T]));
	}, [selectedValue]);

	const handleSelect = (currentValue: T[keyof T]) => {
		const newValue =
			currentValue === value ? ('' as T[keyof T]) : currentValue;
		setValue(newValue);
		onSelect(newValue);
		setOpen(false);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className={cn('justify-between font-normal', className)}
				>
					{value
						? (data.find((item) => item[valueKey] === value)?.[
								labelKey
							] as string)
						: placeholder}
					<ChevronsUpDown className="opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className={cn('w-full p-0', popoverClassName)}>
				<Command>
					<CommandInput placeholder="Search..." className="h-9" />
					<CommandList>
						<CommandEmpty>No option found.</CommandEmpty>
						<CommandGroup>
							{data.map((item) => (
								<CommandItem
									key={String(item[valueKey])}
									value={String(item[valueKey])}
									onSelect={() =>
										handleSelect(item[valueKey])
									}
								>
									{`${item[labelKey]} - (${extraLabelKey
										.map((key) => item[key])
										.filter(Boolean)
										.join(', ')})`}
									<Check
										className={cn(
											'ml-auto',
											value === item[valueKey]
												? 'opacity-100'
												: 'opacity-0'
										)}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
};
