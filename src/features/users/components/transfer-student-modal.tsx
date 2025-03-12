import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import ResponsiveModal from '@/components/responsive-modal';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import RequiredStar from '@/components/ui/required-star';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useMutation, useQueries } from '@tanstack/react-query';
import { getTutorDashboard, transferStudent } from '@/features/users/api';
import { StudentUser, TutorUser } from '@/features/users/types';
import { ComboBox } from '@/components/ui/combo-box';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronsDown,
	ChevronsLeft,
	ChevronsRight,
	ChevronUp,
	Loader2,
} from 'lucide-react';
import { useMedia } from 'react-use';
import { cn } from '@/utils';

type TransferStudentModalProps = {
	isOpen: boolean;
	tutorData: {
		id: number;
		name: string;
	};
	tutorList: TutorUser[];
	setIsOpen: (isOpen: boolean) => void;
};

const transferStudentSchema = z.object({
	firstTutorId: z.string(),
	firstTutorName: z.string().optional(),
	secondTutorId: z.string().nonempty('Tutor required'),
	studentsFromFirstToSecond: z.array(z.number()),
	studentsFromSecondToFirst: z.array(z.number()),
});

export type TransferStudentFormValue = z.infer<typeof transferStudentSchema>;

const TransferStudentModal = ({
	isOpen,
	setIsOpen,
	tutorData,
	tutorList,
}: TransferStudentModalProps) => {
	const isMobile = useMedia('(max-width: 640px)', true);

	const [firstTutorStudents, setFirstTutorStudents] = useState<StudentUser[]>(
		[]
	);
	const [secondTutorStudents, setSecondTutorStudents] = useState<
		StudentUser[]
	>([]);
	const [selectedLeft, setSelectedLeft] = useState<number[]>([]);
	const [selectedRight, setSelectedRight] = useState<number[]>([]);

	const form = useForm<TransferStudentFormValue>({
		resolver: zodResolver(transferStudentSchema),
		defaultValues: {
			firstTutorId: tutorData.id.toString(),
			firstTutorName: tutorData.name,
			secondTutorId: '',
			studentsFromFirstToSecond: [],
			studentsFromSecondToFirst: [],
		},
	});

	const [
		{
			refetch: firstTutorStudentRefetch,
			isLoading: firstTutorStudentLoading,
		},
		{
			refetch: secondTutorStudentRefetch,
			isLoading: secondTutorStudentLoading,
		},
	] = useQueries({
		queries: [
			{
				queryKey: ['first-tutor-students', tutorData.id],
				queryFn: async (): Promise<HTTPResponse<StudentUser[]>> =>
					await getTutorDashboard(tutorData.id).then((response) => {
						if (response.data.code === 200) {
							setFirstTutorStudents(response.data.data);
							return response.data;
						}

						throw new Error('Fetch Tutor 1 Students Fail!');
					}),
			},
			{
				queryKey: [
					'second-tutor-students',
					form.watch('secondTutorId'),
				],
				queryFn: async (): Promise<HTTPResponse<StudentUser[]>> =>
					await getTutorDashboard(
						Number(form.watch('secondTutorId'))
					).then((response) => {
						if (response.data.code === 200) {
							setSecondTutorStudents(response.data.data);
							return response.data;
						}

						throw new Error('Fetch Tutor 2 Students Fail!');
					}),
				enabled: !!form.watch('secondTutorId'),
			},
		],
	});

	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (body: TransferStudentFormValue) =>
			await transferStudent(body).then((response) => {
				if (response.data.code) {
					setIsOpen(false);
					toast.success(
						`${tutorData.name}'s students are transferred ${tutorList?.find((tutor) => tutor.id.toString() === form.getValues('secondTutorId'))?.name ?? ''}`
					);
				}
			}),
	});

	function onSubmit(values: TransferStudentFormValue) {
		mutateAsync({
			firstTutorId: values.firstTutorId,
			secondTutorId: values.secondTutorId,
			studentsFromFirstToSecond: firstTutorStudents.map(
				(student) => student.id
			),
			studentsFromSecondToFirst: secondTutorStudents.map(
				(student) => student.id
			),
		});
	}

	const moveRight = () => {
		setSecondTutorStudents((prev) => [
			...prev,
			...firstTutorStudents.filter((student) =>
				selectedLeft.includes(student.id)
			),
		]);
		setFirstTutorStudents((prev) =>
			prev.filter((student) => !selectedLeft.includes(student.id))
		);
		setSelectedLeft([]);
	};

	const moveLeft = () => {
		setFirstTutorStudents((prev) => [
			...prev,
			...secondTutorStudents.filter((student) =>
				selectedRight.includes(student.id)
			),
		]);
		setSecondTutorStudents((prev) =>
			prev.filter((student) => !selectedRight.includes(student.id))
		);
		setSelectedRight([]);
	};

	const moveAllRight = () => {
		setSecondTutorStudents([...secondTutorStudents, ...firstTutorStudents]);
		setFirstTutorStudents([]);
		setSelectedLeft([]);
	};

	const moveAllLeft = () => {
		setFirstTutorStudents([...firstTutorStudents, ...secondTutorStudents]);
		setSecondTutorStudents([]);
		setSelectedRight([]);
	};

	useEffect(() => {
		if (form.watch('secondTutorId')) {
			firstTutorStudentRefetch();
			secondTutorStudentRefetch();
		}
	}, [form.watch('secondTutorId')]);

	useEffect(() => {
		if (!isOpen) {
			form.reset({
				firstTutorId: '',
				firstTutorName: '',
				secondTutorId: '',
				studentsFromFirstToSecond: [],
				studentsFromSecondToFirst: [],
			});
			setFirstTutorStudents([]);
			setSecondTutorStudents([]);
		}
	}, [isOpen]);

	useEffect(() => {
		if (tutorData) {
			form.setValue('firstTutorId', tutorData.id.toString());
			form.setValue('firstTutorName', tutorData.name);
		}
	}, [tutorData]);

	console.log(form.formState.errors);

	return (
		<ResponsiveModal
			className="h-fit overflow-hidden p-7 sm:max-w-4xl md:w-3/4"
			isOpen={isOpen}
			setIsOpen={setIsOpen}
		>
			<div className="">
				<h1 className="mb-5 font-roboto-slab text-3xl font-semibold">
					Transfer Student
				</h1>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<div className="">
							<div className="flex h-full flex-col gap-4 sm:flex-row">
								{/* First Tutor Students */}
								<div className="h-full w-full sm:w-2/5">
									<FormField
										control={form.control}
										name="firstTutorName"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													First Tutor
													<RequiredStar />
												</FormLabel>
												<FormControl>
													<Input
														className="disabled:opacity-100"
														placeholder="Please enter your name"
														type="text"
														disabled
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<Card
										className={cn(
											'mt-3 h-32 w-full overflow-auto border p-4 sm:h-64',
											firstTutorStudentLoading &&
												'flex items-center justify-center'
										)}
									>
										{!firstTutorStudentLoading ? (
											firstTutorStudents.map(
												(student, i) => (
													<div
														key={i}
														className="my-2"
													>
														<Checkbox
															id={`student-${student.id}`}
															className="me-2"
															checked={selectedLeft.includes(
																student.id
															)}
															onCheckedChange={(
																checked
															) => {
																setSelectedLeft(
																	(prev) =>
																		checked
																			? [
																					...prev,
																					student.id,
																				]
																			: prev.filter(
																					(
																						id
																					) =>
																						id !==
																						student.id
																				)
																);
															}}
														/>
														<label
															htmlFor={`student-${student.id}`}
														>
															{student.name}
														</label>
													</div>
												)
											)
										) : (
											<Loader2 className="size-6 animate-spin" />
										)}
									</Card>
								</div>

								{/* Transfer Buttons */}
								<div className="flex h-full flex-row items-center justify-center gap-2 self-center sm:w-1/5 sm:flex-col">
									<Button
										onClick={moveAllRight}
										className="w-fit"
										disabled={
											firstTutorStudents.length === 0 ||
											!form.watch('secondTutorId')
										}
									>
										{isMobile ? (
											<ChevronsDown />
										) : (
											<ChevronsRight />
										)}
									</Button>
									<Button
										className="w-fit"
										onClick={moveRight}
										disabled={
											selectedLeft.length === 0 ||
											!form.watch('secondTutorId')
										}
									>
										{isMobile ? (
											<ChevronDown />
										) : (
											<ChevronRight />
										)}
									</Button>
									<Button
										className="w-fit"
										onClick={moveLeft}
										disabled={selectedRight.length === 0}
									>
										{isMobile ? (
											<ChevronUp />
										) : (
											<ChevronLeft />
										)}
									</Button>
									<Button
										className="w-fit"
										onClick={moveAllLeft}
										disabled={
											secondTutorStudents.length === 0
										}
									>
										{isMobile ? (
											<ChevronsDown />
										) : (
											<ChevronsLeft />
										)}
									</Button>
								</div>

								{/* Second Tutor Students */}
								<div className="h-full w-full sm:w-2/5">
									<FormField
										control={form.control}
										name="secondTutorId"
										render={({ field }) => {
											return (
												<FormItem className="mt-1 flex flex-col space-y-3">
													<FormLabel>
														Second Tutor
														<RequiredStar />
													</FormLabel>
													<FormControl>
														<ComboBox
															data={
																tutorList ?? []
															}
															selectedValue={Number(
																field.value
															)}
															onSelect={(
																value
															) => {
																form.setValue(
																	'secondTutorId',
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

									<Card
										className={cn(
											'mt-3 h-32 w-full overflow-auto border p-4 sm:h-64',
											secondTutorStudentLoading &&
												'flex items-center justify-center'
										)}
									>
										{!secondTutorStudentLoading ? (
											secondTutorStudents.map(
												(student, i) => (
													<div
														key={i}
														className="my-2"
													>
														<Checkbox
															id={`student-${student.id}`}
															className="me-2"
															checked={selectedRight.includes(
																student.id
															)}
															onCheckedChange={(
																checked
															) => {
																setSelectedRight(
																	(prev) =>
																		checked
																			? [
																					...prev,
																					student.id,
																				]
																			: prev.filter(
																					(
																						id
																					) =>
																						id !==
																						student.id
																				)
																);
															}}
														/>
														<label
															htmlFor={`student-${student.id}`}
														>
															{student.name}
														</label>
													</div>
												)
											)
										) : (
											<Loader2 className="size-6 animate-spin" />
										)}
									</Card>
								</div>
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
									{isPending ? (
										<Loader2 className="size-6 animate-spin" />
									) : (
										'Transfer'
									)}
								</Button>
							</div>
						</div>
					</form>
				</Form>
			</div>
		</ResponsiveModal>
	);
};

export default TransferStudentModal;
