import { FETCH_ME_SUCCESS, LOGIN_SUCCESS, LOGOUT_SUCCESS, REGISTER_SUCCESS, UPDATE_USER_LOCAL } from "./AuthActionType";

const initialState = {
  user: null,
  token: null,
};

const AuthReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      return { ...state, user: payload.user, token: payload.token };

    case FETCH_ME_SUCCESS:
      return { ...state, user: payload };

    case LOGOUT_SUCCESS:
      return { ...state, user: null, token: null };

    case UPDATE_USER_LOCAL:
      return { ...state, user: { ...state.user, ...payload } };
    default:
      return state;
  }
};

export default AuthReducer;
