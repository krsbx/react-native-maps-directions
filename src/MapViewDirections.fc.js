import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Polyline } from 'react-native-maps';
import isEqual from 'lodash.isequal';
import { fetchRoutesData } from './utils/fetcher';
import {
  AVOID_TYPES,
  DIRECTION_MODE,
  PRECISION,
  TIME_PRECISION,
} from './utils/constant';
import usePreviousValue from './hooks/usePreviousValue';
import { MapViewDirectionsProps, LatLng } from './utils/types';

/**
 * @param {MapViewDirectionsProps} props
 *
 * @returns {JSX.Element}
 */
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
    optimizeWaypoints,
    ...rest
  } = props;

  /** @type {MapViewDirectionsProps}  */
  const prevProps = usePreviousValue(props ?? {});

  /** @type {[ LatLng[] | null, React.Dispatch<React.SetStateAction<LatLng[] | null>>]} */
  const [coordinates, setCoordinates] = useState(null);

  /** @param {(() => void) | null} cb */
  const resetState = (cb = null) => {
    setCoordinates(null);

    cb?.();
  };

  useEffect(() => {
    if (
      isEqual(prevProps?.origin, origin) &&
      isEqual(prevProps?.destination, destination) &&
      isEqual(prevProps?.waypoints, waypoints) &&
      isEqual(prevProps?.mode, mode) &&
      isEqual(prevProps?.precision, precision) &&
      isEqual(prevProps?.splitWaypoints, splitWaypoints) &&
      isEqual(prevProps?.avoid, avoid) &&
      isEqual(prevProps?.optimizeWaypoints, optimizeWaypoints)
    )
      return;

    if (!props.resetOnChange) {
      fetchRoutesData(props).then(({ coordinates }) =>
        setCoordinates(coordinates)
      );
      return;
    }

    resetState(() =>
      fetchRoutesData(props).then(({ coordinates }) =>
        setCoordinates(coordinates)
      )
    );
  }, [
    origin,
    destination,
    waypoints,
    mode,
    precision,
    splitWaypoints,
    avoid,
    optimizeWaypoints,
  ]);

  if (!coordinates || !coordinates.length) return null;

  return <Polyline coordinates={coordinates} {...rest} />;
};

MapViewDirections.propTypes = {
  origin: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
    }),
    PropTypes.array,
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
    PropTypes.array,
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
