import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import ContainerWrapper from '@/components/container-wrapper';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { objectToArray } from '@/utils';
import { USER_ROLES } from '@/constants';
import { useNavigate } from 'react-router-dom';
import { useUserBasePath } from '@/hooks/useUserBasePath';

type UserFormProps = {
	formData?: UserFormValue;
	handleSubmit: (body: UserFormValue) => Promise<HTTPResponse<boolean>>;
};

const userFormSchema = z.object({
	name: z.string({ message: 'Name Required' }),
	// .min(1, { message: 'Name Required' }),
	username: z.string(),
	email: z.string({ message: 'Email Required' }),
	// .min(1, { message: 'Email Required' }),
	roleId: z.string({ message: 'Role required' }),
	// .min(1, { message: 'Role Required' }),
	permissions: z.string().nullable(),
	department: z.string().nullable(),
	specialization: z.string().nullable(),
	course: z.string().nullable(),
});

export type UserFormValue = z.infer<typeof userFormSchema>;

const UserForm = ({ formData, handleSubmit }: UserFormProps) => {
	const navigate = useNavigate();
	const baseURL = useUserBasePath();
	const roles = objectToArray(USER_ROLES);

	const form = useForm<UserFormValue>({
		resolver: zodResolver(userFormSchema),
		defaultValues: formData ?? {
			name: '',
			email: '',
			username: '',
			roleId: '',
			permissions: '',
			department: '',
			specialization: '',
			course: '',
		},
	});

	function onSubmit(values: UserFormValue) {
		handleSubmit(values).then((e) => {
			(e as unknown as HTTPFailResponse).data.forEach((err) => {
				form.setError(err.field as keyof UserFormValue, {
					type: 'server',
					message: err.message,
				});
			});
		});
	}

	const selectedRoleId = form.watch('roleId');

	// Determine field name dynamically
	const getFieldName = () => {
		switch (selectedRoleId) {
			case '1':
				return 'permissions';
			case '2':
				return 'department';
			case '3':
				return 'specialization';
			case '4':
				return 'course';
			default:
				return 'name';
		}
	};

	// Determine label and placeholder
	const getInputProps = () => {
		switch (selectedRoleId) {
			case '1':
				return {
					label: 'Permissions',
					placeholder: 'Enter permissions',
				};
			case '2':
				return { label: 'Department', placeholder: 'Enter department' };
			case '3':
				return {
					label: 'Specialization',
					placeholder: 'Enter specialization',
				};
			case '4':
				return { label: 'Course', placeholder: 'Enter course' };
			default:
				return null;
		}
	};

	return (
		<>
			<div className="mb-3 flex justify-start">
				<h1 className="font-roboto-slab text-3xl font-semibold">
					User {formData ? 'Update' : 'Create'}
				</h1>
			</div>
			<ContainerWrapper>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<div className="flex gap-4">
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
												/>
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
									name="roleId"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Role</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Please select role" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{roles.map((role) => (
														<SelectItem
															key={role.value}
															value={role.value.toString()}
														>
															{role.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>

											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<div className="flex flex-1 flex-col gap-3">
								{selectedRoleId && getFieldName() && (
									<FormField
										control={form.control}
										name={getFieldName()} // Dynamic field name
										render={({ field }) => {
											const inputProps = getInputProps();

											return inputProps ? (
												<FormItem>
													<FormLabel>
														{inputProps.label}
													</FormLabel>
													<FormControl>
														<Input
															placeholder={
																inputProps.placeholder
															}
															{...field}
															value={
																field.value ??
																''
															}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											) : (
												<FormItem>
													<FormMessage />
												</FormItem>
											);
										}}
									/>
								)}
							</div>
						</div>
						<div className="mt-6 flex justify-end gap-2">
							<Button
								className="bg-slate-500 hover:bg-slate-500"
								type="reset"
								onClick={() => navigate(`${baseURL}/users`)}
							>
								Cancel
							</Button>

							<Button type="submit">Submit</Button>
						</div>
					</form>
				</Form>
			</ContainerWrapper>
		</>
	);
};

export default UserForm;
