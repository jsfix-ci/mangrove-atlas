import { createSelector } from 'reselect';

const dashboards = state => state.dashboards;
const paramsCategory = state => state?.router?.query?.category;

export const currentDashboard = createSelector(
  [dashboards, paramsCategory],
  (_dashboards, _paramsCategory) => {

    const { current } = _dashboards;
    const selected = _paramsCategory || current || 'default';

    return selected;
  }
);

export default { currentDashboard };
