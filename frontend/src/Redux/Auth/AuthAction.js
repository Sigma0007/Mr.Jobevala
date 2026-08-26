import { LOGIN_SUCCESS, REGISTER_SUCCESS, FETCH_ME_SUCCESS, LOGOUT_SUCCESS, UPDATE_USER_LOCAL } from './AuthActionType.js';

const persistTokens = (token) => {
  localStorage.setItem('token', token);
};

export const registerUser = (data) => (dispatch) => {
  persistTokens(data.token);
  dispatch({ type: REGISTER_SUCCESS, payload: data });
};

export const loginUser = (data) => (dispatch) => {
  persistTokens(data.token);
  dispatch({
    type: LOGIN_SUCCESS,
    payload: data
  });
};

export const fetchMeSuccess = (user) => ({
  type: FETCH_ME_SUCCESS,
  payload: user,
});

export const logoutUser = () => (dispatch) => {
  localStorage.clear();
  dispatch({ type: LOGOUT_SUCCESS });
};

export const updateUserLocal = (payload) => ({
  type: UPDATE_USER_LOCAL,
  payload,
});
