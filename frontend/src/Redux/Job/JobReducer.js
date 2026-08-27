import * as ActionTypes from './JobActionType';

const initialState = {
    selectedJob: null
};

const JobReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.SET_SELECTED_JOB:
            return { ...state, selectedJob: action.payload };
        case ActionTypes.CLEAR_SELECTED_JOB:
            return { ...state, selectedJob: null };
        default:
            return state;
    }
};

export default JobReducer;
