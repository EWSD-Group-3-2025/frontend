import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { SmilePlus } from 'lucide-react';
import { useState } from 'react';

interface EmojiPickerComponentProps {
	onEmojiSelect: (event: any) => void;
}

export default function EmojiPickerComponent({
	onEmojiSelect,
}: EmojiPickerComponentProps) {
	const [open, setOpen] = useState(false);
	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button variant="ghost" size="sm" className="gap-1">
					<SmilePlus className="h-4 w-4" />
				</Button>
			</PopoverTrigger>
			<PopoverContent>
				<Picker
					data={data}
					onEmojiSelect={(e: any) => {
						onEmojiSelect(e);
						setOpen(false);
					}}
				/>
			</PopoverContent>
		</Popover>
	);
}
