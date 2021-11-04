import { createStore, combineReducers, compose } from "redux";
import { CollapsedReducer } from "./reducers/CollapsedReducer";
import { LoadingReducer } from "./reducers/LoadingReducer";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "starbug",
  storage,
  blacklist: ["LoadingReducer"], //黑名单,是这个reducer就不要持久化,对应的还有白名单
};

const reducer = combineReducers({
  CollapsedReducer,
  LoadingReducer,
});

const persistedReducer = persistReducer(persistConfig, reducer);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(persistedReducer, composeEnhancers());
const persistor = persistStore(store);

export { store, persistor };
