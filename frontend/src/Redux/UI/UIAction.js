import * as ActionTypes from './UIActionType.js';

export const toggleTheme = () => (dispatch, getState) => {
  const { ui } = getState();
  const newTheme = ui.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', newTheme);
  dispatch({
    type: ActionTypes.TOGGLE_THEME,
    payload: newTheme
  });
};

export const setSidebarOpen = (isOpen) => ({
  type: ActionTypes.SET_SIDEBAR_OPEN,
  payload: isOpen
});
