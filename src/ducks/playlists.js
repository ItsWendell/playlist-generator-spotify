import { createAction } from 'redux-actions';
import { persistReducer } from 'redux-persist';
import localStorage from 'redux-persist/lib/storage';
import { PENDING, FULFILLED, REJECTED } from 'redux-promise-middleware';

import { spotifyClient } from 'src/providers/spotify';

const baseName = 'playlists';

export const FETCH = `${baseName}/fetch`;
export const FETCH_PENDING = `${FETCH}_${PENDING}`;
export const FETCH_FULFILLED = `${FETCH}_${FULFILLED}`;
export const FETCH_REJECTED = `${FETCH}_${REJECTED}`;

export const initialState = {
	/** The authenticated user, if available. */
	data: undefined,
	/** The (last known) status of the fetch user actions. */
	fetchStatus: undefined,
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
			fetchStatus: REJECTED,
			user: undefined,
		};

	case FETCH_FULFILLED:
		console.log('Action Payload Top Tracks', action.payload);
		if (action.payload) {
			return {
				...state,
				fetchPlaylistsStatus: FULFILLED,
				playlists: action.payload,
			};
		}
		return state;
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
		key: 'playlists',
		storage: localStorage,
		whitelist: ['playlists'],
	},
	reducer
);

export const topTracksTimeRanges = {
	'long_term': 'Lifetime',
	'medium_term': 'Half year',
	'short_term': 'Recent',
};

/**
 * Fetch the user of the current authentication session.
 * This should be performed everytime the app is started within SpeakAp.
 *
 * @return {Promise}
 */
export const fetchMyTopTracks = createAction(FETCH, async () => {
	const promises = Object.keys(topTracksTimeRanges).map(async (time_range) => {
		const topTracks = await spotifyClient.getAllMyTopTracks({
			time_range,
		});

		// NOTE: Convert the top track types to playlists format
		return {
			items: topTracks.map((item) => ({
				track: item,
			})),
			name: topTracksTimeRanges[time_range],
			time_range: time_range,
		}
	});

	return Promise.all(promises);
});

/**
 * Select all playlists from the state.
 *
 * @param  {Object} state
 * @return {Object[]}
 */
export const selectPlaylists = state => state.playlists && state.playlists.playlists;

/**
 * Select bool for if the playlists are loading.
 *
 * @param  {Object} state
 * @return {Object[]}
 */
export const selectPlaylistsLoading = state =>
	state.playlists &&
	state.playlists.fetchStatus &&
	!(
		state.playlists.fetchStatus === FULFILLED ||
		state.playlists.fetchStatus === REJECTED
	);

/**
 * Select bool for if the playlists are loading.
 *
 * @param  {Object} state
 * @return {Object[]}
 */
export const selectAllTracks = state =>
	state.playlists &&
	state.playlists.playlists &&
	state.playlists.playlists
		.map((playlist) => ([
			...playlist.items.map((item) => ({
				...item.track,
				time_range: playlist.time_range || undefined,
			}))
		]))
		.flat()
