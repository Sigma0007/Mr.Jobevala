import { CATEGORIES_JOB_POSITION, DASHBOARD_ACTIVE_TAB, FETCH_DASHBOARD_SUCCESS, SET_CATEGORIES_TYPE_DATA } from "./DashboardActionType";


export const fetchDashboardSuccess = (data) => ({
  type: FETCH_DASHBOARD_SUCCESS,
  payload: data,
});

export const setAllCategoriesType = (data) => ({
  type: SET_CATEGORIES_TYPE_DATA,
  payload: data
})

export const setCategoriesJobPosition = (data) => ({
  type: CATEGORIES_JOB_POSITION,
  payload: data
})

export const setDashboardActiveTab = (data) => ({
  type: DASHBOARD_ACTIVE_TAB,
  payload: data
})

