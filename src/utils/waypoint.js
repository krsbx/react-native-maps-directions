import { WAYPOINT_LIMIT } from './constant';
import { LatLng } from './types';

/**
 * @param {object} options
 * @param {boolean} options.splitWaypoints
 * @param {(string|LatLng)[]} options.initialOrigin
 * @param {(string|LatLng)[]} options.initialDestination
 * @param {(string|LatLng)[]} options.initialWaypoints
 *
 * @return {{
 *  waypoints: (string | LatLng)[];
 *  origin: string | LatLng;
 *  destination: string | LatLng;
 *  }[]
 * }
 */
export const convertWaypoint = ({
  splitWaypoints,
  initialDestination,
  initialOrigin,
  initialWaypoints,
}) => {
  // Routes array which we'll be filling.
  // We'll perform a Directions API Request for reach route
  /** @type {({waypoints: (string|LatLng)[]; origin: string|LatLng; destination: string|LatLng})[]} */
  const routes = [];

  // We need to split the waypoints in chunks, in order to not exceede the max waypoint limit
  // ~> Chunk up the waypoints, yielding multiple routes
  if (
    splitWaypoints &&
    initialWaypoints &&
    initialWaypoints.length > WAYPOINT_LIMIT
  ) {
    // Split up waypoints in chunks with chunksize WAYPOINT_LIMIT
    const chunckedWaypoints = initialWaypoints.reduce(
      (accumulator, waypoint, index) => {
        const numChunk = Math.floor(index / WAYPOINT_LIMIT);
        accumulator[numChunk] = [].concat(
          accumulator[numChunk] || [],
          waypoint
        );

        return accumulator;
      },
      []
    );

    // Create routes for each chunk, using:
    // - Endpoints of previous chunks as startpoints for the route (except for the first chunk, which uses initialOrigin)
    // - Startpoints of next chunks as endpoints for the route (except for the last chunk, which uses initialDestination)
    for (let i = 0; i < chunckedWaypoints.length; i++) {
      routes.push({
        waypoints: chunckedWaypoints[i],
        origin:
          i === 0
            ? initialOrigin
            : chunckedWaypoints[i - 1][chunckedWaypoints[i - 1].length - 1],
        destination:
          i === chunckedWaypoints.length - 1
            ? initialDestination
            : chunckedWaypoints[i + 1][0],
      });
    }
  } else {
    // No splitting of the waypoints is requested/needed.
    // ~> Use one single route
    routes.push({
      waypoints: initialWaypoints,
      origin: initialOrigin,
      destination: initialDestination,
    });
  }

  return routes;
};
