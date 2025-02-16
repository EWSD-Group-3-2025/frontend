import { KeyboardEvent, useRef } from 'react';

import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { useSearch } from '@/store/useSearch';

const SearchBox = () => {
	const { setSearch } = useSearch();

	const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

	const debouncedSearchText = (value: string) => {
		if (searchTimeout.current) {
			clearTimeout(searchTimeout.current);
		}

		searchTimeout.current = setTimeout(() => {
			setSearch(value);
		}, 500);
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			if (searchTimeout.current) {
				clearTimeout(searchTimeout.current);
			}
			setSearch((e.target as HTMLInputElement).value);
		}
	};

	return (
		<div className="relative min-w-32 max-w-60">
			<Input
				className="w-full border-form-stroke pl-7 hover:border-form-stroke-hover"
				type="search"
				placeholder="Search . . ."
				onChange={(e) => debouncedSearchText(e.target.value)}
				onKeyDown={handleKeyDown}
			/>
			<Search className="absolute left-2 top-1/2 size-4 -translate-y-1/2 transform text-gray-500" />
		</div>
	);
};

export default SearchBox;
