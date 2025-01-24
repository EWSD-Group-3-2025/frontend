import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/form';
import { Input } from '@/components/input';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/button';
import { Link } from 'react-router-dom';
import { login } from '@/api/auth';

const formSchema = z.object({
	email: z.string(),
	password: z.string(),
});

// Testing the login function with fetch
// export const login = async (data: { email: string; password: string }) => {
// 	try {
// 		const response = await fetch(
// 			'http://localhost:8081/api/v1/auth/login',
// 			{
// 				method: 'POST',
// 				headers: {
// 					'Content-Type': 'application/json',
// 				},
// 				body: JSON.stringify(data),
// 			}
// 		);

// 		if (!response.ok) {
// 			throw new Error('Failed to login. Please check your credentials.');
// 		}

// 		return await response.json(); // Assuming the server responds with JSON.
// 	} catch (error) {
// 		console.error('Error during login:', error);
// 		throw error; // Re-throw to handle in the component.
// 	}
// };

const Login = () => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		await login(data)
			.then((response) => console.log(response.data))
			.catch((e) => console.log(e, 'ERROR IS'));
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
									<FormLabel>Username</FormLabel>
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
