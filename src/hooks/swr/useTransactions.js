import http from 'fetcher';
import useSWR from 'swr';

export const useTransactions = () => {
  const { data, error, isLoading, mutate } = useSWR(
    '/client/transactions',
    (url) => http.get(url).then((res) => res.data)
  );

  return {
    transactions: data,
    isLoading,
    error,
    mutate,
  };
};
