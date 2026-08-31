import { FETCH_DASHBOARD_SUCCESS, SET_CATEGORIES_TYPE_DATA } from "./DashboardActionType";

const initialState = {
  data: null,
  categoriesType: [],
};

const DashboardReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case FETCH_DASHBOARD_SUCCESS:
      return { ...state, data: payload };
    case SET_CATEGORIES_TYPE_DATA:
      console.log("payload", payload);
      return { ...state, categoriesType: payload };
    default:
      return state;
  }
};

export default DashboardReducer;
