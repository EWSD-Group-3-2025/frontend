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
import { zodResolver } from '@hookform/resolvers/zod';
import { EyeIcon, EyeOffIcon, Keyboard } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { resetPassword } from '../api';
import { useMutation } from '@tanstack/react-query';
import { ResetPasswordRequest } from '../types';

const formSchema = z.object({
	newPassword: z.string().trim().min(6, { message: 'New Password required' }),
	confirmPassword: z
		.string()
		.trim()
		.min(6, { message: 'Confirm Password required' }),
});

export default function ResetPasswordPage() {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const navigate = useNavigate();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			newPassword: '',
			confirmPassword: '',
		},
	});

	const { mutate: resetPasswordMutation, isPending: resetPasswordPending } =
		useMutation({
			mutationFn: async ({
				newPassword,
				confirmPassword,
			}: ResetPasswordRequest) =>
				await resetPassword({ newPassword, confirmPassword }),
		});

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		resetPasswordMutation(data, {
			onSuccess: ({ data: resData }) => {
				toast.success(resData.message);
				navigate('/reset-password-successful');
			},
			onError: ({ message }) => {
				toast.error(message);
			},
		});
	};

	return (
		<div className="mt-10 flex flex-col items-center justify-center md:mt-20">
			<Card className="max-w-[500px] md:min-w-[500px]">
				<CardHeader>
					<Keyboard className="mx-auto mb-3 size-12 rounded-lg border p-2 hover:animate-pulse" />
					<CardTitle className="text-center text-3xl">
						Set new password
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
								disabled={
									resetPasswordPending ||
									form.formState.isSubmitting
								}
								control={form.control}
								name="newPassword"
								render={({ field }) => (
									<FormItem className="mb-3">
										<FormLabel htmlFor="newPassword">
											New Password
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
													id="newPassword"
													type={
														showPassword
															? 'text'
															: 'password'
													}
													placeholder="New Password"
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
							<FormField
								disabled={
									resetPasswordPending ||
									form.formState.isSubmitting
								}
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
														form.formState
															.isSubmitting
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
														form.formState
															.isSubmitting
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
								disabled={
									resetPasswordPending ||
									form.formState.isSubmitting
								}
								type="submit"
								className="w-full text-neutral-100 hover:text-neutral-200"
							>
								{form.formState.isSubmitting
									? 'Resetting...'
									: 'Reset password'}
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
