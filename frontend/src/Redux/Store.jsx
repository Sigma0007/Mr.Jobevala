import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./CombineReducer";

const Store = configureStore({
    reducer: rootReducer,

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            immutableCheck: false,
            serializableCheck: false,
        }),
});

export default Store;