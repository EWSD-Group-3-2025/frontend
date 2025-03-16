import { cn } from '@/utils';
import { Button } from './ui/button';
import { FormControl } from './ui/form';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from './ui/calendar';
import { format } from 'date-fns';

interface DatePickerProps {
	value?: Date;
	onChange: (value: Date | undefined) => void;
}

export default function DatePicker({ value, onChange }: DatePickerProps) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<FormControl>
					<Button
						variant={'outline'}
						className={cn(
							'w-full pl-3 text-left font-normal',
							!value && 'text-muted-foreground'
						)}
					>
						{value ? (
							format(value, 'PPP')
						) : (
							<span>Pick a date</span>
						)}
						<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
					</Button>
				</FormControl>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<Calendar
					mode="single"
					selected={value}
					onSelect={onChange}
					disabled={(date) => date < new Date('1900-01-01')}
					initialFocus
				/>
			</PopoverContent>
		</Popover>
	);
}
