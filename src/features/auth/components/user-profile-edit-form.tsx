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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { updateAuthAccount } from '../api';
import { toast } from 'sonner';

const formSchema = z.object({
	name: z.string().trim().min(1, { message: 'Name required' }),
	username: z.string().trim().min(1, { message: 'Username required' }),
});

interface UserProfileEditFormProps {
	name: string;
	username: string;
}

export default function UserProfileEditForm({
	name,
	username,
}: UserProfileEditFormProps) {
	const queryClient = useQueryClient();
	const [isChangedFiled, setIsChangedFiled] = useState(false);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name,
			username,
		},
	});

	const { mutate: updateProfileMutation, isPending: updateProfilePending } =
		useMutation({
			mutationFn: async ({ name, username }: UpdateUserProfileRequest) =>
				await updateAuthAccount({ name, username }),
		});

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		// User profile update here
		updateProfileMutation(data, {
			onSuccess: ({ data }) => {
				// Invalidate auth user query
				queryClient.invalidateQueries({ queryKey: ['authUser'] });
				toast.success(data.message);
			},
			onError: ({ message }) => {
				toast.error(message);
			},
		});
	};

	useEffect(() => {
		// TODO Check if there any other way to check default value and form value
		if (
			form.getValues('name') !== name &&
			form.getValues('username') !== name
		) {
			setIsChangedFiled(true);
		} else {
			setIsChangedFiled(false);
		}
	}, [form.getValues('name'), form.getValues('username')]);

	return (
		<div className="mt-4">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-4"
				>
					<FormField
						control={form.control}
						name="username"
						render={({ field }) => (
							<FormItem className="mb-3">
								<FormLabel htmlFor="username">
									Username
									<span className="ml-1 text-red-500">*</span>
								</FormLabel>
								<FormControl>
									<Input
										defaultValue={username}
										disabled={updateProfilePending}
										id="username"
										placeholder="john-doe"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
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
										disabled={updateProfilePending}
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
						disabled={!isChangedFiled || updateProfilePending}
						type="submit"
						className="w-full"
					>
						{updateProfilePending ? 'Saving...' : 'Save'}
					</Button>
				</form>
			</Form>
		</div>
	);
}
