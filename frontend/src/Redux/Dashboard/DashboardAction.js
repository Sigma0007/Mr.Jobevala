import * as ActionTypes from './DashboardActionType.js';

export const fetchDashboardSuccess = (data) => ({
  type: ActionTypes.FETCH_DASHBOARD_SUCCESS,
  payload: data,
});
