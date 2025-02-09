import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { userChangePassword } from '@/features/users/api';
import { ChangePasswordRequest } from '@/features/users/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { EyeIcon, EyeOffIcon, Keyboard } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
	oldPassword: z.string().trim().min(6, { message: 'Old Password required' }),
	newPassword: z.string().trim().min(6, { message: 'New Password required' }),
	confirmPassword: z
		.string()
		.trim()
		.min(6, { message: 'Confirm Password required' }),
});

export default function ChangePasswordPage() {
	const [showOldPassword, setShowOldPassword] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const navigate = useNavigate();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			newPassword: '',
			confirmPassword: '',
			oldPassword: '',
		},
	});

	const { mutate: changePasswordMutation, isPending: changePasswordPending } =
		useMutation({
			mutationFn: async ({
				oldPassword,
				newPassword,
			}: ChangePasswordRequest) =>
				await userChangePassword({ oldPassword, newPassword }),
		});

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		if (data.confirmPassword !== data.newPassword) {
			toast.error('Password does not match');
			return;
		}

		const finalValue = {
			oldPassword: data.oldPassword,
			newPassword: data.newPassword,
		};

		changePasswordMutation(finalValue, {
			onSuccess: ({ data }) => {
				toast.success(data.message);
				navigate('/dashboard/student');
			},
			onError: (data: any) => {
				toast.error(data?.response?.data?.data);
			},
		});
	};

	return (
		<div className="mt-10 flex flex-col items-center justify-center md:mt-20">
			<Card className="max-w-[500px] md:min-w-[500px]">
				<CardHeader>
					<Keyboard className="mx-auto mb-3 size-12 rounded-lg border p-2 hover:animate-pulse" />
					<CardTitle className="text-center text-3xl">
						Change new password
					</CardTitle>
					<CardDescription className="mt-1 text-center">
						Must be at least 6 character and use strong combination
						of characters, number, uppercase and lowercase
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-4"
						>
							<FormField
								control={form.control}
								name="oldPassword"
								render={({ field }) => (
									<FormItem className="mb-3">
										<FormLabel htmlFor="oldPassword">
											Old Password
											<span className="ml-1 text-red-500">
												*
											</span>
										</FormLabel>
										<FormControl>
											<div className="relative">
												<Input
													disabled={
														changePasswordPending
													}
													id="oldPassword"
													type={
														showOldPassword
															? 'text'
															: 'password'
													}
													placeholder="Password"
													{...field}
												/>
												<button
													disabled={
														changePasswordPending
													}
													type="button"
													onClick={() =>
														setShowOldPassword(
															!showOldPassword
														)
													}
													className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
												>
													{showOldPassword ? (
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
							<FormField
								control={form.control}
								name="newPassword"
								render={({ field }) => (
									<FormItem className="mb-3">
										<FormLabel htmlFor="password">
											New Password
											<span className="ml-1 text-red-500">
												*
											</span>
										</FormLabel>
										<FormControl>
											<div className="relative">
												<Input
													disabled={
														changePasswordPending
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
														changePasswordPending
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
							<FormField
								control={form.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem className="mb-3">
										<FormLabel htmlFor="confirmPassword">
											Confirm Password
											<span className="ml-1 text-red-500">
												*
											</span>
										</FormLabel>
										<FormControl>
											<div className="relative">
												<Input
													disabled={
														changePasswordPending
													}
													id="confirmPassword"
													type={
														showConfirmPassword
															? 'text'
															: 'password'
													}
													placeholder="Confirm Password"
													{...field}
												/>
												<button
													disabled={
														changePasswordPending
													}
													type="button"
													onClick={() =>
														setShowConfirmPassword(
															!showConfirmPassword
														)
													}
													className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
												>
													{showConfirmPassword ? (
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
							<Button
								disabled={changePasswordPending}
								type="submit"
								className="w-full text-neutral-100 hover:text-neutral-200"
							>
								{changePasswordPending
									? 'Saving...'
									: 'Change password'}
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
