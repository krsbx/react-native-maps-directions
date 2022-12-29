import { AVOID_TYPES, PRECISION, TIME_PRECISION } from '../utils/constant';

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
 *     travel_mode: google.maps.TravelMode;
 *     maneuver: string | undefined;
 *    }];
 *    traffic_speed_entry: any[];
 *    via_waypoint: google.maps.LatLng[];
 * }} MapDirectionsLegs
 */

/**
 * @typedef {{
 * url: string,
 * origin: string | LatLng,
 * destination: string | LatLng,
 * waypoints: (string | LatLng)[],
 * language: string,
 * apikey: string,
 * mode: google.maps.TravelMode,
 * region: string,
 * precision: typeof PRECISION[keyof typeof PRECISION],
 * timePrecision: typeof TIME_PRECISION[keyof typeof TIME_PRECISION],
 * channel?: string,
 * avoid?: (typeof AVOID_TYPES[keyof typeof AVOID_TYPES])[],
 * index: number,
 * optimizeWaypoints: boolean
 * }} RouteOptions
 */

/**
 * @typedef {({
 *  latitude: number;
 *  longitude: number;
 * }) | [number, number]} LatLng
 */

/**
 * @typedef {(options: {
 *  origin: string | LatLng;
 *  destination: string | LatLng;
 *  waypoints: (string | LatLng)[];
 * }) => void} OnStartFetching
 */

export {};
