import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Polyline } from 'react-native-maps';
import { fetchRoutes } from './utils/fetcher';
import {
  AVOID_TYPES,
  DIRECTION_MODE,
  PRECISION,
  TIME_PRECISION,
} from './utils/constant';
import { convertWaypoint } from './utils/waypoint';

const MapViewDirections = (props) => {
  const {
    origin,
    destination,
    waypoints,
    mode,
    precision,
    splitWaypoints,
    avoid,
    apikey,
    onReady,
    onError,
    language,
    region,
    ...rest
  } = props;

  const [coordinates, setCoordinates] = useState(null);

  /** @param {(() => void) | null} cb */
  const resetState = (cb = null) => {
    setCoordinates(null);

    cb?.();
  };

  const fetchAndRenderRoute = async (props) => {
    const {
      origin: initialOrigin,
      destination: initialDestination,
      waypoints: initialWaypoints = [],
      splitWaypoints,
      timePrecision = 'none',
      onError,
      onReady,
      ...rest
    } = props;

    if (!rest.apikey) {
      console.warn(`MapViewDirections Error: Missing API Key`); // eslint-disable-line no-console
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
          fetchRoutes({ ...route, ...rest, index, timePrecisionString })
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

      // Plot it out and call the onReady callback
      setCoordinates(result.coordinates);
      onReady?.(result);
    } catch (err) {
      resetState();

      console.warn(`MapViewDirections Error: ${err}`);

      onError?.(err);
    }
  };

  useEffect(() => {
    if (!props.resetOnChange) {
      fetchAndRenderRoute(props);
      return;
    }

    resetState(() => fetchAndRenderRoute(props));
  }, [origin, destination, waypoints, mode, precision, splitWaypoints, avoid]);

  if (!coordinates || coordinates.length) return null;

  return <Polyline coordinates={coordinates} {...rest} />;
};

MapViewDirections.propTypes = {
  origin: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
    }),
  ]),
  waypoints: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        latitude: PropTypes.number.isRequired,
        longitude: PropTypes.number.isRequired,
      }),
      PropTypes.array,
    ])
  ),
  destination: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
    }),
  ]),
  apikey: PropTypes.string.isRequired,
  onStart: PropTypes.func,
  onReady: PropTypes.func,
  onError: PropTypes.func,
  mode: PropTypes.oneOf([Object.values(DIRECTION_MODE)]),
  language: PropTypes.string,
  resetOnChange: PropTypes.bool,
  optimizeWaypoints: PropTypes.bool,
  splitWaypoints: PropTypes.bool,
  directionsServiceBaseUrl: PropTypes.string,
  region: PropTypes.string,
  precision: PropTypes.oneOf(Object.values(PRECISION)),
  timePrecision: PropTypes.oneOf(Object.values(TIME_PRECISION)),
  channel: PropTypes.string,
  avoid: PropTypes.oneOf([Object.values(AVOID_TYPES)]),
};

export default MapViewDirections;
