import http from 'fetcher';
import useSWR from 'swr';

export const useDashboards = () => {
  const { data, error, isLoading, mutate } = useSWR('user/dashboard', (url) =>
    http.get(url).then((res) => res.data)
  );
  return {
    dashboard: data,
    isLoading,
    error,
    mutate,
  };
};
