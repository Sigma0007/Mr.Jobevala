import * as ActionTypes from './JobActionType';

export const setSelectedJob = (job) => {
    return {
        type: ActionTypes.SET_SELECTED_JOB,
        payload: job
    };
};

export const clearSelectedJob = () => {
    return {
        type: ActionTypes.CLEAR_SELECTED_JOB
    };
};

export const setJobApplications = (applications) => {
    return {
        type: ActionTypes.SET_JOB_APPLICATIONS,
        payload: applications
    };
};

export const clearJobApplications = () => {
    return {
        type: ActionTypes.CLEAR_JOB_APPLICATIONS
    };
};
