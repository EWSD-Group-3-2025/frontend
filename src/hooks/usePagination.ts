import { useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';

type DataTableSorting = {
	page?: number;
	limit?: number;
};

const usePagination = () => {
	const [searchParams, setSearchParams] = useSearchParams();

	const page = searchParams.get('page')
		? parseInt(searchParams.get('page') as string)
		: undefined;

	const limit = searchParams.get('limit')
		? parseInt(searchParams.get('limit') as string)
		: undefined;

	const setFilter = useCallback(
		(filters: DataTableSorting) => {
			setSearchParams((params) => {
				if (filters.page !== undefined) {
					params.set('page', filters.page.toString());
				}

				if (filters.limit) {
					params.set('limit', filters.limit.toString());
				}

				return params;
			});
		},
		[setSearchParams]
	);

	return { page, limit, setFilter };
};

export default usePagination;
