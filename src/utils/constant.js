export const WAYPOINT_LIMIT = 10;

export const BASE_URL = 'https://maps.googleapis.com/maps/api/directions/json';

export const AVOID_TYPES = Object.freeze({
  TOLLS: 'TOLLS',
  HIGHWAYS: 'HIGHWAYS',
  FERRIES: 'FERRIES',
});

export const DIRECTION_MODE = Object.freeze({
  DRIVING: 'DRIVING',
  BICYCLING: 'BICYCLING',
  TRANSIT: 'TRANSIT',
  WALKING: 'WALKING',
});

export const TIME_PRECISION = Object.freeze({
  NOW: 'now',
  NONE: 'none',
});

export const PRECISION = Object.freeze({
  HIGH: 'high',
  LOW: 'low',
});
