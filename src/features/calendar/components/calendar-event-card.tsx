import { cn } from '@/utils';

interface CalendarEventCardItemProps {
	event: any;
}

export default function CalendarEventCardItem({
	event,
}: CalendarEventCardItemProps) {
	return (
		<div>
			<div className="rounded bg-primary/30 p-2 text-primary">
				{/* <div className={cn('mx-1 mb-3 rounded-sm border-l-4 bg-muted p-2')}> */}
				<p className="text-sm font-bold">Event: {event.title}</p>
				{/* </div> */}
			</div>
		</div>
	);
}
