import React, { Component } from 'react';

import { connect } from 'react-redux';
import { logout, fetchUser, loginFromBrowserUrl } from 'src/ducks/user';
import {
	selectPlaylists,
	selectPlaylistsLoading,
	fetchMyTopTracks,
	selectAllTracks
} from 'src/ducks/playlists';

import { spotifyClient } from 'src/providers/spotify';

import Layout from 'src/molecules/layout';
import Row from 'src/molecules/row';
import Col from 'src/molecules/col';

import BackTop from 'src/molecules/back-top';
import PageHero, { HeroTitle, HeroSubtitle } from 'src/molecules/page-hero';
import Cover from 'src/molecules/spotify-cover';

import Container from 'src/atoms/container';
import Button from 'src/atoms/button';
import Select from 'src/atoms/select';

import TrackTable from 'src/organisms/track-table/track-table';
import FeatureSliders from 'src/organisms/feature-sliders/feature-sliders';

class App extends Component {
	constructor () {
		super();
		this.state = {
			playlists: [],
			audioFeatures: {},
			selectedGenres: [],
			selectedArtists: [],
			selectedTracks: [],
			generatedPlaylist: {},
			searchArtists: [],
			searchTracks: [],
			loadingTracks: false,
		};
	}

	initialize() {
		const { fetchUserAction, logoutAction, tokens } = this.props;

		if (!spotifyClient.getAccessToken() && tokens) {
			spotifyClient.setAccessToken(tokens.access_token);
		}

		fetchUserAction()
			.catch(() => logoutAction())
			.then(() => {
				spotifyClient.getAvailableGenreSeeds().then((data) => {
					this.setState({ genreSeeds: data.genres });
				});

				spotifyClient.getFeaturedPlaylists().then((data) => {
					this.setState({
						playlists:
							data &&
							data.playlists &&
							data.playlists.items
					});
				});
			});
	}

	componentDidMount() {
		const {
			loginFromBrowserUrlAction
		} = this.props;

		loginFromBrowserUrlAction()
			.catch(() => null)
			.then(() => {
				this.initialize();
			});

		this.initialize();
	}

	authenticate = () => {
		spotifyClient.authenticate(window.location.href, [
			'user-top-read',
			'playlist-read-private',
			'user-library-read'
		]);
	}

	renderCovers() {
		const { playlists } = this.state;

		const { generatedPlaylist } = this.state;

		if (!playlists && !generatedPlaylist) {
			return null;
		}

		const mapCovers = (item) => ({
			id: item.snapshot_id || item.id,
			cover: (item.images &&
				item.images.length &&
				item.images[0].url) ||
				(item.album.images &&
				item.album.images.length &&
				item.album.images[0].url),
			href: item.external_urls && item.external_urls.spotify,
		});

		let items;

		if (!generatedPlaylist || !generatedPlaylist.tracks) {
			items = playlists;
		} else {
			items = generatedPlaylist.tracks;
		}

		items = items
			.map(mapCovers)
			// Remove double covers
			.filter((item, index, self) => (
				index === self.findIndex((t) => (
					t.cover === item.cover
				))
			))
			.slice(0, 12)

		return (
			<Row type="flex" gutter={16}>
				{items.map((item) => (
					<Col key={item.id} span={4} style={{ padding: '0.5rem' }}>
						<Cover
							cover={item.cover}
							href={item.href}
						/>
					</Col>
				))}
			</Row>
		)
	}

	renderHero() {
		const { user } = this.props;

		const userName = user && user.display_name && user.display_name.split(' ', 1)[0];
		return (
			<PageHero>
				<Row type="flex" align="middle">
					<Col span={24}>
						{user ? (
							<Container center>
								<HeroTitle>Hi {userName}!</HeroTitle>
								<HeroSubtitle>Let's generate your own custom playlists!</HeroSubtitle>
								{this.renderCovers()}
							</Container>
						) : (
							<Container center>
								<HeroTitle>Login to get started!</HeroTitle>
								<Button onClick={() => this.authenticate()}>Login to Spotify</Button>
							</Container>
						)}
					</Col>
				</Row>
			</PageHero>
		);
	}

	submitPlaylist = () => {
		const { audioFeatures, selectedGenres, selectedArtists, selectedTracks } = this.state;
		this.setState({ loadingTracks: true });
		spotifyClient
			.getRecommendations({
				...Object.keys(audioFeatures)
					.reduce((features, audioFeature) => {
						features[`min_${audioFeature}`] = audioFeatures[audioFeature][0];
						features[`max_${audioFeature}`] = audioFeatures[audioFeature][1];
						return features;
					}, {}),
				seed_genres: selectedGenres.join(','),
				seed_artists: selectedArtists.join(','),
				seed_tracks: selectedTracks.join(','),
			})
			.then((data) => {
				console.log('Seeded Playlist', data);
				this.setState({ generatedPlaylist: data });
			})
			.finally(() => {
				this.setState({ loadingTracks: false });
			})
	}

	onArtistsSearch = (value) => {
		spotifyClient.searchArtists(value).then(({artists}) => {
			this.setState({ searchArtists: artists.items });
		});
	}

	onTrackSearch = (value) => {
		spotifyClient.searchTracks(value).then(({ tracks }) => {
			this.setState({ searchTracks: tracks.items });
		});
	}

	getSeedsLeft = () => {
		const maxSeeds = 5;
		const { selectedGenres, selectedArtists, selectedTracks } = this.state;
		const selectedSeeds = selectedGenres.length +
			selectedArtists.length +
			selectedTracks.length;

		return selectedSeeds <= maxSeeds ?
			maxSeeds - selectedSeeds :
			0;
	}

	render () {
		const { user, logoutAction } = this.props;
		const { genreSeeds, searchTracks } = this.state;
		return (
			<Layout>
				<BackTop />
				<Layout.Header style={{ backgroundColor: 'white' }}>
					<Row gutter={16} type="flex" align="middle" justify="space-between" style={{ height: '100%' }}>
						<Col span={18}>
							<h3 style={{ marginBottom: '0' }}>Spotify Playlist Generator</h3>
						</Col>
						<Col span={6} style={{ textAlign: 'right' }}>
							{!user ? (
								<Button onClick={() => this.authenticate()}>Login to Spotify</Button>
							) : (
								<Button onClick={() => logoutAction()
									.then(() => window.location.reload())
								}>
									Logout
								</Button>
							)}
						</Col>
					</Row>
				</Layout.Header>
				<Layout.Content>
					{this.renderHero()}
					<section id="audio-features">
						<Container style={{ marginTop: '2rem' }}>
							<h2>Audio Features</h2>
							<FeatureSliders
								onChange={(key, value) => this.setState({
									audioFeatures: {
										...this.state.audioFeatures,
										[key]: value,
									}
								})}
								values={this.state.audioFeatures}
							/>
						</Container>
					</section>
					<section id="seeds">
						<Container style={{ marginTop: '2rem', marginBottom: '2rem' }}>
							<h2>Seeds (Genres, Artists, Tracks)</h2>
							<p>Seeds left: {this.getSeedsLeft()}</p>
							<Row gutter={16}>
								<Col span={8}>
									<h3>Genres</h3>
									<Select
										allowClear
										mode="multiple"
										placeholder="Select genres for this playlist (optional)"
										onChange={checked => {
											!!this.getSeedsLeft() && this.setState({ selectedGenres: checked }, () => {
												this.submitPlaylist();
											});
										}}
										style={{ width: '100%', textTransform: 'capitalize' }}
									>
										{genreSeeds && genreSeeds.map(tag => (
											<Select.Option
												key={tag}
												style={{
													marginBottom: '1rem',
													textTransform: 'capitalize',
												}}
											>
												{tag}
											</Select.Option>
										))}
									</Select>
								</Col>
								<Col span={8}>
									<h3>Artists</h3>
									<Select
										mode="multiple"
										allowClear
										defaultActiveFirstOption={false}
										showArrow={false}
										filterOption={false}
										placeholder="Select artists for this playlist (optional)"
										onChange={checked => {
											!!this.getSeedsLeft() && this.setState({ selectedArtists: checked }, () => {
												this.submitPlaylist();
											});
										}}
										style={{ width: '100%' }}
										onSearch={this.onArtistsSearch}
										value={this.state.selectedArtists}
									>
										{this.state.searchArtists && this.state.searchArtists.map(artist => (
											<Select.Option
												key={artist.id}
												style={{
													marginBottom: '1rem',
													textTransform: 'capitalize',
												}}
												title={artist.name}
												value={artist.id}
											>
												{artist.name}
											</Select.Option>
										))}
									</Select>
								</Col>
								<Col span={8}>
									<h3>Tracks</h3>
									<Select
										mode="multiple"
										defaultActiveFirstOption={false}
										showArrow={false}
										filterOption={false}
										placeholder="Select tracks for this playlist (optional)"
										onChange={checked => {
											!!this.getSeedsLeft() &&
											this.setState({ selectedTracks: checked }, () => {
												this.submitPlaylist();
											});

										}}
										onSearch={this.onTrackSearch}
										style={{ width: '100%' }}
									>
										{searchTracks && searchTracks.map(track => (
											<Select.Option
												key={track.id}
												tilte={track.name}
												value={track.id}
												style={{
													marginBottom: '1rem',
													textTransform: 'capitalize',
												}}
											>
												{track.name} {track.artists && track.artists.length && `- ${track.artists[0].name}`}
											</Select.Option>
										))}
									</Select>
								</Col>
							</Row>
						</Container>
					</section>
					<section id="submit">
						<Container center style={{ marginBottom: '2rem' }}>
							<Button onClick={this.submitPlaylist}>Generate Playlist</Button>
						</Container>
					</section>
					<section id="results">
						<Container>
							<h2>Generated Playlist</h2>
							<Row align="middle" justify="center">
								<Col span={24}>
									<TrackTable loading={this.state.loadingTracks} tracks={this.state.generatedPlaylist && this.state.generatedPlaylist.tracks} />
								</Col>
							</Row>
						</Container>
					</section>
				</Layout.Content>
				<Layout.Footer>
					<Row>
						<Col span={12}>
							<p></p>
						</Col>
					</Row>
				</Layout.Footer>
			</Layout>
		);
	}
}

export default connect(
	state => ({
		playlists: selectPlaylists(state),
		allTracks: selectAllTracks(state),
		isLoading: selectPlaylistsLoading(state),
		user: state && state.user && state.user.user,
		tokens: state && state.user && state.user.tokens,
	}),
	{
		fetchMyTopTracksAction: fetchMyTopTracks,
		fetchUserAction: fetchUser,
		logoutAction: logout,
		loginFromBrowserUrlAction: loginFromBrowserUrl
	}
)(App);
