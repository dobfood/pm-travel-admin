import http from 'fetcher';
import useSWR from 'swr';

export const useTour = (id) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/client/tours/${id}`,
    (url) => http.get(url).then((res) => res.data)
  );

  return {
    tour: data,
    isLoading,
    error,
    mutate,
  };
};
