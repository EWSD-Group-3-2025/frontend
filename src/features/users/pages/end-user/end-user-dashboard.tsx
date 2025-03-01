import { USER_ROLE } from '@/constants';
import { useAuth } from '@/context/auth.context';
import { Loader2 } from 'lucide-react';
import TutorDashboard from './tutor-dashboard';
import { StudentDashboard } from './student-dashboard';

export default function EndUserDashboard() {
	const { user, loading } = useAuth();

	if (loading) {
		return (
			<div>
				<Loader2 className="size-6 animate-spin" />
			</div>
		);
	}

	if (user?.roleName === USER_ROLE.TUTOR) {
		return <TutorDashboard />;
	} else if (user?.roleName === USER_ROLE.STUDENT) {
		return <StudentDashboard />;
	} else {
		return null;
	}
}
