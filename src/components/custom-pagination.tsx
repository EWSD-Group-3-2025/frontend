import usePagination from '@/hooks/usePagination';
import { itemsPerPage } from '@/constants';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
	pages: number;
}

const Pagination = ({ pages }: PaginationProps) => {
	const { page = 1, limit = 10, setFilter } = usePagination();

	const handleSelect = (value: number) => {
		setFilter({ limit: value, page: 1 });
	};

	return (
		<div className="me-4 flex items-center justify-end space-x-2 py-4">
			<Button
				variant={null}
				size="sm"
				onClick={() => setFilter({ page: page - 1 })}
				disabled={page <= 1}
				className="h-8 w-8"
			>
				<ChevronLeft className="text-new-button-primary" />
			</Button>

			{Array.from({ length: pages }, (_, i) => (
				<Button
					key={i}
					variant={page === i + 1 ? 'default' : 'outline'}
					onClick={() => setFilter({ page: i + 1 })}
					className="m-0 h-8 w-8"
				>
					{i + 1}
				</Button>
			))}

			<Button
				variant={null}
				size="sm"
				onClick={() => setFilter({ page: page + 1 })}
				disabled={page >= pages}
				className="h-8 w-8"
			>
				<ChevronRight className="text-new-button-primary" />
			</Button>
			<DropdownMenu>
				<DropdownMenuTrigger asChild className="border-none">
					<button
						type="button"
						className="flex h-7 w-24 items-center justify-between px-2 focus:outline-none"
					>
						{itemsPerPage.find((item) => item.value === limit)
							?.label || 'Select'}
						<ChevronDown className="text-new-button-primary ms-2" />
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					className="z-10 w-full max-w-xs -translate-x-6 rounded-md shadow-lg"
					avoidCollisions
				>
					{itemsPerPage.map((item) => (
						<DropdownMenuItem
							key={item.value}
							onClick={() => handleSelect(item.value)}
							className="cursor-pointer p-2 hover:bg-gray-200"
						>
							{item.label}
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};

export default Pagination;
