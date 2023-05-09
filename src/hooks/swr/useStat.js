import http from 'fetcher';
import useSWR from 'swr';

export const useStat = (id) => {
  const { data, error, isLoading, mutate } = useSWR('stat', (url) =>
    http.get(url).then((res) => res.data)
  );
  return {
    stat: data,
    isLoading,
    error,
    mutate,
  };
};
