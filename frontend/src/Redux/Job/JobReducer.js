import * as ActionTypes from './JobActionType';

const initialState = {
    selectedJob: null,
    jobApplications: []
};

const JobReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.SET_SELECTED_JOB:
            return { ...state, selectedJob: action.payload };
        case ActionTypes.CLEAR_SELECTED_JOB:
            return { ...state, selectedJob: null };
        case ActionTypes.SET_JOB_APPLICATIONS:
            return { ...state, jobApplications: action.payload };
        case ActionTypes.CLEAR_JOB_APPLICATIONS:
            return { ...state, jobApplications: [] };
        default:
            return state;
    }
};

export default JobReducer;
