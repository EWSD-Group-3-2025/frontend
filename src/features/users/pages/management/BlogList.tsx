import ContainerWrapper from '@/components/container-wrapper';
import DataTable from '@/components/data-table';
import DeleteDialog from '@/components/delete-dialog';
import ExportButton from '@/components/export-button';
import { HeaderSorting } from '@/components/header-sorting';
import ResponsiveModal from '@/components/responsive/responsive-modal';
import ResponsiveTitle from '@/components/responsive/responsive-title';
import SearchBox from '@/components/search-box';
import { Button } from '@/components/ui/button';
import { deleteBlog, getBlogsForCurrentUser } from '@/features/blogs/api';
import BlogItemCard from '@/features/blogs/components/blog-item-card';
import { Blog } from '@/features/blogs/types';
import { useDeleteModalStore } from '@/hooks/useDeleteModalStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { Eye, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const BlogList = () => {
	const queryClient = useQueryClient();
	const { selectedId, setOpen, setSelectedId } = useDeleteModalStore();
	const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

	const { data, isLoading } = useQuery<HTTPResponse<Blog[]>>({
		queryKey: ['get-all-blogs-for-current-user'],
		queryFn: async (): Promise<HTTPResponse<Blog[]>> =>
			await getBlogsForCurrentUser().then((response) => {
				if (response.data.code === 200) {
					if (selectedBlog) {
						const updateSelectedBlog = response.data.data.find(
							(blog) => blog.id === selectedBlog.id
						);
						if (updateSelectedBlog) {
							setSelectedBlog(updateSelectedBlog);
						}
					}
					return response.data;
				}

				throw new Error('Fetch Blog Listing Fail!');
			}),
	});

	const { mutateAsync } = useMutation({
		mutationFn: async (id: number) =>
			await deleteBlog(id)
				.then((response) => {
					if (response.status === 200) {
						queryClient.invalidateQueries({
							queryKey: ['get-all-blogs'],
						});
						toast.success('Delete Blog Successfully');
						setOpen(false);
						setSelectedId(null);

						return response.data;
					}

					throw new Error('Blog Delete Fail!');
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

	const blogListColumns: ColumnDef<Blog>[] = [
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
			id: 'authorName',
			header: ({ column }) => (
				<HeaderSorting column={column} title="Author Name" />
			),
			accessorKey: 'authorName',
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
						variant="ghost"
						onClick={() => {
							setSelectedBlog(params.row.original);
						}}
					>
						<Eye />
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
				<ResponsiveTitle title="Blog List" />
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
							fileName="blog_list"
						/>
					)}
				</div>
				<DataTable
					columns={blogListColumns}
					isLoading={isLoading}
					data={data?.data ?? []}
				/>
			</ContainerWrapper>

			<DeleteDialog
				title="Delete Blog"
				description={`Are you sure to delete this blog?`}
				handleDelete={handleMutationDelete}
			/>

			{selectedBlog && (
				<ResponsiveModal
					className="max-h-[55vh] min-h-[75vh] overflow-auto"
					isOpen={Boolean(selectedBlog)}
					setIsOpen={() => {
						setSelectedBlog(null);
					}}
				>
					<div className="w-full p-3">
						<BlogItemCard blog={selectedBlog} />
					</div>
				</ResponsiveModal>
			)}
		</>
	);
};

export default BlogList;
