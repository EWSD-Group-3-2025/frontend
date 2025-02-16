import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';

type CustomPaginationProps = {
	currentPage: number;
	previousPage: () => void;
	pageNumbers: (number | string)[];
	setPageIndex: (index: number) => void;
	nextPage: () => void;
	totalPages: number;
	pageSize: number;
	setPageSize: (size: number) => void;
};

const CustomPagination = ({
	currentPage,
	previousPage,
	pageNumbers,
	setPageIndex,
	nextPage,
	totalPages,
	pageSize,
	setPageSize,
}: CustomPaginationProps) => {
	return (
		<div className="mt-3 flex flex-wrap justify-end">
			<Pagination className="m-0 w-fit justify-end">
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious
							href="#"
							onClick={() => previousPage()}
							className={
								currentPage === 1
									? 'pointer-events-none opacity-50'
									: ''
							}
						/>
					</PaginationItem>

					{pageNumbers.map((page, index) => (
						<PaginationItem key={index}>
							{page === '...' ? (
								<span className="px-2">...</span>
							) : (
								<PaginationLink
									href="#"
									isActive={page === currentPage}
									onClick={() =>
										setPageIndex((page as number) - 1)
									}
								>
									{page}
								</PaginationLink>
							)}
						</PaginationItem>
					))}

					<PaginationItem>
						<PaginationNext
							href="#"
							onClick={() => nextPage()}
							className={
								currentPage === totalPages
									? 'pointer-events-none opacity-50'
									: ''
							}
						/>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
			<div className="ms-3 flex items-center space-x-2">
				<Select
					onValueChange={(value) => setPageSize(Number(value))}
					value={String(pageSize)}
				>
					<SelectTrigger className="w-16">
						<SelectValue placeholder={pageSize} />
					</SelectTrigger>
					<SelectContent>
						{[1, 5, 10, 20, 50, 100].map((size) => (
							<SelectItem key={size} value={String(size)}>
								{size}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		</div>
	);
};

export default CustomPagination;
