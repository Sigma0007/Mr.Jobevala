import { CATEGORIES_JOB_POSITION, COMPANY_MARQUEE_DATA, DASHBOARD_ACTIVE_TAB, FETCH_DASHBOARD_SUCCESS, SET_CATEGORIES_TYPE_DATA } from "./DashboardActionType";

const initialState = {
  data: null,
  categoriesType: [],
  categoryJobPosition: [],
  dashboardActiveTab: "overview",
  companyMarqueeData: [],
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
    case COMPANY_MARQUEE_DATA:
      return { ...state, companyMarqueeData: payload };
    default:
      return state;
  }
};

export default DashboardReducer;
