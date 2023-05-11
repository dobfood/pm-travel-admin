import useSWR from 'swr';
import http from 'fetcher';

export const useTransactions = () => {
  const { data, error, isLoading, mutate } = useSWR('/transaction', (url) =>
    http.get(url, {}).then((res) => res.data)
  );

  return {
    transactions: data,
    isLoading,
    error,
    mutate,
  };
};
