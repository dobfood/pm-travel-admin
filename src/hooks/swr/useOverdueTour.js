import http from 'fetcher';
import useSWR from 'swr';

export const useOverdueTour = () => {
  const { data, error, isLoading, mutate } = useSWR('tour/overdue', (url) =>
    http.get(url).then((res) => res.data)
  );

  return {
    overdue: data,
    isLoading,
    error,
    mutate,
  };
};
