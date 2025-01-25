import * as z from 'zod';
import { toast } from 'sonner';
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
import { register } from '@/api/auth';

const formSchema = z
	.object({
		name: z.string().min(1, { message: 'Name is required' }),
		email: z.string().email({ message: 'Email is required' }),
		password: z.string().min(1, { message: 'Password is required' }),
		confirmationPassword: z
			.string()
			.min(1, { message: 'Confirmation Password is required' }),
	})
	.refine((data) => data.password === data.confirmationPassword, {
		message: 'Passwords must match',
		path: ['confirmationPassword'],
	});

const Register = () => {
	const navigate = useNavigate();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
			confirmationPassword: '',
		},
	});

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		await register(data)
			.then((response) => {
				if (response.data.code === 201) {
					navigate('/');
					toast.success('Register Successfully. Please login');
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
					Register
				</h1>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem className="mb-3">
									<FormLabel>User Name</FormLabel>
									<FormControl>
										<Input
											className="border-black"
											placeholder="Enter User Name"
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
							name="email"
							render={({ field }) => (
								<FormItem className="mb-3">
									<FormLabel>Email</FormLabel>
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
									<FormLabel>Password</FormLabel>
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

						<FormField
							control={form.control}
							name="confirmationPassword"
							render={({ field }) => (
								<FormItem className="mb-3">
									<FormLabel>Confirm Password</FormLabel>
									<FormControl>
										<PasswordInput
											className="border-black"
											placeholder="Enter Your Confirmation Password"
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
					to="/login"
					className="relative mt-3 inline-block text-sm text-gray-700 transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-blue-500 after:transition-all after:duration-300 hover:text-blue-500 hover:after:w-full"
				>
					Already Have an Account? Log in
				</Link>
			</div>
		</div>
	);
};

export default Register;
