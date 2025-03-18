import SearchBox from '@/components/search-box';
import DataTable from '@/components/data-table';
import DeleteDialog from '@/components/delete-dialog';
import ExportButton from '@/components/export-button';
import ContainerWrapper from '@/components/container-wrapper';
import ResponsiveTitle from '@/components/responsive/responsive-title';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDeleteModalStore } from '@/hooks/useDeleteModalStore';
import { Meeting } from '@/features/meetings/types';
import { deleteItem, getAll } from '@/features/meetings/api';
import { toast } from 'sonner';
import { ColumnDef } from '@tanstack/react-table';
import { HeaderSorting } from '@/components/header-sorting';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { getMeetingType } from '@/utils';
import { Badge } from '@/components/ui/badge';

const MeetingList = () => {
	const queryClient = useQueryClient();
	const { selectedId, setOpen, setSelectedId } = useDeleteModalStore();

	const { data, isLoading } = useQuery<HTTPResponse<Meeting[]>>({
		queryKey: ['get-all-meetings'],
		queryFn: async (): Promise<HTTPResponse<Meeting[]>> =>
			await getAll().then((response) => {
				if (response.data.code === 200) {
					return response.data;
				}

				throw new Error('Fetch Staff Listing Fail!');
			}),
	});

	const { mutateAsync } = useMutation({
		mutationFn: async (id: number) =>
			await deleteItem(id)
				.then((response) => {
					if (response.status === 204) {
						queryClient.invalidateQueries({
							queryKey: ['get-all-meetings'],
						});
						toast.success('Delete Meeting Successfully');
						setOpen(false);
						setSelectedId(null);

						return response.data;
					}

					throw new Error('Meeting Delete Fail!');
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

	const eventListColumns: ColumnDef<Meeting>[] = [
		{
			id: 'no',
			header: 'No.',
			cell: (params) => params.row.index + 1,
		},
		{
			id: 'description',
			header: ({ column }) => (
				<HeaderSorting column={column} title="Description" />
			),
			accessorKey: 'description',
		},
		{
			id: 'meetingType',
			header: ({ column }) => (
				<HeaderSorting column={column} title="Meeting Type" />
			),
			accessorKey: 'meetingType',
			cell: (param) => (
				<Badge>{getMeetingType(param.row.original.meetingType)}</Badge>
			),
		},
		{
			id: 'location',
			header: ({ column }) => (
				<HeaderSorting column={column} title="Location" />
			),
			accessorKey: 'location',
		},
		{
			id: 'link',
			header: ({ column }) => (
				<HeaderSorting column={column} title="Meeting Link" />
			),
			accessorKey: 'link',
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

	return (
		<>
			<div className="mb-3 flex justify-between">
				<ResponsiveTitle title="Meeting List" />
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
							fileName="meeting_list"
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

export default MeetingList;
