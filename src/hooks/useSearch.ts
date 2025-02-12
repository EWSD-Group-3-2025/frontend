import { useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';

type Search = {
	search?: string;
};

const useSearch = () => {
	const [searchParams, setSearchParams] = useSearchParams();

	const search = searchParams.get('search')
		? (searchParams.get('search') as string)
		: undefined;

	const setFilter = useCallback(
		(filters: Search) => {
			setSearchParams((params) => {
				if (filters.search) {
					params.set('search', filters.search);
				} else {
					params.delete('search');
				}

				return params;
			});
		},
		[setSearchParams]
	);

	return { search, setFilter };
};

export default useSearch;
