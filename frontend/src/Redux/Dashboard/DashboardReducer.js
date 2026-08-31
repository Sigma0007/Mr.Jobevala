import { CATEGORIES_JOB_POSITION, FETCH_DASHBOARD_SUCCESS, SET_CATEGORIES_TYPE_DATA } from "./DashboardActionType";

const initialState = {
  data: null,
  categoriesType: [],
  categoryJobPosition: [],
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
    default:
      return state;
  }
};

export default DashboardReducer;
