import { CATEGORIES_JOB_POSITION, DASHBOARD_ACTIVE_TAB, FETCH_DASHBOARD_SUCCESS, SET_CATEGORIES_TYPE_DATA } from "./DashboardActionType";

const initialState = {
  data: null,
  categoriesType: [],
  categoryJobPosition: [],
  dashboardActiveTab: "overview",
};

const DashboardReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case FETCH_DASHBOARD_SUCCESS:
      return { ...state, data: payload };
    case SET_CATEGORIES_TYPE_DATA:
      return { ...state, categoriesType: payload };
    case CATEGORIES_JOB_POSITION:
      return { ...state, categoryJobPosition: payload };
    case DASHBOARD_ACTIVE_TAB:
      return { ...state, dashboardActiveTab: payload };
    default:
      return state;
  }
};

export default DashboardReducer;
