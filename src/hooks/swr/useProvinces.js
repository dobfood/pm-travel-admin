import http from 'fetcher';
import useSWR from 'swr';

export const useProvinces = () => {
  const { data, error, isLoading, mutate } = useSWR(
    '/client/provinces',
    (url) => http.get(url).then((res) => res.data)
  );

  return {
    provinces: data,
    isLoading,
    error,
    mutate,
  };
};
