import useSWR from 'swr';
import http from 'fetcher';

export const useUsers = (role) => {
  const { data, error, isLoading, mutate } = useSWR(
    '/user/find-by-role',
    (url) =>
      http
        .get(url, {
          params: {
            role,
          },
        })
        .then((res) => res.data)
  );

  return {
    users: data,
    isLoading,
    error,
    mutate,
  };
};
