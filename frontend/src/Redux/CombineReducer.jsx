import { combineReducers } from "redux";
import AuthReducer from "./Auth/AuthReducer.js";
import UIReducer from "./UI/UIReducer.js";
import DashboardReducer from "./Dashboard/DashboardReducer.js";

const rootReducer = combineReducers({
    auth: AuthReducer,
    ui: UIReducer,
    dashboard: DashboardReducer,
});

export default rootReducer;