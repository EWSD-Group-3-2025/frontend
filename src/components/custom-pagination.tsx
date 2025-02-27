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
import { Ellipsis } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

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
	const [customPageSize, setCustomPageSize] = useState('');
	const [isCustom, setIsCustom] = useState(false);

	const handlePageSizeChange = (value: string) => {
		if (value === 'custom') {
			setIsCustom(true);
			setCustomPageSize('');
		} else {
			setIsCustom(false);
			setPageSize(Number(value));
		}
	};

	const handleCustomPageSize = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const value = event.target.value;
		if (/^\d*$/.test(value)) {
			setCustomPageSize(value);
			if (value !== '') {
				setPageSize(Number(value));
			}
		}
	};

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
							{page === 'prev' || page === 'next' ? (
								<span className="px-2">
									<Ellipsis className="h-4 w-4" />
								</span>
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
					onValueChange={handlePageSizeChange}
					value={isCustom ? 'custom' : String(pageSize)}
				>
					<SelectTrigger className="w-full">
						<SelectValue placeholder={pageSize} />
					</SelectTrigger>
					<SelectContent>
						{[10, 20, 50, 100].map((size) => (
							<SelectItem key={size} value={String(size)}>
								{size}
							</SelectItem>
						))}
						<SelectItem value="custom">Other</SelectItem>
					</SelectContent>
				</Select>

				{isCustom && (
					<Input
						type="number"
						value={customPageSize}
						onChange={handleCustomPageSize}
						placeholder="Custom"
						className="w-20 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
						min={1}
					/>
				)}
			</div>
		</div>
	);
};

export default CustomPagination;
