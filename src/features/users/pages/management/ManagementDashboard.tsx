import { USER_ROLE } from '@/constants';
import { useAuth } from '@/context/auth.context';
import AdminDashboard from '@/features/users/pages/admin/Dashboard';
import StaffDashboard from '@/features/users/pages/staff/Dashboard';

const ManagementDashboard = () => {
	const { user } = useAuth();

	if (user?.roleName === USER_ROLE.ADMIN) {
		return <AdminDashboard />;
	} else if (user?.roleName === USER_ROLE.STAFF) {
		return <StaffDashboard />;
	} else {
		return null;
	}
};

export default ManagementDashboard;
