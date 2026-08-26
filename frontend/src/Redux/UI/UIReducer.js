import * as ActionTypes from './UIActionType.js';

const getInitialTheme = () => {
  const saved = localStorage.getItem('theme');
  if (saved) return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const initialState = {
  theme: getInitialTheme(),
  sidebarOpen: false,
};

const UIReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case ActionTypes.TOGGLE_THEME:
      return { ...state, theme: payload };
    case ActionTypes.SET_SIDEBAR_OPEN:
      return { ...state, sidebarOpen: payload };
    default:
      return state;
  }
};

export default UIReducer;
