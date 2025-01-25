import * as z from 'zod';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	Button,
	PasswordInput,
} from '@/components';
import { login } from '@/api/auth';

const formSchema = z.object({
	email: z.string().email({ message: 'Email required' }),
	password: z.string().min(1, { message: 'Password required' }),
});

const Login = () => {
	const navigate = useNavigate();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		await login(data)
			.then((response) => {
				if (response.data.code === 200) {
					Cookies.set('token', response.data.data.accessToken);
					Cookies.set(
						'refresh-token',
						response.data.data.refreshToken
					);

					navigate('/dashboard');
					toast.success('Log in success');
				}
			})
			.catch((e) => {
				if (e.response.data) {
					toast.error(e.response.data.message);
				} else {
					toast.error('Something went wrong');
				}
			});
	};

	return (
		<div className="login flex h-screen items-center justify-center">
			<div className="w-1/2 rounded-lg bg-slate-200 p-5 px-7 shadow lg:w-1/3">
				<h1 className="text-center text-3xl font-bold text-current">
					Log in
				</h1>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem className="mb-3">
									<FormLabel>
										Email
										<span className="ml-1 text-red-500">
											*
										</span>
									</FormLabel>
									<FormControl>
										<Input
											className="border-black"
											placeholder="Enter Email"
											type="text"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem className="mb-3">
									<FormLabel>
										Password
										<span className="ml-1 text-red-500">
											*
										</span>
									</FormLabel>
									<FormControl>
										<PasswordInput
											className="border-black"
											placeholder="Enter Your Password"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button className="mt-4" type="submit">
							Submit
						</Button>
					</form>
				</Form>

				<Link
					to="/register"
					className="relative mt-3 inline-block text-sm text-gray-700 transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-blue-500 after:transition-all after:duration-300 hover:text-blue-500 hover:after:w-full"
				>
					Don't have an Account yet?
				</Link>
			</div>
		</div>
	);
};

export default Login;
