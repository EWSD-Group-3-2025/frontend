import { useMutation } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

import { updateUser } from '@/features/users/api';
import UserForm, { UserFormValue } from '@/features/users/pages/admin/UserForm';
import { toast } from 'sonner';

const UserUpdate = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const { mutateAsync } = useMutation({
		mutationFn: async (body: UserFormValue) =>
			await updateUser(Number(id), body).then((response) => {
				if (response.data.code === 200) {
					navigate('/dashboard/admin/users');
					toast.success(response.data.message);
				}

				return response.data;
			}),
	});

	const data = {
		name: 'Hlaing Hpone',
		email: 'hlainghpone@gmail.com',
		username: '12344',
		roleId: '1',
	};

	return <UserForm formData={data} handleSubmit={mutateAsync} />;
};

export default UserUpdate;
