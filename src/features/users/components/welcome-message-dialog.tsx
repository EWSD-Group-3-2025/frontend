import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { useWelcomeMessageStore } from '../store/use-welcome-message-store';

export default function WelcomeMessageDialog() {
	const { isFirstVisit, setIsFirstVisit } = useWelcomeMessageStore();

	// If it's not the user's first visit, don't show the dialog
	if (!isFirstVisit) return null;

	return (
		<Dialog
			open={isFirstVisit}
			onOpenChange={() => {
				if (isFirstVisit) {
					setIsFirstVisit(false);
				}
			}}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="text-center text-3xl">
						👋🏻 Welcome Folk
					</DialogTitle>
					<DialogDescription className="mt-1 text-center">
						We're glad to here with you! You can now continue to
						your dashboard.
					</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}
