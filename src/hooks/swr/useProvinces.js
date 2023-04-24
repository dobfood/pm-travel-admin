import http from 'fetcher';
import useSWR from 'swr';

export const useProvinces = () => {
  const { data, error, isLoading, mutate } = useSWR(
    '/province',
    (url) => http.get(url).then((res) => res.data),
    {
      dedupingInterval: 86400 * 1000,
    }
  );

  return {
    provinces: data,
    isLoading,
    error,
    mutate,
  };
};
