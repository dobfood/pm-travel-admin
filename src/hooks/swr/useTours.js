import http from 'fetcher';
import useSWR from 'swr';

export const useTours = () => {
  const { data, error, isLoading, mutate } = useSWR('/client/tours', (url) =>
    http.get(url).then((res) => res.data)
  );

  return {
    tours: data,
    isLoading,
    error,
    mutate,
  };
};
