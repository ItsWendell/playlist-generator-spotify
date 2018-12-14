import { applyMiddleware, combineReducers, createStore } from 'redux';
import { persistStore } from 'redux-persist';

import promiseMiddleware from 'redux-promise-middleware';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'; // eslint-disable-line import/no-extraneous-dependencies, max-len
import thunkMiddleware from 'redux-thunk';

import { routerMiddleware, history } from 'src/providers/router';

import * as reducers from 'src/ducks';

import { connectRouter } from 'connected-react-router';

/**
 * Create a stack of middleware that will be used for every store action.
 */
export const middleware = [
	routerMiddleware,
	thunkMiddleware,
	promiseMiddleware(),
];

export const combinedReducers = (history) => combineReducers({
	router: connectRouter(history),
	...reducers,
});

/**
 * Create a store from all of the ducks or reducers, combined with middlewares.
 */
export const store = createStore(
	combinedReducers(history),
	composeWithDevTools(applyMiddleware(...middleware))
);

/**
 * Create a data-persisting store instance from our normal store.
 */
export const persistor = persistStore(store);
