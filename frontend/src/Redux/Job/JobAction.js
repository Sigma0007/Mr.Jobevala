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
