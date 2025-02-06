import { useAuth } from '@/context/auth.context';
import { UserButton } from '@/features/auth/components/user-button';

export default function StudentDashboard() {
	const { user } = useAuth();

	return (
		<div>
			<UserButton user={user} />
		</div>
	);
}
