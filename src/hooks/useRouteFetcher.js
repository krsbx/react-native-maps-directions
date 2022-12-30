import { useCallback } from 'react';
import { fetchRoutesData } from '../utils/fetcher';
import { RouteParams, RoutesData } from '../utils/types';

/**
 * @param {string} apiKey
 */
const useRouteFetcher = (apiKey) => {
  const getNewRoute = useCallback(
    /**
     * @param {Omit<RouteParams, 'apiKey'>} params
     *
     * @returns {Promise<RoutesData>}
     */
    (params) => {
      return fetchRoutesData({ ...params, apiKey });
    },
    [apiKey]
  );

  return getNewRoute;
};

export default useRouteFetcher;
