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
	FormMessage,
} from '@/components/ui/form';
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from '@/components/ui/input-otp';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { forgotPassword, verifyOtp } from '../api';
import { useEffect, useRef, useState } from 'react';
import { ForgotPasswordRequest, VerifyOtpRequest } from '../types';

const formSchema = z.object({
	otpCode: z.string().trim().min(6, { message: 'OTP code required' }),
});

export default function VerifyOTPPage() {
	// Ref to store interval ID
	const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
	const [searchParams] = useSearchParams();
	const forgotResetEmail = searchParams.get('forgot-reset-email');
	const [countdown, setCountdown] = useState(60);
	const [canResend, setCanResend] = useState(false);

	const navigate = useNavigate();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			otpCode: '',
		},
	});

	const { mutate: forgotPasswordMutation, isPending: forgotPasswordPending } =
		useMutation({
			mutationFn: async ({ email }: ForgotPasswordRequest) =>
				await forgotPassword({ email }),
		});

	const { mutate: verifyOtpMutation, isPending: verifyOtpPending } =
		useMutation({
			mutationFn: async ({ otp }: VerifyOtpRequest) =>
				await verifyOtp({ otp }),
		});

	// Handle countdown to resend OTP
	const handleResendOTPCountdown = () => {
		countdownTimerRef.current = setInterval(() => {
			setCountdown((prev) => {
				if (prev <= 1) {
					if (countdownTimerRef.current) {
						clearInterval(countdownTimerRef.current);
					}
					setCanResend(true);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
	};

	const handleResendOTP = async () => {
		if (!forgotResetEmail) {
			toast.error('Forgot password reset email is missing');
			navigate('/forgot-password');
			return;
		}

		setCanResend(false);
		setCountdown(60); // Reset timer

		// Restart countdown timer
		countdownTimerRef.current = setInterval(() => {
			setCountdown((prev) => {
				if (prev <= 1) {
					if (countdownTimerRef.current) {
						clearInterval(countdownTimerRef.current);
					}
					setCanResend(true);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		forgotPasswordMutation(
			{ email: forgotResetEmail },
			{
				onSuccess: ({ data: resData }) => {
					toast.success(resData.message);
				},
				onError: ({ message }) => {
					toast.error(message);
					setCanResend(true); // Allow resending in case of failure
				},
			}
		);
	};

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		verifyOtpMutation(
			{ otp: data.otpCode },
			{
				onSuccess: ({ data: resData }) => {
					toast.success(resData.message);
					navigate('/reset-password');
				},
				onError: ({ message }) => {
					toast.error(message);
				},
			}
		);
	};

	useEffect(() => {
		handleResendOTPCountdown();

		return () => {
			if (countdownTimerRef.current) {
				clearInterval(countdownTimerRef.current);
			}
		};
	}, []);

	return (
		<div className="mt-10 flex flex-col items-center justify-center md:mt-20">
			<Card className="max-w-[500px] md:min-w-[500px]">
				<CardHeader>
					<Mail className="mx-auto mb-3 size-12 rounded-lg border p-2 hover:animate-pulse" />
					<CardTitle className="text-center text-3xl">
						Verify Code
					</CardTitle>
					<CardDescription className="mt-1 text-center">
						We sent a code to user11@gmail.com
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-1"
						>
							<FormField
								disabled={
									verifyOtpPending ||
									form.formState.isSubmitting
								}
								control={form.control}
								name="otpCode"
								render={({ field }) => (
									<FormItem className="mb-3 flex flex-col items-center justify-center">
										<FormControl>
											<InputOTP
												disabled={
													verifyOtpPending ||
													form.formState.isSubmitting
												}
												maxLength={6}
												{...field}
											>
												<InputOTPGroup>
													<InputOTPSlot
														className="size-12"
														index={0}
													/>
													<InputOTPSlot
														className="size-12"
														index={1}
													/>
													<InputOTPSlot
														className="size-12"
														index={2}
													/>
												</InputOTPGroup>
												<InputOTPSeparator />
												<InputOTPGroup>
													<InputOTPSlot
														className="size-12"
														index={3}
													/>
													<InputOTPSlot
														className="size-12"
														index={4}
													/>
													<InputOTPSlot
														className="size-12"
														index={5}
													/>
												</InputOTPGroup>
											</InputOTP>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="space-y-3">
								<Button
									disabled={
										verifyOtpPending ||
										form.formState.isSubmitting
									}
									type="submit"
									className="w-full text-neutral-100 hover:text-neutral-200"
								>
									{form.formState.isSubmitting
										? 'Verifying...'
										: 'Continue'}
								</Button>
								<Button
									variant={'secondary'}
									disabled={
										!canResend ||
										forgotPasswordPending ||
										form.formState.isSubmitting
									}
									type="button"
									onClick={handleResendOTP}
									className="w-full"
								>
									{forgotPasswordPending
										? 'Resending Verify OTP...'
										: canResend
											? 'Resend Verification Code'
											: `Resend in ${countdown}s`}
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
