import { resolveRoutes } from './promise';
import { convertUrl } from './url';
import { RouteOptions } from './types';
import { DIRECTION_MODE, PRECISION } from './constant';

/**
 * Fetch the GMaps Routes from the given options
 * @param {RouteOptions} options
 * @returns {Promise<ReturnType<typeof resolveRoutes>>}
 */
export const fetchRoute = async ({
  mode = DIRECTION_MODE.DRIVING,
  precision = PRECISION.LOW,
  language = 'en',
  ...options
}) => {
  const url = convertUrl(options);

  try {
    const json = await (await fetch(url)).json();

    if (json.status !== 'OK') {
      const errorMessage = json.error_message || json.status || 'Unknown error';

      return Promise.reject(errorMessage);
    }

    if (!json.routes.length) {
      return Promise.reject();
    }

    const route = json.routes[0];

    return Promise.resolve(resolveRoutes({ ...(route || {}) }, precision));
  } catch (err) {
    return Promise.reject(`Error on GMAPS route request: ${err}`);
  }
};
