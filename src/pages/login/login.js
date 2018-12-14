import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import { connect } from 'react-redux';
import Button from 'src/atoms/button';
import { spotifyClient } from 'src/providers/spotify';
import PageHero, { HeroTitle } from 'src/molecules/page-hero';
import Container from 'src/atoms/container';
import { loginFromBrowserUrl, logout, fetchUser } from 'src/ducks/user';

class Login extends Component {
	state = {
		redirectToReferrer: false,
	};

	authenticate = () => {
		spotifyClient.authenticate(window.location.href, [
			'user-top-read',
			'playlist-read-private',
			'user-library-read'
		]);
	}

	componentDidMount() {
		const { loginFromBrowserUrlAction, fetchUserAction, logoutAction } = this.props;
		const { tokens } = this.props;

		loginFromBrowserUrlAction()
			.then(() => {
				fetchUserAction()
					.then(() => {
						this.redirect();
					})
					.catch(() => {
						logoutAction();
					});
			})
			.catch((error) => {
			})
			.finally(() => {
				if (tokens) {
					this.redirect();
				}
			});
	}

	redirect = () => {
		this.setState({ redirectToReferrer: true });
	}

	render() {
		const referrer = (this.props.location && this.props.location.state);
		const { redirectToReferrer } = this.state;

		if (redirectToReferrer) {
			return (<Redirect to={referrer || { pathname: '/'} } />);
		}

		return (
			<PageHero
				fullPage={true}
				center
			>
				<Container style={{ textAlign: 'center' }}>
					<HeroTitle>Discover Your Personal Taste Over Time on Spotify</HeroTitle>
					<Button
						size="default"
						type="primary"
						icon="lock"
						iconAlign="left"
						onClick={this.authenticate}
					>
						Login to Spotify
					</Button>
				</Container>
			</PageHero>
		)
	}
}

export default connect(
	state => ({
		tokens: state && state.user && state.user.tokens,
	}),
	{
		loginFromBrowserUrlAction: loginFromBrowserUrl,
		logoutAction: logout,
		fetchUserAction: fetchUser,
	}
)(Login);
