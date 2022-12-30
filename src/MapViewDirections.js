import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Polyline } from 'react-native-maps';
import isEqual from 'lodash.isequal';
import { fetchRoutes } from './utils/fetcher';
import {
  AVOID_TYPES,
  DIRECTION_MODE,
  PRECISION,
  TIME_PRECISION,
} from './utils/constant';
import { convertWaypoint } from './utils/waypoint';

class MapViewDirections extends Component {
  constructor(props) {
    super(props);

    this.state = {
      coordinates: null,
    };
  }

  componentDidMount() {
    this.fetchAndRenderRoute(this.props);
  }

  componentDidUpdate(prevProps) {
    if (
      isEqual(prevProps.origin, this.props.origin) &&
      isEqual(prevProps.destination, this.props.destination) &&
      isEqual(prevProps.waypoints, this.props.waypoints) &&
      isEqual(prevProps.mode, this.props.mode) &&
      isEqual(prevProps.precision, this.props.precision) &&
      isEqual(prevProps.splitWaypoints, this.props.splitWaypoints) &&
      isEqual(prevProps.avoid, this.props.avoid) &&
      isEqual(prevProps.optimizeWaypoints, this.props.optimizeWaypoints)
    )
      return;

    if (!this.props.resetOnChange) {
      this.fetchAndRenderRoute(this.props);
      return;
    }

    this.resetState(() => {
      this.fetchAndRenderRoute(this.props);
    });
  }

  /** @param {(() => void) | null} cb */
  resetState = (cb = null) => {
    this.setState(
      {
        coordinates: null,
      },
      cb
    );
  };

  fetchAndRenderRoute = async (props) => {
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
      this.setState({
        coordinates: result.coordinates,
      });
      this.props.onReady?.(result);
    } catch (err) {
      this.resetState();

      console.warn(`MapViewDirections Error: ${err}`);

      onError?.(err);
    }
  };

  render() {
    if (!this.state.coordinates || !this.state.coordinates.length) return null;

    const {
      origin, // eslint-disable-line no-unused-vars
      waypoints, // eslint-disable-line no-unused-vars
      splitWaypoints, // eslint-disable-line no-unused-vars
      destination, // eslint-disable-line no-unused-vars
      apikey, // eslint-disable-line no-unused-vars
      onReady, // eslint-disable-line no-unused-vars
      onError, // eslint-disable-line no-unused-vars
      mode, // eslint-disable-line no-unused-vars
      language, // eslint-disable-line no-unused-vars
      region, // eslint-disable-line no-unused-vars
      precision, // eslint-disable-line no-unused-vars
      avoid,
      ...props
    } = this.props;

    return <Polyline coordinates={this.state.coordinates} {...props} />;
  }
}

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
  mode: PropTypes.arrayOf(PropTypes.oneOf(Object.values(DIRECTION_MODE))),
  language: PropTypes.string,
  resetOnChange: PropTypes.bool,
  optimizeWaypoints: PropTypes.bool,
  splitWaypoints: PropTypes.bool,
  directionsServiceBaseUrl: PropTypes.string,
  region: PropTypes.string,
  precision: PropTypes.oneOf(Object.values(PRECISION)),
  timePrecision: PropTypes.oneOf(Object.values(TIME_PRECISION)),
  channel: PropTypes.string,
  avoid: PropTypes.arrayOf(PropTypes.oneOf(Object.values(AVOID_TYPES))),
};

export default MapViewDirections;
