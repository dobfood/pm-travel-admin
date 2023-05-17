import http from 'fetcher';
import useSWR from 'swr';

export const useStat = (id) => {
  const { data, error, isLoading, mutate } = useSWR(
    'stat/645c91c83c8dbcb4c4f8b7d7',
    (url) => http.get(url).then((res) => res.data)
  );
  return {
    stat: data,
    isLoading,
    error,
    mutate,
  };
};
