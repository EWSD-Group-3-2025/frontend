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
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
	name: z.string().trim().min(1, { message: 'Name required' }),
});

interface UserProfileEditFormProps {
	name?: string;
}

export default function UserProfileEditForm({
	name,
}: UserProfileEditFormProps) {
	const [isChangedFiled, setIsChangedFiled] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name,
		},
	});

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		// User profile update here
		console.log(data);
	};

	useEffect(() => {
		// TODO Check if there any other way to check default value and form value
		if (form.getValues('name') !== name) {
			setIsChangedFiled(true);
		} else {
			setIsChangedFiled(false);
		}
	}, [form.getValues('name')]);

	return (
		<div className="mt-4">
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
										defaultValue={name}
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
						disabled={
							!isChangedFiled || form.formState.isSubmitting
						}
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
