import { useQuery } from '@tanstack/react-query';

const useFetch = (key, fetchFunction, options = {}) => {
	const { data, error, isLoading, isError } = useQuery({
		queryKey: key,
		queryFn: fetchFunction,
		...options,
	});

	return { data, error, isLoading, isError };
};

export default useFetch;
