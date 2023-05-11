import http from 'fetcher';
import useSWR from 'swr';

export const useContact = () => {
  const { data, error, isLoading, mutate } = useSWR('/contact', (url) =>
    http.get(url).then((res) => res.data)
  );
  return {
    contact: data,
    isLoading,
    error,
    mutate,
  };
};
