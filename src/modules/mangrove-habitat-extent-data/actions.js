import { createAction } from 'vizzuality-redux-tools';

export const fetchRequested = createAction('MANGROVE_HABITAT_EXTENT_DATA/FETCH_REQUESTED');
export const fetchSucceeded = createAction('MANGROVE_HABITAT_EXTENT_DATA/FETCH_SUCCEDED');
export const fetchFailed = createAction('MANGROVE_HABITAT_EXTENT_DATA/FETCH_FAILED');
export const fetchMangroveHabitatExtentData = createAction('MANGROVE_HABITAT_EXTENT_DATA/FETCH_ALL');
