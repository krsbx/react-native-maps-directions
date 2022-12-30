import { fetchRoute } from './routes';
import { RouteParams, RoutesData, RouteOptions } from './types';
import { convertWaypoint } from './waypoint';

/**
 * Fetch routes from the api
 * @param {RouteOptions} options
 *
 * @returns {Promise<ReturnType<typeof fetchRoute>>}
 */
export const fetchRoutes = async (options) => {
  let { destination, origin, waypoints, optimizeWaypoints } = options;

  if (typeof origin === 'object' && Object.values(origin).length === 2) {
    origin = Object.values(origin).join(',');
  }

  if (
    typeof destination === 'object' &&
    Object.values(destination).length === 2
  ) {
    destination = Object.values(destination).join(',');
  }

  waypoints = waypoints
    .map((waypoint) => {
      if (
        typeof waypoint === 'object' &&
        Object.values(waypoint).length === 2
      ) {
        return Object.values(waypoint).join(',');
      }

      return waypoint;
    })
    .join('|');

  if (optimizeWaypoints) {
    waypoints = `optimize:true|${waypoints}`;
  }

  if (options.index === 0)
    options?.onStart?.({
      origin,
      destination,
      waypoints: options.waypoints,
    });

  try {
    const result = await fetchRoute({ ...options, origin, destination });

    return result;
  } catch (err) {
    return Promise.reject(err);
  }
};

/**
 * Fetch routes and return the coordinates
 * @param {RouteParams} props
 *
 * @returns {Promise<RoutesData>}
 */
export const fetchRoutesData = async (props) => {
  const {
    origin: initialOrigin,
    destination: initialDestination,
    waypoints: initialWaypoints = [],
    splitWaypoints,
    timePrecision = 'none',
    onError,
    onReady,
    directionsServiceBaseUrl: url,
    ...rest
  } = props;

  if (!rest.apikey) {
    console.warn(`MapViewDirections Error: Missing API Key`);
    return;
  }

  if (!initialOrigin || !initialDestination) {
    return;
  }

  const timePrecisionString = timePrecision === 'none' ? '' : timePrecision;
  const routes = convertWaypoint({
    splitWaypoints,
    initialDestination,
    initialOrigin,
    initialWaypoints,
  });

  try {
    const response = await Promise.all(
      routes.map((route, index) =>
        fetchRoutes({ ...route, ...rest, url, index, timePrecisionString })
      )
    );

    // Combine all Directions API Request results into one
    const result = response.reduce(
      (acc, curr) => {
        acc.coordinates.push(...curr.coordinates);
        acc.distance += curr.distance;
        acc.duration += curr.duration;
        acc.fares.push(curr.fare);
        acc.legs = curr.legs;
        acc.waypointOrder.push(curr.waypointOrder);

        return acc;
      },
      {
        coordinates: [],
        distance: 0,
        duration: 0,
        fares: [],
        legs: [],
        waypointOrder: [],
      }
    );

    onReady?.(result);

    return result;
  } catch (err) {
    resetState();

    console.warn(`MapViewDirections Error: ${err}`);

    onError?.(err);
  }
};
