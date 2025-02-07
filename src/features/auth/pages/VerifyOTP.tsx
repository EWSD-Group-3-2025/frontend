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
import { Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
	otpCode: z.string().trim().min(4, { message: 'OTP code required' }),
});

export default function VerifyOTPPage() {
	const navigate = useNavigate();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			otpCode: '',
		},
	});

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		console.log(data);

		toast.success('Successfully verify');
		navigate('/reset-password');
	};

	return (
		<div className="mt-10 flex flex-col items-center justify-center md:mt-20">
			<Card className="min-w-[500px]">
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
								control={form.control}
								name="otpCode"
								render={({ field }) => (
									<FormItem className="mb-3 flex items-center justify-center">
										<FormControl>
											<InputOTP maxLength={6} {...field}>
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
							<Button
								disabled={form.formState.isSubmitting}
								type="submit"
								className="w-full text-neutral-200 hover:text-neutral-300"
							>
								{form.formState.isSubmitting
									? 'Verifying...'
									: 'Continue'}
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
