import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/auth.context';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
	name: z.string().trim().min(1, { message: 'Name required' }),
});

export default function UserProfileEditForm() {
	const { user } = useAuth();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: user?.name,
		},
	});

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		// User profile update here
		console.log(data);
	};

	return (
		<div>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-4"
				>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem className="mb-3">
								<FormLabel htmlFor="name">
									Name
									<span className="ml-1 text-red-500">*</span>
								</FormLabel>
								<FormControl>
									<Input
										disabled={form.formState.isSubmitting}
										id="name"
										placeholder="John Doe"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button
						disabled={form.formState.isSubmitting}
						type="submit"
						className="w-full"
					>
						{form.formState.isSubmitting ? 'Saving...' : 'Save'}
					</Button>
				</form>
			</Form>
		</div>
	);
}
