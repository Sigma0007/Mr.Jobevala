import { combineReducers } from "redux";
import AuthReducer from "./Auth/AuthReducer.js";
import UIReducer from "./UI/UIReducer.js";
import DashboardReducer from "./Dashboard/DashboardReducer.js";
import JobReducer from "./Job/JobReducer.js";

const rootReducer = combineReducers({
    auth: AuthReducer,
    ui: UIReducer,
    dashboard: DashboardReducer,
    job: JobReducer,
});

export default rootReducer;