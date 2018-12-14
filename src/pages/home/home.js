import React, { Component } from 'react';

import { connect } from 'react-redux';
import {
	selectPlaylists,
	selectPlaylistsLoading,
	fetchMyTopTracks,
	selectAllTracks,
	topTracksTimeRanges
} from 'src/ducks/playlists';

import { spotifyClient, audioFeatures } from 'src/providers/spotify';

import Layout from 'src/molecules/layout';
import Row from 'src/molecules/row';
import Col from 'src/molecules/col';

import BackTop from 'src/molecules/back-top';
import PageHero, { HeroTitle, HeroSubtitle } from 'src/molecules/page-hero';
import Cover from 'src/molecules/spotify-cover';

import Container from 'src/atoms/container';
import Slider from 'src/atoms/slider';
import Button from 'src/atoms/button';
import Select from 'src/atoms/select';

import TrackTable from 'src/organisms/track-table/track-table';

import { logout, fetchUser, loginFromBrowserUrl } from 'src/ducks/user';

class App extends Component {

	constructor () {
		super();
		this.state = {
			playlists: [],
			loading: false,
			user: {},
			tracks: [],
			timeRanges: Object.keys(topTracksTimeRanges) || [],
			audioFeatures: {},
			selectedGenres: [],
			selectedArtists: [],
			selectedTracks: [],
			generatedPlaylist: {},
			searchArtists: [],
			searchTracks: [],
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

	/**
	 * Render the playlist table.
	 */
	renderDashboard() {
		const { playlists } = this.props;
		return !this.state.loading && playlists && playlists.length > 0 && (
			this.renderPlaylists()
		);
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
				item.album.images[0].url)
		});

		let items;

		if (!generatedPlaylist || !generatedPlaylist.tracks) {
			items = playlists.slice(0, 12).map(mapCovers);
		} else {
			items = generatedPlaylist.tracks.slice(0, 12).map(mapCovers);
		}

		return (
			<Row type="flex" gutter={16}>
				{items.map((playlist) => (
					<Col key={playlist.id} span={4} style={{ padding: '0.5rem' }}>
						<Cover
							cover={playlist.cover}
							// artist={playlist.name}
						/>
					</Col>
				))}
			</Row>
		)
	}

	toggleTimeRange = (value) => {
		if (this.state.timeRanges.includes(value)) {
			this.setState({
				timeRanges: this.state.timeRanges.filter((time_range) => (
					time_range !== value
				))
			});

			return;
		}

		this.setState({
			timeRanges: [ ...this.state.timeRanges, value ]
		});
	}

	/**
	 * Render the playlists and positions based on the first playlist in the state.
	 */
	renderPlaylists() {
		const { generatedPlaylist } = this.state;

		const tracks = generatedPlaylist.tracks;

		if (!tracks) {
			return null;
		}

		return (
			<Row>
				<h2>Generated Playlist</h2>
				<Row>
					<TrackTable tracks={tracks} />
				</Row>
			</Row>
		);
	}

	renderHero() {
		const { user } = this.props;

		const userName = user && user.display_name && user.display_name.split(' ', 1)[0];
		return (
			<PageHero>
				<Row type="flex" align="middle">
					<Col span={24}>
						{user && (
							<Container center>
								<HeroTitle>Hi {userName}!</HeroTitle>
								<HeroSubtitle>Let's generate your own custom playlists!</HeroSubtitle>
								{this.renderCovers()}
							</Container>
						)}
						{!user && (
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

	renderRecommendationSliders() {
		return (
			<Row type="flex" align="middle" justify="center" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
				{Object.keys(audioFeatures).map((audioFeature) => {
					return (
						<Col
							key={`slider-${audioFeature}`}
							span={3}
							style={{
								display: 'flex',
								alignItems: 'center',
								flexDirection: 'column',
							}}
						>
							<Slider
								style={{ minHeight: '12rem' }}
								key={audioFeature}
								vertical
								min={0}
								max={100}
								defaultValue={0}
								step={1}
								onChange={(value) => this.setState({
									audioFeatures: {
										...this.state.audioFeatures,
										[audioFeature]: value / 100,
									}
								})}
							/>
							<label
								style={{ fontWeight: 'bold', marginTop: '1rem' }}
							>
								{audioFeatures[audioFeature]}
							</label>
						</Col>
					);
				})}
			</Row>
		)
	}

	handleGenreChange(tag, checked) {
		const { selectedGenres } = this.state;
		const nextSelectedTags = checked
			? [...selectedGenres, tag]
			: selectedGenres.filter(t => t !== tag);
		this.setState({ selectedGenres: nextSelectedTags });
	}

	submitPlaylist = () => {
		const { audioFeatures, selectedGenres } = this.state;
		spotifyClient.getRecommendations({
			...Object.keys(audioFeatures)
				.reduce((features, audioFeature) => {
					features[`target_${audioFeature}`] = audioFeatures[audioFeature];
					return features;
				}, {}),
			seed_genres: selectedGenres.join(',')
		})
			.then((data) => {
				console.log('Seeded Playlist', data);
				this.setState({ generatedPlaylist: data });
			})
	}

	onArtistsSearch = (value) => {
		spotifyClient.searchArtists(value).then(({artists}) => {
			// console.log('artists', artists);
			this.setState({ searchArtists: artists.items });
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
		const {
			genreSeeds,
			selectedGenres,
			searchArtists,
			selectedArtists,
			searchTracks,
			selectedTracks,
		} = this.state;
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
							{this.renderRecommendationSliders()}
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
										showSearch
										mode="tags"
										placeholder="Select genres for this playlist (optional)"
										onChange={checked => this.setState({ selectedGenres: checked })}
										style={{ width: '100%' }}
									>
										{genreSeeds && genreSeeds.map(tag => (
											<Select.Option
												key={tag}
												checked={selectedGenres.indexOf(tag) > -1}
												style={{
													marginBottom: '1rem',
													textTransform: 'capitalize',
												}}
											>
												{tag}
											</Select.Option>a
										))}
									</Select>
								</Col>
								<Col span={8}>
									<h3>Artists</h3>
									<Select
										disabled
										showSearch
										mode="tags"
										placeholder="Select artists for this playlist (optional)"
										onChange={checked => this.setState({ selectedArtists: checked })}
										style={{ width: '100%' }}
										onSearch={this.onArtistsSearch}
									>
										{searchArtists && searchArtists.map(artist => (
											<Select.Option
												key={artist.id}
												checked={selectedArtists.indexOf(artist.id) > -1}
												style={{
													marginBottom: '1rem',
													textTransform: 'capitalize',
												}}
											>
												{artist.name}
											</Select.Option>
										))}
									</Select>
								</Col>
								<Col span={8}>
									<h3>Tracks</h3>
									<Select
										disabled
										showSearch
										large
										mode="tags"
										placeholder="Select genres for this playlist (optional)"
										onChange={checked => this.setState({ selectedTracks: checked })}
										onSearch={search => console.log('track search', search)}
										style={{ width: '100%' }}
									>
										{searchTracks && searchTracks.map(tag => (
											<Select.Option
												key={tag}
												checked={selectedTracks.indexOf(tag) > -1}
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
							<Row align="middle" justify="center" >
								<Col span={24}>
									{
										this.state.generatedPlaylist &&
										this.renderPlaylists()
									}
								</Col>
							</Row>
						</Container>
					</section>
				</Layout.Content>
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
