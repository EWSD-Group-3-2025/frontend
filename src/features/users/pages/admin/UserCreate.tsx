import { createUser } from '@/features/users/api';
import UserForm, { UserFormValue } from '@/features/users/pages/admin/UserForm';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const UserCreate = () => {
	const navigate = useNavigate();

	const { mutateAsync } = useMutation({
		mutationFn: async (body: UserFormValue) =>
			await createUser(body as UserFormValue)
				.then((response) => {
					if (response.data.code === 201) {
						navigate('/dashboard/admin/users');
						toast.success(response.data.message);
					}
					return response.data;
				})
				.catch((e) => {
					if (e.response.data.code === 409) {
						toast.error(
							e.response?.data?.message ?? 'Request Failed',
							{
								description:
									e.response?.data?.data ||
									'Something went wrong. Please try again.',
							}
						);
					}
				}),
	});

	return <UserForm handleSubmit={mutateAsync} />;
};

export default UserCreate;
