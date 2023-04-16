import http from 'fetcher';
import useSWR from 'swr';

export const useTour = (id) => {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/client/tours/${id}` : null,
    (url) => http.get(url).then((res) => res.data)
  );

  return {
    tour: data,
    isLoading,
    error,
    mutate,
  };
};
