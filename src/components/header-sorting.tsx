import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { Column } from '@tanstack/react-table';

interface HeaderSortingProps<TData> {
	column: Column<TData, unknown>;
	title: string;
}

export const HeaderSorting = <TData,>({
	column,
	title,
}: HeaderSortingProps<TData>) => {
	return (
		<Button
			variant="ghost"
			className="hover:bg-transparent"
			onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
		>
			{title}
			<ArrowUpDown />
		</Button>
	);
};
