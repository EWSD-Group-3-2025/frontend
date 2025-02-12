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

type UserFormProps = {
	formData?: UserFormValue;
	handleSubmit: (body: UserFormValue) => Promise<HTTPResponse<boolean>>;
};

const userFormSchema = z.object({
	name: z.string({ message: 'Name Required' }),
	username: z.string(),
	email: z.string({ message: 'Email Required' }),
	roleId: z.string({ message: 'Role required' }),
});

export type UserFormValue = z.infer<typeof userFormSchema>;

const UserForm = ({ formData, handleSubmit }: UserFormProps) => {
	const navigate = useNavigate();
	const transform = objectToArray(USER_ROLES);

	const form = useForm<UserFormValue>({
		resolver: zodResolver(userFormSchema),
		defaultValues: formData ?? {
			name: '',
			email: '',
			username: '',
			roleId: '',
		},
	});

	function onSubmit(values: UserFormValue) {
		console.log(values);
		handleSubmit(values);
	}

	console.log(form.formState.defaultValues);

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
													{transform.map((role) => (
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

							<div className="flex flex-1 flex-col gap-3"></div>
						</div>
						<div className="mt-6 flex justify-end gap-2">
							<Button
								className="bg-slate-500 hover:bg-slate-500"
								type="reset"
								onClick={() =>
									navigate('/dashboard/admin/users')
								}
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
