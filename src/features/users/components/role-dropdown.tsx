import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { USER_ROLES } from '@/constants';
import { useSearch } from '@/store/useSearch';
import { objectToArray } from '@/utils';

const RoleDropDown = () => {
	const { columnFilters, setColumnFilters } = useSearch();
	const roles = objectToArray(USER_ROLES);

	const selectedRole =
		columnFilters.find((filter) => filter.id === 'role')?.value || '';

	const handleRoleChange = (value: string) => {
		if (value === 'all') {
			setColumnFilters(
				columnFilters.filter((filter) => filter.id !== 'role')
			);
		} else {
			setColumnFilters([{ id: 'role', value }]);
		}
	};

	return (
		<Select
			onValueChange={handleRoleChange}
			defaultValue={selectedRole.toString()}
		>
			<SelectTrigger>
				<SelectValue placeholder="Filter Role" />
			</SelectTrigger>

			<SelectContent>
				<SelectItem value="all">All</SelectItem>
				{roles.map((role) => (
					<SelectItem key={role.value} value={role.key}>
						{role.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

export default RoleDropDown;
