import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

import { showUser, updateUser } from '@/features/users/api';
import UserForm, {
	UserFormValue,
} from '@/features/users/pages/management/UserForm';
import { toast } from 'sonner';
import { useUserBasePath } from '@/hooks/useUserBasePath';

const UserUpdate = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const baseURL = useUserBasePath();

	const { data, isLoading } = useQuery<HTTPResponse<UserFormValue>>({
		queryKey: ['get-user-by-id'],
		queryFn: async (): Promise<HTTPResponse<UserFormValue>> =>
			await showUser(Number(id)).then((response) => {
				if (response.data.code === 200) {
					return response.data;
				}

				throw new Error('Fetch User Show Fail!');
			}),
	});

	const { mutateAsync } = useMutation({
		mutationFn: async (body: UserFormValue) =>
			await updateUser(Number(id), body)
				.then((response) => {
					if (response.data.code === 200) {
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

	return (
		<>
			{data && !isLoading ? (
				<UserForm formData={data.data} handleSubmit={mutateAsync} />
			) : (
				''
			)}
		</>
	);
};

export default UserUpdate;
