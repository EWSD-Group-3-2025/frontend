import {
	addMonths,
	addYears,
	format,
	getDay,
	parseISO,
	startOfWeek,
	subMonths,
} from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { useState } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './task-calendar.css';
import { Button } from '@/components/ui/button';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import CalendarEventCardItem from './calendar-event-card';

export interface NormalizedDataInterface {
	id: number;
	title: string;
	description: string;
	start: Date;
	end: Date;
	type: string;
	location: null;
	link: null;
}

interface TaskCalendarProps {
	data: NormalizedDataInterface[];
}

const locales = {
	'en-US': enUS,
};

const localizer = dateFnsLocalizer({
	format,
	parse: parseISO,
	startOfWeek,
	getDay,
	locales,
});

const CustomToolbar = ({
	value,
	handleDateNavigation,
}: {
	value: Date;
	handleDateNavigation: (action: 'NEXT' | 'PREV' | 'TODAY') => void;
}) => {
	return (
		<div className="mb-4 flex items-center justify-between gap-x-4 rounded-lg bg-muted px-4 py-2">
			<Button
				size={'icon'}
				variant={'outline'}
				onClick={() => {
					handleDateNavigation('PREV');
				}}
			>
				<ChevronLeft />
			</Button>
			<div className="flex items-center gap-x-2 text-muted-foreground">
				<CalendarDays
					className="size-5 cursor-pointer"
					onClick={() => {
						handleDateNavigation('TODAY');
					}}
				/>
				<p>{format(new Date(value), 'MMMM yyyy')}</p>
			</div>
			<Button
				size={'icon'}
				variant={'outline'}
				onClick={() => {
					handleDateNavigation('NEXT');
				}}
			>
				<ChevronRight />
			</Button>
		</div>
	);
};

export default function TaskCalendar({ data }: TaskCalendarProps) {
	const [value, setValue] = useState(
		data.length > 0 ? new Date(data[0].end) : new Date()
	);

	// Convert event data into the format required by react-big-calendar
	const events = data.map((task) => ({
		id: task.id,
		title: task.title, // Show event name
		type: task.type, // Show event name
		start: new Date(task.start), // Convert to Date object
		end: new Date(task.end), // Convert to Date object
		description: task.description, // Pass description for later use
	}));

	const handleDateNavigation = (action: 'NEXT' | 'PREV' | 'TODAY') => {
		switch (action) {
			case 'NEXT':
				setValue(addMonths(value, 1));
				break;
			case 'PREV':
				setValue(subMonths(value, 1));
				break;
			case 'TODAY':
				setValue(new Date());
				break;
			default:
				setValue(new Date());
				break;
		}
	};

	return (
		<div>
			<Calendar
				localizer={localizer}
				date={value}
				events={events}
				views={['month']}
				defaultView="month"
				toolbar
				showAllEvents
				className="h-full"
				max={addYears(new Date().getFullYear(), 1)}
				formats={{
					weekdayFormat: (date, culture, localizer) =>
						localizer?.format(date, 'EEE', culture) ?? '',
				}}
				components={{
					eventWrapper: ({ event }) => (
						<CalendarEventCardItem event={event} />
					),
					toolbar: () => (
						<CustomToolbar
							value={value}
							handleDateNavigation={handleDateNavigation}
						/>
					),
				}}
			/>
		</div>
	);
}
