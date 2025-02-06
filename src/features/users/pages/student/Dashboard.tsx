import { useAuth } from '@/context/auth.context';

export default function StudentDashboard() {
	const { user } = useAuth();

	return <div>{user?.name}</div>;
}
