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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { updateAuthAccount } from '../api';
import { toast } from 'sonner';
import { useAuth } from '@/context/auth.context';
import { usernameExistsCount } from '@/features/users/api';
import { convertNameToSlug } from '@/utils/stringUtils';
import { UpdateUserProfileRequest } from '../types';
import { CheckCircle2, Loader, XCircle } from 'lucide-react';

const formSchema = z.object({
	name: z
		.string()
		.trim()
		.min(1, { message: 'Name required' })
		.regex(
			/^[a-zA-Z0-9-\s]+$/,
			"Name can only contain ASCII letters, digits, spaces, and '-'"
		),
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
	const [debounceTimeout, setDebounceTimeout] =
		useState<NodeJS.Timeout | null>(null);
	const { userDataRefresh } = useAuth();
	const [searchName, setSearchName] = useState('');
	const [isLoadingSearchName, setIsLoadingSearchName] = useState(false);
	const queryClient = useQueryClient();
	const [isChangedFiled, setIsChangedFiled] = useState(false);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name,
			username,
		},
	});

	const {
		data: usernameExistsCountData,
		isLoading: isLoadingUsernameExistsCountData,
		isPending: isPendingUsernameExistsCountData,
		isError: isErrorUsernameExistsCountData,
	} = useQuery({
		queryKey: ['username-exists-counts', searchName],
		queryFn: async () => {
			return await usernameExistsCount({ name: searchName });
		},
		retry: 3,
	});

	const { mutate: updateProfileMutation, isPending: updateProfilePending } =
		useMutation({
			mutationFn: async ({ name, username }: UpdateUserProfileRequest) =>
				await updateAuthAccount({ name, username }),
		});

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		// User profile update here
		updateProfileMutation(data, {
			onSuccess: ({ data: resData }) => {
				// Invalidate auth user query
				userDataRefresh();
				queryClient.invalidateQueries({ queryKey: ['authUser'] });
				toast.success(resData.message);
			},
			onError: ({ message }) => {
				toast.error(message);
			},
		});
	};

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newName = e.target.value;

		form.setValue('name', newName);

		setIsLoadingSearchName(true);

		if (!/^[a-zA-Z0-9-\s]*$/.test(newName)) {
			form.setError('name', {
				type: 'manual',
				message:
					"Name can only contain ASCII letters, digits, spaces, and '-'",
			});
			return;
		} else {
			form.clearErrors('name');
		}

		if (debounceTimeout) clearTimeout(debounceTimeout);

		const newTimeout = setTimeout(() => setSearchName(newName), 1500);

		setDebounceTimeout(newTimeout);
	};

	useEffect(() => {
		if (!searchName || !isChangedFiled) {
			setIsLoadingSearchName(false);
			return;
		}

		if (isErrorUsernameExistsCountData) {
			setIsLoadingSearchName(false);
			return;
		}

		if (
			!isLoadingUsernameExistsCountData &&
			usernameExistsCountData?.data?.code === 200 &&
			usernameExistsCountData?.data?.success === 1
		) {
			const count = usernameExistsCountData?.data?.data?.count ?? 0;
			const baseUsername = convertNameToSlug(form.getValues('name'));
			const newUsername =
				count > 0 ? `${baseUsername}-${count}` : baseUsername;

			form.setValue('username', newUsername);
		}
		setIsLoadingSearchName(false);
	}, [usernameExistsCountData, searchName]);

	// Watch the form
	const watchedValues = form.watch(['name', 'username']);
	useEffect(() => {
		setIsChangedFiled(watchedValues[0] !== name);
	}, [watchedValues, name, username]);

	const loadingSearchName =
		isLoadingSearchName ||
		isLoadingUsernameExistsCountData ||
		isPendingUsernameExistsCountData;

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
										disabled={updateProfilePending}
										id="name"
										placeholder="John Doe"
										{...field}
										onChange={handleNameChange}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{isChangedFiled &&
						(loadingSearchName && !form.formState.errors.name ? (
							<div className="flex items-center gap-x-2">
								<Loader className="size-4 animate-spin text-emerald-500/60 duration-150" />
								<p className="text-sm text-muted-foreground">
									Checking availability...
								</p>
							</div>
						) : isErrorUsernameExistsCountData ||
						  form.formState.errors.name ? (
							<div className="flex items-center gap-x-2 text-red-500">
								<XCircle className="size-4" />
								<p className="text-sm">
									Failed to check username availability.
								</p>
							</div>
						) : (
							<div className="flex items-center gap-x-2">
								<CheckCircle2 className="size-4 text-emerald-500" />
								<div className="text-sm">
									<p className="text-emerald-500">
										Your username will be created as{' '}
										<span className="break-all font-bold">
											{form.getValues('username')}
										</span>
									</p>
									<p className="text-muted-foreground">
										Username can only contain ASCII letters,
										digits, and the characters -.
									</p>
								</div>
							</div>
						))}
					{}
					<FormField
						control={form.control}
						name="username"
						render={({ field }) => (
							<FormItem className="mb-3 hidden">
								<FormLabel htmlFor="username">
									Username
									<span className="ml-1 text-red-500">*</span>
								</FormLabel>
								<FormControl>
									<div className="relative h-full w-full">
										<Input
											defaultValue={username}
											disabled={true}
											id="username"
											placeholder="john-doe"
											{...field}
										/>
									</div>
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
