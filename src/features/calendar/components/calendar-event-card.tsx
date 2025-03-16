import { Bell, Video } from 'lucide-react';

interface CalendarEventCardItemProps {
	event: any;
}

export default function CalendarEventCardItem({
	event,
}: CalendarEventCardItemProps) {
	return (
		<div>
			<div className="space-x-2 rounded">
				{/* <div className={cn('mx-1 mb-3 rounded-sm border-l-4 bg-muted p-2')}> */}
				{event.type === 'meeting' && (
					<div className="flex flex-col items-center gap-x-2 gap-y-1 bg-primary/30 p-2 text-primary">
						<Bell className="mr-auto size-4" />
						<p className="mr-auto text-sm font-bold">
							{' '}
							{event.title}
						</p>
					</div>
				)}
				{event.type === 'event' && (
					<div className="flex flex-col items-center gap-x-2 gap-y-1 bg-purple-500/30 p-2">
						<Video className="mr-auto size-4" />
						<p className="mr-auto text-sm font-bold">
							{' '}
							{event.title}
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
