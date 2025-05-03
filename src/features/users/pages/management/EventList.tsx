import ContainerWrapper from '@/components/container-wrapper';
import DataTable from '@/components/data-table';
import DeleteDialog from '@/components/delete-dialog';
import ExportButton from '@/components/export-button';
import { HeaderSorting } from '@/components/header-sorting';
import ResponsiveTitle from '@/components/responsive/responsive-title';
import SearchBox from '@/components/search-box';
import { Button } from '@/components/ui/button';
import { deleteItem, getAll } from '@/features/events/api';
import { Event } from '@/features/events/types';
import { useDeleteModalStore } from '@/hooks/useDeleteModalStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const EventList = () => {
	const queryClient = useQueryClient();
	const { selectedId, setOpen, setSelectedId } = useDeleteModalStore();

	const { data, isLoading } = useQuery<HTTPResponse<Event[]>>({
		queryKey: ['get-all-events'],
		queryFn: async (): Promise<HTTPResponse<Event[]>> =>
			await getAll().then((response) => {
				if (response.data.code === 200) {
					return response.data;
				}

				throw new Error('Fetch Event Listing Fail!');
			}),
	});

	const { mutateAsync } = useMutation({
		mutationFn: async (id: number) =>
			await deleteItem(id)
				.then((response) => {
					if (response.status === 204) {
						queryClient.invalidateQueries({
							queryKey: ['get-all-events'],
						});
						toast.success('Delete Event Successfully');
						setOpen(false);
						setSelectedId(null);

						return response.data;
					}

					throw new Error('Event Delete Fail!');
				})
				.catch((e) => {
					setOpen(false);
					setSelectedId(null);
					toast.error(e.response?.data?.data ?? 'Request Failed', {
						description:
							e.response?.data?.message ??
							'Something wrong plz try again',
					});
					throw e;
				}),
	});

	const handleMutationDelete = () => {
		if (selectedId) {
			mutateAsync(selectedId);
		}
	};

	const eventListColumns: ColumnDef<Event>[] = [
		{
			id: 'no',
			header: 'No.',
			cell: (params) => params.row.index + 1,
		},
		{
			id: 'title',
			header: ({ column }) => (
				<HeaderSorting column={column} title="Title" />
			),
			accessorKey: 'title',
		},
		{
			id: 'description',
			header: ({ column }) => (
				<HeaderSorting column={column} title="Description" />
			),
			accessorKey: 'description',
		},
		{
			id: 'tutorName',
			header: ({ column }) => (
				<HeaderSorting column={column} title="Tutor Name" />
			),
			accessorKey: 'tutorName',
		},
		{
			id: 'start_date',
			header: ({ column }) => (
				<HeaderSorting column={column} title="Start Date" />
			),
			accessorKey: 'start_date',
			cell: (params) =>
				dayjs(params.row.original.startdate).format('YYYY-MM-DD'),
		},
		{
			id: 'end_date',
			header: ({ column }) => (
				<HeaderSorting column={column} title="End Date" />
			),
			accessorKey: 'end_date',
			cell: (params) =>
				dayjs(params.row.original.enddate).format('YYYY-MM-DD'),
		},
		{
			id: 'action',
			header: 'Action',
			accessorKey: 'action',
			cell: (params) => (
				<>
					<Button
						size="sm"
						className="bg-red-500 transition-all duration-300 hover:bg-red-500 active:scale-105 dark:text-font-white"
						onClick={() => {
							setSelectedId(Number(params.row.original.id));
							setOpen(true);
						}}
					>
						<Trash2 />
					</Button>
				</>
			),
		},
	];

	const exportColumns = [
		{
			key: 'id',
			header: 'ID',
		},
		{
			key: 'tutorName',
			header: 'Tutor Name',
		},
		{
			key: 'title',
			header: 'Title',
		},
		{
			key: 'description',
			header: 'Description',
		},
		{
			key: 'startdate',
			header: 'Start Date',
			transform: (value: unknown): string =>
				value && typeof value === 'string'
					? new Date(value).toISOString().slice(0, 10)
					: '',
		},
		{
			key: 'enddate',
			header: 'End Date',
			transform: (value: unknown): string =>
				value && typeof value === 'string'
					? new Date(value).toISOString().slice(0, 10)
					: '',
		},
	];

	return (
		<>
			<div className="mb-3 flex justify-between">
				<ResponsiveTitle title="Event List" />
			</div>
			<ContainerWrapper>
				<div className="mb-3 flex flex-wrap justify-between gap-3">
					<div className="flex flex-wrap gap-3">
						<SearchBox placeholder="Search Admin" />
					</div>
					{data && data.data.length > 0 && !isLoading && (
						<ExportButton
							data={
								data.data as unknown as Record<
									string,
									unknown
								>[]
							}
							columns={exportColumns}
							fileName="event_list"
						/>
					)}
				</div>
				<DataTable
					columns={eventListColumns}
					isLoading={isLoading}
					data={data?.data ?? []}
				/>
			</ContainerWrapper>

			<DeleteDialog
				title="Delete Event"
				description={`Are you sure to delete this blog?`}
				handleDelete={handleMutationDelete}
			/>
		</>
	);
};

export default EventList;
