import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { spotifyClient } from '../spotify';

const ProtectedRoute = ({ component: Component, tokens, ...rest }) => {
	if (tokens && tokens.access_token) {
		spotifyClient.setAccessToken(tokens.access_token);
	}
	return (
		<Route
			{...rest}
			render={props =>
				tokens !== undefined ? (
					<Component {...props} />
				) : (
					<Redirect to="/login" />
				)
			}
		/>
	);
};

/**
 * User authentication protected route component.
 *
 * @param {Object} params
 * @return {React.Component}
 */
export default connect(state => ({
	tokens: state.user.tokens,
}))(ProtectedRoute);
