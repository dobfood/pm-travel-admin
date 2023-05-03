import http from 'fetcher';
import useSWR from 'swr';

export const useCategorys = () => {
  const { data, error, isLoading, mutate } = useSWR(
    '/category',
    (url) => http.get(url).then((res) => res.data),
    {
      dedupingInterval: 86400 * 1000,
    }
  );
  return {
    categorys: data,
    isLoading,
    error,
    mutate,
  };
};
