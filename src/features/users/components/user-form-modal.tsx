import ResponsiveModal from '@/components/responsive-modal';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query';
import {
	createUser,
	updateUser,
	usernameExistsCount,
} from '@/features/users/api';
import { convertNameToSlug, transformObjects } from '@/utils';
import { CheckCircle2, Loader } from 'lucide-react';
import { getAllDepartments } from '@/features/departments/api';
import { getAllCourses } from '@/features/courses/api';
import { getAllSpecializations } from '@/features/specialization/api';
import { GENDER } from '@/constants';
import { ComboBox } from '@/components/ui/combo-box';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

type UserFormModalProp = {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
	formData?: UserFormValue;
	roleId: number;
	roleName: string;
	setSelectedUserId: Dispatch<SetStateAction<number | null>>;
};
const userFormSchema = z
	.object({
		id: z.number().optional(),
		name: z.string().nonempty('Name Required'),
		username: z.string(),
		email: z.string().nonempty('Email Required'),
		roleId: z.number(),
		gender: z.number().optional(),
		departmentId: z.number().nullable(),
		specializationId: z.number().nullable(),
		courseId: z.number().nullable(),
	})
	.superRefine((data, ctx) => {
		// ✅ If roleId is 1 or 2, department is required
		if ((data.roleId === 1 || data.roleId === 2) && !data.departmentId) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['departmentId'],
				message: 'Department required.',
			});
		}

		// ✅ If roleId is 3, course is required
		if (data.roleId === 3 && !data.courseId) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['courseId'],
				message: 'Course required.',
			});
		}

		// ✅ If roleId is 4, specialization is required
		if (data.roleId === 4 && !data.specializationId) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['specializationId'],
				message: 'Specialization is required for this role.',
			});
		}
	});

export type UserFormValue = z.infer<typeof userFormSchema>;

const UserFormModal = ({
	isOpen,
	setIsOpen,
	formData,
	roleId,
	roleName,
	setSelectedUserId,
}: UserFormModalProp) => {
	const queryClient = useQueryClient();
	const transform = transformObjects({ GENDER });
	const [searchName, setSearchName] = useState('');
	const [isLoadingSearchName, setIsLoadingSearchName] = useState(false);
	const [debounceTimeout, setDebounceTimeout] =
		useState<NodeJS.Timeout | null>(null);

	const [
		{
			data: usernameExistsCountData,
			isLoading: isLoadingUsernameExistsCountData,
			isPending: isPendingUsernameExistsCountData,
		},
		{ data: departmentData },
		{ data: courseData },
		{ data: specializationData },
	] = useQueries({
		queries: [
			{
				queryKey: ['username-exists-counts', searchName],
				queryFn: async () => {
					return await usernameExistsCount({ name: searchName });
				},
				enabled: !!searchName,
			},
			{
				queryKey: ['get-all-departments'],
				queryFn: async (): Promise<HTTPResponse<Department[]>> =>
					await getAllDepartments().then((response) => {
						if (response.data.code === 200) {
							return response.data;
						}

						throw new Error('Fetch Department Listing Fail!');
					}),
				enabled: roleId === 1 || roleId === 2,
			},
			{
				queryKey: ['get-all-courses'],
				queryFn: async (): Promise<HTTPResponse<Course[]>> =>
					await getAllCourses().then((response) => {
						if (response.data.code === 200) {
							return response.data;
						}

						throw new Error('Fetch Course Listing Fail!');
					}),
				enabled: roleId === 3,
			},
			{
				queryKey: ['get-all-specializations'],
				queryFn: async (): Promise<HTTPResponse<Specialization[]>> =>
					await getAllSpecializations().then((response) => {
						if (response.data.code === 200) {
							return response.data;
						}

						throw new Error('Fetch Specialization Listing Fail!');
					}),
				enabled: roleId === 4,
			},
		],
	});

	const { mutateAsync: userCreate } = useMutation({
		mutationFn: async (body: UserFormValue) =>
			await createUser(body)
				.then(async (response) => {
					if (response.data.code === 201) {
						toast.success(response.data.message);
						setIsOpen(false);

						await Promise.all([
							queryClient.invalidateQueries({
								queryKey: ['get-all-users-admin'],
							}),
							queryClient.invalidateQueries({
								queryKey: ['get-all-users-staff'],
							}),
							queryClient.invalidateQueries({
								queryKey: ['get-all-users-student'],
							}),
							queryClient.invalidateQueries({
								queryKey: ['get-all-users-tutor'],
							}),
						]);
						return response.data;
					}
					throw new Error('User Create Fail!');
				})
				.catch((e) => {
					if (e.response.data.code === 400) {
						toast.error(e.response.data.message);
						e.response.data.data.forEach(
							(err: { field: string; message: string }) => {
								form.setError(
									err.field as keyof UserFormValue,
									{
										type: 'server',
										message: err.message,
									}
								);
							}
						);
					}
				}),
	});

	const { mutateAsync: userUpdate } = useMutation({
		mutationFn: async (body: UserFormValue) =>
			await updateUser(body.id!, body)
				.then(async (response) => {
					if (response.data.code === 200) {
						toast.success(response.data.message);
						setIsOpen(false);

						await Promise.all([
							queryClient.invalidateQueries({
								queryKey: ['get-all-users-admin'],
							}),
							queryClient.invalidateQueries({
								queryKey: ['get-all-users-staff'],
							}),
							queryClient.invalidateQueries({
								queryKey: ['get-all-users-student'],
							}),
							queryClient.invalidateQueries({
								queryKey: ['get-all-users-tutor'],
							}),
						]);
						return response.data;
					}
					throw new Error('User Create Fail!');
				})
				.catch((e) => {
					if (e.response.data.code === 400) {
						toast.error(e.response.data.message);
						e.response.data.data.forEach(
							(err: { field: string; message: string }) => {
								form.setError(
									err.field as keyof UserFormValue,
									{
										type: 'server',
										message: err.message,
									}
								);
							}
						);
					}
				}),
	});

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newName = e.target.value;
		form.setValue('name', newName);
		setIsLoadingSearchName(true);
		if (debounceTimeout) clearTimeout(debounceTimeout);
		const newTimeout = setTimeout(() => setSearchName(newName), 1500);
		setDebounceTimeout(newTimeout);
	};

	const form = useForm<UserFormValue>({
		resolver: zodResolver(userFormSchema),
		defaultValues: {
			name: '',
			email: '',
			username: '',
			roleId: roleId,
			gender: undefined,
			departmentId: null,
			specializationId: null,
			courseId: null,
		},
	});

	function onSubmit(values: UserFormValue) {
		if (formData) {
			userUpdate(values);
		} else {
			userCreate(values);
		}
	}

	useEffect(() => {
		if (!searchName && !formData) {
			setIsLoadingSearchName(false);
			return;
		}

		if (
			!isLoadingUsernameExistsCountData &&
			usernameExistsCountData?.data?.code === 200 &&
			usernameExistsCountData?.data?.success === 1
		) {
			const count =
				usernameExistsCountData?.data?.data?.count === 0
					? usernameExistsCountData?.data?.data?.count
					: usernameExistsCountData?.data?.data?.count + 1;
			const newUsername = `${convertNameToSlug(form.getValues('name'))}-${count}`;
			form.setValue('username', newUsername);
		}
		setIsLoadingSearchName(false);
	}, [usernameExistsCountData, searchName]);

	useEffect(() => {
		if (!isOpen) {
			form.reset();
			setSearchName('');
			setIsLoadingSearchName(false);
			setSelectedUserId(null);
		}
	}, [isOpen]);

	useEffect(() => {
		if (formData) {
			Object.entries(formData).forEach(([key, value]) => {
				if (value !== null && value !== undefined) {
					form.setValue(key as keyof typeof formData, value);
				}
			});
		}
	}, [formData, form]);

	console.log(form.formState.errors);

	const loadingSearchName =
		isLoadingSearchName ||
		isLoadingUsernameExistsCountData ||
		isPendingUsernameExistsCountData;

	console.log(form.getValues());

	return (
		<ResponsiveModal className="px-7" isOpen={isOpen} setIsOpen={setIsOpen}>
			<div className="flex flex-col justify-center">
				<h1 className="mb-5 font-roboto-slab text-3xl font-semibold">
					{formData ? 'Edit' : 'Add'} {roleName}
				</h1>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<div className="flex flex-1 flex-col gap-3">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input
												placeholder="Please enter your name"
												type="text"
												{...field}
												onChange={(e) => {
													handleNameChange(e);
												}}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{searchName &&
								!formData &&
								(loadingSearchName ? (
									<div className="flex items-center gap-x-2">
										<Loader className="size-4 animate-spin text-emerald-500/60 duration-150" />
										<p className="text-sm text-muted-foreground">
											Checking availability...
										</p>
									</div>
								) : (
									<div className="flex items-center gap-x-2">
										<CheckCircle2 className="size-4 text-emerald-500" />
										<div className="text-sm">
											<p className="text-emerald-500">
												Your username will be created as{' '}
												<span className="font-bold">
													{form.getValues('username')}
												</span>
											</p>
											<p className="text-muted-foreground">
												Username can only contain ASCII
												letters, digits, and the
												characters -.
											</p>
										</div>
									</div>
								))}

							<FormField
								control={form.control}
								name="username"
								render={({ field }) => (
									<FormItem className="hidden">
										<FormLabel htmlFor="username">
											Username
											<span className="ml-1 text-red-500">
												*
											</span>
										</FormLabel>
										<FormControl>
											<div className="relative h-full w-full">
												<Input
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
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												placeholder="Please enter your email"
												type="email"
												{...field}
											/>
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="gender"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Gender</FormLabel>
										<Select
											onValueChange={(value) =>
												field.onChange(Number(value))
											}
											defaultValue={field.value?.toString()}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select Gender" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{transform.GENDER.map(
													(gender) => (
														<SelectItem
															value={gender.value.toString()}
															key={gender.key}
														>
															{gender.label}
														</SelectItem>
													)
												)}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							{(roleId === 1 || roleId === 2) && (
								<FormField
									control={form.control}
									name="departmentId"
									render={({ field }) => (
										<FormItem className="mt-1 flex flex-col space-y-3">
											<FormLabel>Department</FormLabel>
											<FormControl>
												<ComboBox
													data={
														departmentData?.data ??
														[]
													}
													onSelect={(
														value:
															| string
															| number
															| null
													) => {
														form.setValue(
															'departmentId',
															value as number
														);
													}}
													placeholder="Select Department"
													valueKey="id"
													labelKey="name"
													selectedValue={Number(
														field.value
													)}
												/>
											</FormControl>

											<FormMessage />
										</FormItem>
									)}
								/>
							)}

							{roleId === 3 && (
								<FormField
									control={form.control}
									name="courseId"
									render={({ field }) => (
										<FormItem className="mt-1 flex flex-col space-y-3">
											<FormLabel>Course</FormLabel>
											<FormControl>
												<ComboBox
													data={
														courseData?.data ?? []
													}
													onSelect={(
														value:
															| string
															| number
															| null
													) => {
														form.setValue(
															'courseId',
															value as number
														);
													}}
													placeholder="Select Course"
													valueKey="id"
													labelKey="name"
													selectedValue={Number(
														field.value
													)}
												/>
											</FormControl>

											<FormMessage />
										</FormItem>
									)}
								/>
							)}

							{roleId === 4 && (
								<FormField
									control={form.control}
									name="specializationId"
									render={({ field }) => (
										<FormItem className="mt-1 flex flex-col space-y-3">
											<FormLabel>
												Specialization
											</FormLabel>
											<FormControl>
												<ComboBox
													data={
														specializationData?.data ??
														[]
													}
													onSelect={(
														value:
															| string
															| number
															| null
													) => {
														form.setValue(
															'specializationId',
															value as number
														);
													}}
													placeholder="Select Specialization"
													valueKey="id"
													labelKey="name"
													selectedValue={Number(
														field.value
													)}
												/>
											</FormControl>

											<FormMessage />
										</FormItem>
									)}
								/>
							)}
						</div>
						<div className="mt-6 flex justify-end gap-2">
							<Button
								className="bg-slate-500 hover:bg-slate-500"
								type="reset"
								onClick={() => setIsOpen(false)}
							>
								Cancel
							</Button>

							<Button type="submit">
								{formData ? 'Edit' : 'Add'} {roleName}
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</ResponsiveModal>
	);
};

export default UserFormModal;
