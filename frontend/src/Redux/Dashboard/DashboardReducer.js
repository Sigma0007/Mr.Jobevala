import * as ActionTypes from './DashboardActionType.js';

const initialState = {
  data: null,
};

const DashboardReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case ActionTypes.FETCH_DASHBOARD_SUCCESS:
      return { ...state, data: payload };
    default:
      return state;
  }
};

export default DashboardReducer;
