import { useState } from 'react';
import { cn } from '@/utils';
import { Button } from './ui/button';
import { FormControl } from './ui/form';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { CalendarIcon, ClockIcon } from 'lucide-react';
import { Calendar } from './ui/calendar';
import { format } from 'date-fns';
import { Input } from './ui/input';

interface DatePickerProps {
	value?: Date;
	onChange: (value: Date | undefined) => void;
	enableTimePicker?: boolean; // Optional Time Picker
}

export default function DatePicker({
	value,
	onChange,
	enableTimePicker = false,
}: DatePickerProps) {
	const [time, setTime] = useState(value ? format(value, 'HH:mm') : '12:00');

	const handleDateChange = (selectedDate?: Date) => {
		if (!selectedDate) return;

		if (enableTimePicker) {
			const [hours, minutes] = time.split(':').map(Number);
			const newDate = new Date(selectedDate);
			newDate.setHours(hours, minutes);
			onChange(newDate);
		} else {
			onChange(selectedDate);
		}
	};

	const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newTime = event.target.value;
		setTime(newTime);

		if (value) {
			const [hours, minutes] = newTime.split(':').map(Number);
			const updatedDate = new Date(value);
			updatedDate.setHours(hours, minutes);
			onChange(updatedDate);
		}
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<FormControl>
					<Button
						variant="outline"
						className={cn(
							'w-full pl-3 text-left font-normal',
							!value && 'text-muted-foreground'
						)}
					>
						{value ? (
							enableTimePicker ? (
								format(value, 'yyyy-MM-dd hh:mm a')
							) : (
								format(value, 'yyyy-MM-dd')
							)
						) : (
							<span>
								Pick a{' '}
								{enableTimePicker ? 'date & time' : 'date'}
							</span>
						)}
						<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
					</Button>
				</FormControl>
			</PopoverTrigger>
			<PopoverContent className="w-auto space-y-2 p-4" align="start">
				<Calendar
					mode="single"
					selected={value}
					onSelect={handleDateChange}
					disabled={(date) => date < new Date('1900-01-01')}
					initialFocus
				/>
				{/* Conditionally render time picker */}
				{enableTimePicker && (
					<div className="flex items-center space-x-2">
						<span className="gap-x flex items-center">
							<ClockIcon className="mr-2 h-5 w-5 text-muted-foreground" />
							<span>Time:</span>
						</span>
						<Input
							type="time"
							value={time}
							onChange={handleTimeChange}
							className="w-auto text-sm"
						/>
					</div>
				)}
			</PopoverContent>
		</Popover>
	);
}
