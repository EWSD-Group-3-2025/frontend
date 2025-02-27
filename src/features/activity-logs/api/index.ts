import api from '@/utils/axios';
import routes from '@/features/activity-logs/api/routes';

export const getAllActivityLogs = async () =>
	await api.get<HTTPResponse<ActivityLog[]>>(routes.activityLogs);
