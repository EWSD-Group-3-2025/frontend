import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useSearch } from '@/store/useSearch';

const AccountStatusDropDown = () => {
	const { columnFilters, setColumnFilters } = useSearch();

	const selectedStatus =
		columnFilters.find((filter) => filter.id === 'status')?.value || '';

	const handleChange = (value: string) => {
		if (value === 'all') {
			setColumnFilters(
				columnFilters.filter((filter) => filter.id !== 'status')
			);
		} else {
			setColumnFilters([
				{ id: 'status', value: value === '1' ? true : false },
			]);
		}
	};

	return (
		<Select
			onValueChange={handleChange}
			defaultValue={selectedStatus.toString()}
		>
			<SelectTrigger>
				<SelectValue placeholder="Filter Status" />
			</SelectTrigger>

			<SelectContent>
				<SelectItem value="all">All</SelectItem>
				<SelectItem value="1">Available</SelectItem>
				<SelectItem value="0">Unavailable</SelectItem>
			</SelectContent>
		</Select>
	);
};

export default AccountStatusDropDown;
