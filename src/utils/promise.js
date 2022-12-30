import { decode } from './decoder';
import { RouteOptions } from './types';

/**
 * Resolve fetched routes
 * @param {google.maps.DirectionsRoute & {
 *   precision: RouteOptions['precision']
 *  }} route
 *
 * @returns {{
 *  distance: number;
 *  duration: number;
 *  coordinates: ({
 *   latitude: number;
 *   longitude: number;
 *  })[]}}
 */

export const resolveRoutes = (route) => ({
  distance:
    route.legs.reduce((carry, curr) => carry + curr.distance.value, 0) / 1000,
  duration:
    route.legs.reduce(
      (carry, curr) =>
        carry +
        (curr.duration_in_traffic
          ? curr.duration_in_traffic.value
          : curr.duration.value),
      0
    ) / 60,
  coordinates:
    route.precision === 'low'
      ? decode([{ polyline: route.overview_polyline }])
      : route.legs.reduce(
          (carry, curr) => [...carry, ...decode(curr.steps)],
          []
        ),
  fare: route.fare,
  waypointOrder: route.waypoint_order,
  legs: route.legs,
});
