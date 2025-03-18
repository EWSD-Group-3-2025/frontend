import ContainerWrapper from '@/components/container-wrapper';
import DataTable from '@/components/data-table';
import DeleteDialog from '@/components/delete-dialog';
import ExportButton from '@/components/export-button';
import { HeaderSorting } from '@/components/header-sorting';
import ResponsiveTitle from '@/components/responsive/responsive-title';
import SearchBox from '@/components/search-box';
import { deleteItem, getAll } from '@/features/documents/api';
import { useDeleteModalStore } from '@/hooks/useDeleteModalStore';
import { Document } from '@/features/documents/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { toast } from 'sonner';
import dayjs from 'dayjs';
import { Button } from '@/components/ui/button';
import { Download, Trash2 } from 'lucide-react';
import { downloadFile } from '@/utils/client-side-file-download';

const DocumentList = () => {
	const queryClient = useQueryClient();
	const { selectedId, setOpen, setSelectedId } = useDeleteModalStore();

	const { data, isLoading } = useQuery<HTTPResponse<Document[]>>({
		queryKey: ['get-all-documents'],
		queryFn: async (): Promise<HTTPResponse<Document[]>> =>
			await getAll().then((response) => {
				if (response.data.code === 200) {
					return response.data;
				}

				throw new Error('Fetch all documents fail!');
			}),
	});

	const { mutateAsync } = useMutation({
		mutationFn: async (id: number) =>
			await deleteItem(id)
				.then((response) => {
					if (response.status === 204) {
						queryClient.invalidateQueries({
							queryKey: ['get-all-documents'],
						});
						toast.success('Document Delete Successfully');
						setOpen(false);
						setSelectedId(null);

						return response.data;
					}

					throw new Error('Document Delete Fail!');
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

	const documentListColumns: ColumnDef<Document>[] = [
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
			id: 'userName',
			header: ({ column }) => (
				<HeaderSorting column={column} title="Uploader Name" />
			),
			accessorKey: 'userName',
		},

		{
			id: 'created_at',
			header: ({ column }) => (
				<HeaderSorting column={column} title="Created At" />
			),
			accessorKey: 'created_at',
			cell: (params) =>
				dayjs(params.row.original.createdAt).format('YYYY-MM-DD'),
		},
		{
			id: 'action',
			header: 'Action',
			accessorKey: 'action',
			cell: (params) => (
				<>
					<Button
						size="sm"
						className="me-2 text-white"
						onClick={() => {
							downloadFile(
								params.row.original.fileUrl,
								params.row.original.storedName
							);
						}}
					>
						<Download />
					</Button>
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
				<ResponsiveTitle title="Document List" />
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
							fileName="document_list"
						/>
					)}
				</div>
				<DataTable
					columns={documentListColumns}
					isLoading={isLoading}
					data={data?.data ?? []}
				/>
			</ContainerWrapper>
			<DeleteDialog
				title="Delete Document"
				description={`Are you sure to delete this Document?`}
				handleDelete={handleMutationDelete}
			/>
		</>
	);
};

export default DocumentList;
