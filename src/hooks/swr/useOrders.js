import http from 'fetcher';
import useSWR from 'swr';

export const useOrders = () => {
  const { data, error, isLoading, mutate } = useSWR('/order', (url) =>
    http.get(url).then((res) => res.data)
  );
  return {
    orders: data,
    isLoading,
    error,
    mutate,
  };
};
