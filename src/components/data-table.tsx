import { useMemo, useState } from 'react';

import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
} from '@tanstack/react-table';
import { LoaderCircle } from 'lucide-react';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { cn } from '@/utils';
import { useSearch } from '@/store/useSearch';
import CustomPagination from '@/components/custom-pagination';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	isLoading: boolean;
	noDataText?: string;
}

const DataTable = <TData, TValue>({
	columns,
	data,
	isLoading,
	noDataText,
}: DataTableProps<TData, TValue>) => {
	const {
		search: globalFilter,
		columnFilters,
		setColumnFilters,
	} = useSearch();
	const [sorting, setSorting] = useState<SortingState>([]);

	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		state: {
			sorting,
			columnFilters,
			globalFilter,
		},
	});

	const totalPages = table.getPageCount();
	const currentPage = table.getState().pagination.pageIndex + 1;

	const pageNumbers = useMemo(() => {
		const pages: (number | string)[] = [];

		if (totalPages <= 10) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			const start = Math.max(2, currentPage - 2);
			const end = Math.min(totalPages - 1, currentPage + 2);

			pages.push(1);
			if (start > 2) pages.push('...');
			for (let i = start; i <= end; i++) {
				pages.push(i);
			}
			if (end < totalPages - 1) pages.push('...');
			pages.push(totalPages);
		}

		return pages;
	}, [totalPages, currentPage]);

	return (
		<div className="w-full">
			<div className="overflow-hidden rounded-md border">
				<Table
					wrapperClassName="h-[calc(100vh-330px)]"
					className={cn(isLoading && 'h-full')}
				>
					<TableHeader className="sticky top-0 bg-container-bg">
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef
															.header,
														header.getContext()
													)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					{isLoading ? (
						<TableBody>
							<TableRow>
								<TableCell colSpan={columns.length}>
									<LoaderCircle className="mx-auto size-10 animate-spin text-muted-foreground" />
								</TableCell>
							</TableRow>
						</TableBody>
					) : (
						<TableBody>
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => (
									<TableRow
										key={row.id}
										data-state={
											row.getIsSelected() && 'selected'
										}
									>
										{row.getVisibleCells().map((cell) => (
											<TableCell
												key={cell.id}
												className="whitespace-nowrap"
											>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)}
											</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className="h-24 text-center"
									>
										{noDataText ?? 'No results.'}
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					)}
				</Table>
			</div>

			<CustomPagination
				pageNumbers={pageNumbers}
				totalPages={table.getPageCount()}
				currentPage={table.getState().pagination.pageIndex + 1}
				pageSize={table.getState().pagination.pageSize}
				nextPage={table.nextPage}
				previousPage={table.previousPage}
				setPageIndex={table.setPageIndex}
				setPageSize={table.setPageSize}
			/>
		</div>
	);
};

export default DataTable;
