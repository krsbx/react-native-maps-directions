import {
  AVOID_TYPES,
  PRECISION,
  TIME_PRECISION,
  DIRECTION_MODE,
} from '../utils/constant';

/**
 * @typedef {typeof TIME_PRECISION[keyof typeof TIME_PRECISION]} TimePrecision
 * @typedef {typeof PRECISION[keyof typeof PRECISION]} Precision
 * @typedef {typeof AVOID_TYPES[keyof typeof AVOID_TYPES]} AvoidPlaces
 * @typedef {typeof DIRECTION_MODE[keyof DIRECTION_MODE]} TravelMode
 * @typedef {string | LatLng | [number, number]} LatLngString
 */

/**
 * @typedef {{
 *    distance: google.maps.Distance;
 *    duration: google.maps.Duration;
 *    end_address: string;
 *    end_location: Pick<google.maps.LatLng, 'lat' | 'lng'>;
 *    start_address: string;
 *    start_location: Pick<google.maps.LatLng, 'lat' | 'lng'>;
 *    steps: [{
 *     distance: google.maps.Distance;
 *     duration: google.maps.Duration;
 *     end_location: Pick<google.maps.LatLng, 'lat' | 'lng'>
 *     start_location: Pick<google.maps.LatLng, 'lat' | 'lng'>
 *     html_instructions: string;
 *     polyline: google.maps.DirectionsPolyline
 *     travel_mode: TravelMode;
 *     maneuver: string | undefined;
 *    }];
 *    traffic_speed_entry: any[];
 *    via_waypoint: google.maps.LatLng[];
 * }} MapDirectionsLegs
 */

/**
 * @typedef {{
 *  url: string,
 *  origin: LatLngString,
 *  destination: LatLngString,
 *  waypoints: (LatLngString)[],
 *  language: string,
 *  apikey: string,
 *  mode: TravelMode,
 *  region: string,
 *  precision: Precision,
 *  timePrecision: TimePrecision,
 *  channel?: string,
 *  avoid?: (AvoidPlaces)[],
 *  index: number,
 *  optimizeWaypoints: boolean
 * }} RouteOptions
 */

/**
 * @typedef {({
 *  latitude: number;
 *  longitude: number;
 * }) LatLng
 */

/**
 * @typedef {(options: {
 *  origin: LatLngString;
 *  destination: LatLngString;
 *  waypoints: (LatLngString)[];
 * }) => void} OnStartFetching
 */

/**
 * @typedef {{
 *  origin: LatLngString;
 *  waypoints?: (LatLngString)[];
 *  destination: LatLngString;
 *  apikey: string;
 *  onStart?: (args: {
 *    origin: string;
 *    destination: string;
 *    waypoints: LatLngString[];
 *  }) => void
 *  mode?: TravelMode;
 *  precision?: Precision;
 *  timePrecision?: TimePrecision;
 *  channel?: string;
 *  language?: string;
 *  resetOnChange?: boolean;
 *  optimizeWaypoints?: boolean;
 *  splitWaypoints?: string;
 *  directionsServiceBaseUrl?: string;
 *  region?: string;
 *  strokeWidth?: number;
 *  strokeColor?: string;
 *  strokeColors?: string[];
 *  lineCap?: string;
 *  lineJoin?: string;
 *  miterLimit?: number;
 *  geodesic?: boolean;
 *  lineDashPhase?: number;
 *  lineDashPattern?: number[];
 *  tappable?: boolean;
 *  avoid?: AvoidPlaces[];
 * }} MapViewDirectionsProps
 */

/**
 * @typedef {
 *  Omit<MapViewDirectionsProps,
 *   | 'resetOnChange'
 *   | 'strokeWidth'
 *   | 'strokeColor'
 *   | 'strokeColors'
 *   | 'lineCap'
 *   | 'lineJoin'
 *   | 'lineDashPhase'
 *   |'lineDashPattern'
 *   | 'tappable'>
 * } RouteParams
 */

/**
 * @typedef {{
 *   coordinates: LatLng[];
 *   distance: number;
 *   duration: number;
 *   legs: google.maps.DirectionsLeg[];
 *   fare: google.maps.TransitFare[];
 *   waypointOrder: number[];
 * }} RoutesData
 */

export {};
