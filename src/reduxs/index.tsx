import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import history from "utils/history";
import { connectRouter, routerMiddleware } from "connected-react-router";
import userReducer from "reduxs/user.reducer";
import { composeWithDevTools } from "redux-devtools-extension";



const reducers = (asyncReducers?: any) => {
  return combineReducers({
    user: userReducer,
    ...asyncReducers,
    router: connectRouter(history),
  });
};

const rootReducers = reducers();

let reduxStore = createStore(rootReducers, composeWithDevTools(compose(applyMiddleware(thunk), applyMiddleware(routerMiddleware(history)))));

export const store = reduxStore;

export type RootState = ReturnType<typeof rootReducers>;
