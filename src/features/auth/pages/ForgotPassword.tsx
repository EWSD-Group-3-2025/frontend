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
import { useMutation } from '@tanstack/react-query';
import { Fingerprint } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { forgotPassword } from '../api';
import { ForgotPasswordRequest } from '../types';

const formSchema = z.object({
	email: z
		.string()
		.trim()
		.email({ message: 'Email required' })
		.min(1, { message: 'Email required' }),
});

export default function ForgotPasswordPage() {
	const navigate = useNavigate();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
		},
	});

	const { mutate: forgotPasswordMutation, isPending: forgotPasswordPending } =
		useMutation({
			mutationFn: async ({ email }: ForgotPasswordRequest) =>
				await forgotPassword({ email }),
		});

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		// User profile update here
		forgotPasswordMutation(data, {
			onSuccess: ({ data: resData }) => {
				toast.success(resData.message);
				navigate(`/verify-otp?forgot-reset-email=${data.email}`);
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
					<Fingerprint className="mx-auto mb-3 size-12 rounded-lg border p-2 hover:animate-pulse" />
					<CardTitle className="text-center text-3xl">
						Forget Password?
					</CardTitle>
					<CardDescription className="mt-1 text-center">
						Please enter your email to receive a verification code
						to reset password
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-1"
						>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem className="mb-3">
										<FormLabel htmlFor="email">
											Email
											<span className="ml-1 text-red-500">
												*
											</span>
										</FormLabel>
										<FormControl>
											<Input
												disabled={
													form.formState
														.isSubmitting ||
													forgotPasswordPending
												}
												id="email"
												type="email"
												placeholder="name@work-email.com"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button
								disabled={
									form.formState.isSubmitting ||
									forgotPasswordPending
								}
								type="submit"
								className="w-full text-neutral-100 hover:text-neutral-200"
							>
								{form.formState.isSubmitting
									? 'Sending...'
									: 'Send'}
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
