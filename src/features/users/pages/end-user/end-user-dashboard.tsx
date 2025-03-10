import { USER_ROLE } from '@/constants';
import { useAuth } from '@/context/auth.context';
import { Loader2 } from 'lucide-react';
import TutorDashboard from './tutor-dashboard';
import { StudentDashboard } from './student-dashboard';
import { useLocation } from 'react-router-dom';

export default function EndUserDashboard() {
	const { user, loading } = useAuth();
	const location = useLocation();

	if (loading) {
		return (
			<div>
				<Loader2 className="size-6 animate-spin" />
			</div>
		);
	}

	if (
		user?.roleName === USER_ROLE.TUTOR ||
		(user?.roleName === USER_ROLE.ADMIN &&
			location.pathname.includes('/dashboard/management/tutor'))
	) {
		return <TutorDashboard />;
	} else if (
		user?.roleName === USER_ROLE.STUDENT ||
		(user?.roleName === USER_ROLE.ADMIN &&
			location.pathname.includes('/dashboard/management/student'))
	) {
		return <StudentDashboard />;
	} else {
		return null;
	}
}
