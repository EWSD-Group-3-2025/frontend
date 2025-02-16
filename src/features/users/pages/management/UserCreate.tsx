import { createUser } from '@/features/users/api';
import { useUserBasePath } from '@/hooks/useUserBasePath';
import UserForm, {
	UserFormValue,
} from '@/features/users/pages/management/UserForm';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const UserCreate = () => {
	const navigate = useNavigate();
	const baseURL = useUserBasePath();

	const { mutateAsync } = useMutation({
		mutationFn: async (body: UserFormValue) =>
			await createUser(body)
				.then((response) => {
					if (response.data.code === 201) {
						navigate(`${baseURL}/users`);
						toast.success(response.data.message);
					}
					return response.data;
				})
				.catch((e) => {
					toast.error(e.response?.data?.message ?? 'Request Failed');
					return e.response.data;
				}),
	});

	return <UserForm handleSubmit={mutateAsync} />;
};

export default UserCreate;
