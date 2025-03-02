import ResponsiveModal from '@/components/responsive-modal';
import { allocation, getAllUsers } from '@/features/users/api';
import { StudentUser, TutorUser } from '@/features/users/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Dispatch, SetStateAction, useEffect } from 'react';
import * as z from 'zod';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { ComboBox } from '@/components/ui/combo-box';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
	MultiSelector,
	MultiSelectorContent,
	MultiSelectorInput,
	MultiSelectorItem,
	MultiSelectorList,
	MultiSelectorTrigger,
} from '@/components/ui/multi-select';
import { cn } from '@/utils';
import RequiredStar from '@/components/ui/required-star';

type AllocateTutorProp = {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
	selectedStudent?: StudentUser | null;
	setSelectedStudent?: Dispatch<SetStateAction<StudentUser | null>>;
	selectedTutorId?: number | null;
	setSelectedTutorId?: Dispatch<SetStateAction<number | null>>;
};

const allocateTutorSchema = z.object({
	studentUsername: z
		.array(z.string())
		.nonempty('At least one student is required'),
	studentIds: z.array(z.string()),
	tutorId: z.string().nonempty('Tutor required'),
});

export type AllocateTutor = z.infer<typeof allocateTutorSchema>;

const AllocateTutor = ({
	isOpen,
	setIsOpen,
	selectedStudent,
	setSelectedStudent,
	selectedTutorId,
	setSelectedTutorId,
}: AllocateTutorProp) => {
	const queryClient = useQueryClient();

	const { data: tutorData } = useQuery<TutorUser[]>({
		queryKey: ['get-all-users-tutor-allocation'],
		queryFn: async (): Promise<TutorUser[]> =>
			await getAllUsers('role=tutor').then((response) => {
				if (response.data.code === 200) {
					return (response.data.data as TutorUser[]).filter(
						(tutor: TutorUser) => tutor.status
					);
				}

				throw new Error('Fetch Tutor Listing Fail!');
			}),
		enabled: isOpen === true,
	});

	const { data: studentData } = useQuery<StudentUser[]>({
		queryKey: ['get-all-users-student-unAllocated'],
		queryFn: async (): Promise<StudentUser[]> => {
			const response = await getAllUsers('role=student');
			if (response.data.code === 200) {
				const filterData = (response.data.data as StudentUser[]).filter(
					(student: StudentUser) =>
						student.allocateTutorId === null && student.status
				);
				return filterData as StudentUser[];
			}

			throw new Error('Fetch Student Listing Fail!');
		},
		enabled: isOpen === true,
	});

	const { mutateAsync: allocateUser, isPending } = useMutation({
		mutationFn: async (body: AllocateTutor) =>
			await allocation(body).then(async (response) => {
				if (response.data.code === 200) {
					toast.success(
						selectedTutorId
							? "Student's allocation successful"
							: "Tutor's allocation successful"
					);
					setIsOpen(false);
					if (setSelectedStudent) {
						setSelectedStudent(null);
					}
					if (setSelectedTutorId) {
						setSelectedTutorId(null);
					}

					queryClient.invalidateQueries({
						queryKey: ['get-all-users-student'],
					});
					return response.data;
				}
				throw new Error('Allocation Create Fail!');
			}),
	});

	const form = useForm<AllocateTutor>({
		resolver: zodResolver(allocateTutorSchema),
		defaultValues: {
			studentIds: [],
			studentUsername: [],
			tutorId: '',
		},
	});

	function onSubmit(values: AllocateTutor) {
		allocateUser(values);
	}

	useEffect(() => {
		if (selectedStudent) {
			form.setValue('studentIds', [selectedStudent.id?.toString() ?? '']);
			form.setValue(
				'tutorId',
				selectedStudent.allocateTutorId?.toString() ?? ''
			);
			form.setValue('studentUsername', [selectedStudent.username]);
		} else {
			form.setValue('tutorId', '');
		}
	}, [selectedStudent]);

	useEffect(() => {
		if (!isOpen) {
			if (setSelectedStudent) {
				setSelectedStudent(null);
			}
			if (setSelectedTutorId) {
				setSelectedTutorId(null);
			}
			form.reset({
				studentUsername: [],
				studentIds: [],
				tutorId: '',
			});
		}
	}, [isOpen]);

	const selectedStudentUsername = useWatch({
		control: form.control,
		name: 'studentUsername',
	});

	useEffect(() => {
		if (selectedStudentUsername.length > 0 && !selectedStudent) {
			const selectedStudents = studentData?.filter((student) =>
				selectedStudentUsername.includes(student.username)
			);
			const studentIds =
				selectedStudents?.map((student) => student.id.toString()) || [];

			form.setValue('studentIds', studentIds);
		}
	}, [selectedStudentUsername, studentData]);

	useEffect(() => {
		if (selectedTutorId) {
			form.setValue('tutorId', selectedTutorId.toString());
		}
	}, [selectedTutorId]);

	return (
		<ResponsiveModal
			className={cn(
				'px-7 sm:min-h-[50vh] md:min-h-[50vh]',
				selectedStudent && 'md:min-h-[30vh]',
				selectedTutorId && 'md:min-h-[40vh]'
			)}
			isOpen={isOpen}
			setIsOpen={setIsOpen}
		>
			<div className="flex flex-col justify-center">
				<h1 className="mb-5 font-roboto-slab text-xl font-semibold">
					Tutor Assignment for {selectedStudent?.name}
				</h1>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<div className="flex flex-1 flex-col gap-3">
							{!selectedTutorId && (
								<FormField
									control={form.control}
									name="tutorId"
									render={({ field }) => {
										return (
											<FormItem className="mt-1 flex flex-col space-y-3">
												<FormLabel>
													Personal Tutor{' '}
													<RequiredStar />
												</FormLabel>
												<FormControl>
													<ComboBox
														data={tutorData ?? []}
														selectedValue={Number(
															field.value
														)}
														onSelect={(value) => {
															form.setValue(
																'tutorId',
																value?.toString() ??
																	''
															);
														}}
														placeholder="Select Tutor"
														extraLabelKey={[
															'username',
															'specializationName',
														]}
														valueKey="id"
														labelKey="name"
													/>
												</FormControl>

												<FormMessage />
											</FormItem>
										);
									}}
								/>
							)}

							{!selectedStudent && (
								<FormField
									control={form.control}
									name="studentUsername"
									render={({ field }) => {
										return (
											<FormItem>
												<FormLabel>
													Select Student{' '}
													<RequiredStar />
												</FormLabel>
												<FormControl>
													<MultiSelector
														values={field.value.map(
															String
														)}
														onValuesChange={
															field.onChange
														}
													>
														<MultiSelectorTrigger className="ring-gray-500 focus-within:ring-2 focus-within:ring-slate-500">
															<MultiSelectorInput placeholder="Select Student" />
														</MultiSelectorTrigger>
														<MultiSelectorContent>
															<MultiSelectorList>
																{studentData?.map(
																	(
																		student
																	) => (
																		<MultiSelectorItem
																			key={
																				student.id
																			}
																			value={
																				student.username
																			}
																		>
																			{`${student.name} - (${student.username})`}
																		</MultiSelectorItem>
																	)
																)}
															</MultiSelectorList>
														</MultiSelectorContent>
													</MultiSelector>
												</FormControl>
												<FormMessage />
											</FormItem>
										);
									}}
								/>
							)}

							{!selectedStudent && (
								<FormField
									control={form.control}
									name="studentIds"
									render={({ field }) => {
										return (
											<FormItem className="hidden">
												<FormLabel>
													Select Student
												</FormLabel>
												<FormControl>
													<MultiSelector
														values={field.value.map(
															String
														)}
														onValuesChange={
															field.onChange
														}
													>
														<MultiSelectorTrigger className="ring-gray-500 focus-within:ring-2 focus-within:ring-slate-500">
															<MultiSelectorInput placeholder="Select Student" />
														</MultiSelectorTrigger>
														<MultiSelectorContent>
															<MultiSelectorList>
																{studentData?.map(
																	(
																		student
																	) => (
																		<MultiSelectorItem
																			key={
																				student.id
																			}
																			value={student.id.toString()}
																		>
																			{`${student.name} - (${student.username})`}
																		</MultiSelectorItem>
																	)
																)}
															</MultiSelectorList>
														</MultiSelectorContent>
													</MultiSelector>
												</FormControl>
												<FormMessage />
											</FormItem>
										);
									}}
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

							<Button type="submit" disabled={isPending}>
								{isPending ? 'Loading' : 'Assign'}
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</ResponsiveModal>
	);
};

export default AllocateTutor;
