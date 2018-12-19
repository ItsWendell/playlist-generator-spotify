import { createAction } from 'redux-actions';
import { persistReducer } from 'redux-persist';
import localStorage from 'redux-persist/lib/storage';
import { PENDING, FULFILLED, REJECTED } from 'redux-promise-middleware';

import { spotifyClient } from 'src/providers/spotify';
import { store } from 'src/providers/store';

const baseName = 'user';

export const FETCH = `${baseName}/fetch`;
export const FETCH_PENDING = `${FETCH}_${PENDING}`;
export const FETCH_FULFILLED = `${FETCH}_${FULFILLED}`;
export const FETCH_REJECTED = `${FETCH}_${REJECTED}`;

export const LOGIN = `${baseName}/login`;
export const LOGIN_PENDING = `${LOGIN}_${PENDING}`;
export const LOGIN_FULFILLED = `${LOGIN}_${FULFILLED}`;
export const LOGIN_REJECTED = `${LOGIN}_${REJECTED}`;

export const LOGOUT = `${baseName}/logout`;
export const LOGOUT_PENDING = `${LOGOUT}_${PENDING}`;
export const LOGOUT_FULFILLED = `${LOGOUT}_${FULFILLED}`;
export const LOGOUT_REJECTED = `${LOGOUT}_${REJECTED}`;

export const initialState = {
	/** The authenticated user, if available. */
	user: undefined,
	/** Authentication Tokens */
	tokens: undefined,
	/** The (last known) status of the fetch user actions. */
	fetchUserStatus: undefined,
};

/**
 * Create a reducer that modifies the authentication state.
 * This reducer only keeps track if the current authenticated user.
 *
 * @param  {Object} state
 * @param  {Object} action
 * @return {Reducer}
 */
export function reducer(state = initialState, action = {}) {
	switch (action.type) {
	case FETCH_PENDING:
		return { ...state, fetchUserStatus: PENDING };

	case FETCH_REJECTED:
		return {
			...state,
			fetchUserStatus: REJECTED,
			user: undefined,
		};

	case FETCH_FULFILLED:
		if (action.payload) {
			console.log('USER', action.payload);
			return {
				...state,
				fetchUserStatus: FULFILLED,
				user: action.payload,
			};
		}
		return state;

	case LOGIN_PENDING:
		return { ...state, fetchUserStatus: PENDING };

	case LOGIN_REJECTED:
		return {
			...state,
			fetchUserStatus: REJECTED,
			user: undefined,
		};

	case LOGIN_FULFILLED:
		if (action.payload) {
			return {
				...state,
				fetchUserStatus: FULFILLED,
				tokens: action.payload,
			};
		}
		return state;

	case LOGOUT:
		return {};

	default:
		return state;
	}
}

/**
 * Create a (partially) persisting reducer instead of a simple reducer.
 * The user and session user MUST be stored and persisted when available.
 * With this data, the user can continue using the app without having to reauthenticate.
 */
export default persistReducer(
	{
		key: 'auth',
		storage: localStorage,
		whitelist: ['user', 'tokens'],
	},
	reducer
);

/**
 * Fetch the user of the current authentication session.
 * This should be performed everytime the app is started within SpeakAp.
 *
 * @return {Promise}
 */
export const fetchUser = createAction(FETCH, () => spotifyClient.getMe());

export const loginFromBrowserUrl = createAction(LOGIN, async () => {
	const authTokens = window.location.hash &&
			new URLSearchParams(window.location.hash.substr(1));

	if (authTokens && authTokens.get('access_token')) {
		spotifyClient.setAccessToken(authTokens.get('access_token'));

		const tokens = {};
		for (var key of authTokens.keys()) {
			tokens[key] = authTokens.get(key);
		}

		window.history.replaceState(null, null, ' ');
		return tokens;
	}

	throw new Error('No tokens found...');
});

export const logout = createAction(LOGOUT, () => store.purge());
