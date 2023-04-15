import http from 'fetcher';
import useSWR from 'swr';

export const useAdmins = () => {
  const { data, error, isLoading, mutate } = useSWR('/management/admins', (url) =>
    http.get(url).then((res) => res.data)
  );

  return {
    admins: data,
    isLoading,
    error,
    mutate,
  };
};
