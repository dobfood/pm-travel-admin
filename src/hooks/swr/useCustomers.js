import http from 'fetcher';
import useSWR from 'swr';

export const useCustomers = () => {
  const { data, error, isLoading, mutate } = useSWR('/client/customers', (url) =>
    http.get(url).then((res) => res.data)
  );

  return {
    customers: data,
    isLoading,
    error,
    mutate,
  };
};
