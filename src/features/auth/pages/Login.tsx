import { z } from 'zod';
import { toast } from 'sonner';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { EyeIcon, EyeOffIcon } from 'lucide-react';

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { login } from '@/features/auth/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth.context';
import { cn, getRedirectRoute, setNewUserFlag } from '@/utils';

const formSchema = z.object({
	email: z.string().trim().nonempty('Email or username required'),
	password: z.string().trim().min(1, { message: 'Password required' }),
});

export default function LoginPage() {
	const auth = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	const [showPassword, setShowPassword] = useState(false);

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
					auth.assignLoginToken(
						response.data.data.accessToken,
						response.data.data.refreshToken
					);

					form.reset();
					const redirectRoute = getRedirectRoute(
						response.data.data.user.roleName
					);

					if (response.data.data.user.firstTimeLogin) {
						navigate('/change-password');
						setNewUserFlag();
					} else {
						navigate(redirectRoute);
					}

					toast.success(response.data.message);
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

	if (!auth.loading && auth.user) {
		const redirectRoute = getRedirectRoute(auth.user.roleName);
		const from = redirectRoute || location.state?.from?.pathname;
		navigate(from);
		return;
	}

	return (
		<div className="container mx-auto flex w-full items-center justify-between px-4 py-8">
			<div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-x-8 gap-y-8 md:flex-row md:justify-between">
				{/* Login Form */}
				<div className="w-full max-w-md">
					<h1 className="mb-4 text-4xl font-semibold">
						Log in to Frontend
					</h1>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-4"
						>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem className="mb-3">
										<FormLabel htmlFor="email">
											Email or Username
											<span className="ml-1 text-red-500">
												*
											</span>
										</FormLabel>
										<FormControl>
											<Input
												disabled={
													form.formState.isSubmitting
												}
												id="email"
												placeholder="Email or username"
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
										<FormLabel htmlFor="password">
											Password
											<span className="ml-1 text-red-500">
												*
											</span>
										</FormLabel>
										<FormControl>
											<div className="relative">
												<Input
													disabled={
														form.formState
															.isSubmitting
													}
													id="password"
													type={
														showPassword
															? 'text'
															: 'password'
													}
													placeholder="Password"
													{...field}
												/>
												<button
													disabled={
														form.formState
															.isSubmitting
													}
													type="button"
													onClick={() =>
														setShowPassword(
															!showPassword
														)
													}
													className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
												>
													{showPassword ? (
														<EyeOffIcon className="h-5 w-5" />
													) : (
														<EyeIcon className="h-5 w-5" />
													)}
												</button>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="flex items-center justify-between text-sm text-gray-400">
								<Link
									to="/forgot-password"
									className={cn(
										'hover:underline',
										form.formState.isSubmitting &&
											'pointer-events-none'
									)}
								>
									Forgot password?
								</Link>
							</div>

							<Button
								disabled={form.formState.isSubmitting}
								type="submit"
								className="w-full text-neutral-100 hover:text-neutral-200"
							>
								{form.formState.isSubmitting
									? 'Logging...'
									: 'Login'}
							</Button>
						</form>
					</Form>
				</div>
				{/* Illustration */}
				<div className="w-full max-w-md">
					<div className="relative h-[400px] w-full md:h-[600px]">
						<img
							src="/img/login_img.png"
							alt="Decorative Illustration"
							className="h-full w-full object-contain"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
