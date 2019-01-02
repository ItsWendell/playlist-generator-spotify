import React, { Component } from 'react';
import 'styled-components/macro';

import { connect } from 'react-redux';
import { logout, fetchUser, loginFromBrowserUrl } from 'src/ducks/user';

import { spotifyClient } from 'src/providers/spotify';

import Layout from 'src/molecules/layout';
import Row from 'src/molecules/row';
import Col from 'src/molecules/col';

import BackTop from 'src/molecules/back-top';
import PageHero, { HeroTitle, HeroSubtitle } from 'src/molecules/hero';
import Cover from 'src/molecules/spotify-cover';

import Icon from 'src/atoms/icon';
import Container from 'src/atoms/container';
import Button from 'src/atoms/button';
import Select from 'src/atoms/select';

import PageHeader from 'src/organisms/page-header';
import TrackTable from 'src/organisms/track-table/track-table';
import FeatureSliders from 'src/organisms/feature-sliders/feature-sliders';
import SearchBar from 'src/organisms/search-bar';

class App extends Component {
	constructor () {
		super();
		this.state = {
			playlists: [],
			audioFeatures: {},
			selectedGenres: [],
			selectedSeeds: [],
			selectedTrack: {},
			generatedPlaylist: {},
			playlistAudioFeatures: {},
			loadingTracks: false,
		};
	}

	initialize() {
		const { fetchUserAction, logoutAction, tokens } = this.props;

		//
		if (!spotifyClient.getAccessToken() && tokens) {
			spotifyClient.setAccessToken(tokens.access_token);
		}

		fetchUserAction()
			.catch(() => logoutAction())
			.then(() => {
				spotifyClient.getAvailableGenreSeeds().then((data) => {
					this.setState({ genreSeeds: data.genres });
				});
			});
	}

	componentDidMount() {
		const { loginFromBrowserUrlAction } = this.props;

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

	renderSelectedSeeds = () => {
		const { selectedSeeds } = this.state;

		const mapCovers = (item) => {
			const artist = item.artists && item.artists[0] && item.artists[0].name;
			return {
				id: item.snapshot_id || item.id,
				cover: (item.images &&
				item.images.length &&
				item.images[0].url) ||
				(item.album.images &&
				item.album.images.length &&
				item.album.images[0].url),
				href: item.external_urls && item.external_urls.spotify,
				artist: artist,
				name: item.name,
			}
		}

		const items = selectedSeeds.map(mapCovers)

		if (!items.length) {
			return (<p>Start searching for artists or tracks...</p>);
		}

		return (
			<div>
				<p>Options left including genres: {this.getSeedsLeft()}</p>
				<Row css="flex-wrap: no-wrap" type="flex" gutter={16}>
					{items.map((item) => (
						<Col key={item.id} css="max-width: 20%; text-align: center;">
							<Cover
								cover={item.cover}
								name={item.name}
								artist={item.artist}
								href={item.href}
								onClose={() => this.onRemoveSeedById(item.id)}
							/>
							<div css="margin-top: 0.5rem">
								<label css="text-align: center">{item.name}</label>
							</div>
						</Col>
					))}
				</Row>
			</div>
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
								<SearchBar disabled={!this.getSeedsLeft()} onSelect={this.onSelectSeed} />
							</Container>
						) : (
							<Container center>
								<HeroTitle>Login to get started!</HeroTitle>
								<Button icon="login" size="large" ghost onClick={() => this.authenticate()}>Login to Spotify</Button>
							</Container>
						)}
					</Col>
				</Row>
			</PageHero>
		);
	}

	getAudioFeaturesForGeneratedPlaylist() {
		if (!(this.state.generatedPlaylist && this.state.generatedPlaylist.tracks)) {
			return null;
		}

		const tracks = this.state.generatedPlaylist.tracks
			.filter((track) => !(track.id in this.state.playlistAudioFeatures))
			.map((track) => track.id);

		spotifyClient.getAudioFeaturesForTracks(tracks)
			.then(({ audio_features }) => {
				this.setState({
					playlistAudioFeatures: {
						...this.state.playlistAudioFeatures,
						...audio_features
							.reduce((result, item) => {
								result[item.id] = item;
								return result;
							}, {}),
					}
				});
			});
	}

	submitPlaylist = () => {
		const { audioFeatures, selectedGenres, selectedSeeds } = this.state;
		this.setState({ loadingTracks: true });
		const selectedArtists = selectedSeeds
			.filter((item) => !item.artists)
			.map((item) => item.id);

		const selectedTracks = selectedSeeds
			.filter((item) => !!item.artists)
			.map((item) => item.id);

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
				this.setState({ generatedPlaylist: data }, () => {
					this.getAudioFeaturesForGeneratedPlaylist();
				});
			})
			.finally(() => {
				this.setState({ loadingTracks: false });
			});
	}

	onSelectSeed = (item) => {
		if (!!this.getSeedsLeft() && !this.state.selectedSeeds.includes(item)) {
			this.setState({
				selectedSeeds: [
					...this.state.selectedSeeds,
					item
				]
			}, () => {
				this.submitPlaylist();
				item.artist = item.artists && item.artists[0] && item.artists[0].name;
				if (item.artist) {
					this.selectTrack(item);
				}
			});
		}
	}

	onRemoveSeedById = (id) => {
		this.setState({
			selectedSeeds:
				this.state.selectedSeeds
					.filter((item) => item.id !== id)
		}, () => this.submitPlaylist());
	}

	getSeedsLeft = () => {
		const maxSeeds = 5;
		const { selectedGenres, selectedSeeds } = this.state;
		const total = selectedGenres.length + selectedSeeds.length;

		return total <= maxSeeds ? maxSeeds - total : 0;
	}

	getSelectedTrackFeatures = () => {
		const { playlistAudioFeatures, selectedTrack } = this.state
		return selectedTrack.id ? playlistAudioFeatures[selectedTrack.id] : null;
	}

	selectTrack = (item) => {
		this.setState({ selectedTrack: item }, () => {
			if (!this.getSelectedTrackFeatures()) {
				this.fetchAudioFeatures(item.id);
			}
		});
	}

	fetchAudioFeatures = (trackId) => {
		spotifyClient.getAudioFeaturesForTrack(trackId).then((audioFeatures) => {
			this.setState({
				playlistAudioFeatures: {
					...this.state.playlistAudioFeatures,
					[trackId]: audioFeatures
				}
			});
		})
	}

	render () {
		const { user, logoutAction } = this.props;
		const { genreSeeds, selectedTrack } = this.state;
		const selectedArtist = selectedTrack && selectedTrack.artist;
		return (
			<Layout>
				<BackTop />
				<Layout.Header css="&& { background: white; }">
					<PageHeader logo={(
						<h3 css="margin-bottom: 0">Spotify Playlist Generator</h3>
					)}>
						{!user ? (
							<Button icon="login" type="primary" onClick={() => this.authenticate()}>Login to Spotify</Button>
						) : (
							<Button
								onClick={() => logoutAction()
									.then(() => window.location.reload())
								}
							>
									Logout
							</Button>
						)}
						<Button
							icon="github"
							href="https://github.com/ItsWendell/playlist-generator-spotify"
							css="margin-left: 0.5rem"
						>
							It's open source!
						</Button>
					</PageHeader>
				</Layout.Header>
				<Layout.Content>
					{this.renderHero()}
					<Container>
						<Layout>
							<Layout.Content css="padding-right: 2rem">
								<section id="seeds">
									<h2>Your Seeds</h2>
									{this.renderSelectedSeeds()}
								</section>
								<section id="playlist">
									<h2>Generated Playlist</h2>
									<Row align="middle" justify="center">
										<Col span={24}>
											<TrackTable
												loading={this.state.loadingTracks}
												tracks={this.state.generatedPlaylist && this.state.generatedPlaylist.tracks}
												actionColumn={(item) => (
													<Button
														icon="info"
														href="#properties"
														onClick={() => this.selectTrack(item)}>
															Show Features
													</Button>
												)}
											/>
										</Col>
									</Row>
								</section>
							</Layout.Content>
							<Layout.Sider width={300} css="&& { background-color: transparent }">
								<section id="audio-features">
									<h2>Genres</h2>
									<Select
										allowClear
										mode="multiple"
										placeholder="Select genres for this playlist (optional)"
										onChange={checked => {
											if (this.getSeedsLeft()) {
												this.setState({ selectedGenres: checked }, () => {
													this.submitPlaylist();
												});
											}
										}}
										css="&& { width: 100%; margin-bottom: 1rem; }"
									>
										{genreSeeds && genreSeeds.map(tag => (
											<Select.Option
												key={tag}
												css="&& { margin-bottom: 1rem; text-transform: capitalize"
											>
												{tag}
											</Select.Option>
										))}
									</Select>
									<h2 id="properties">Audio Features</h2>
									{selectedTrack && selectedTrack.name &&
										<p><Icon type="info" />{`${selectedTrack.name} - ${selectedArtist}`}</p>
									}
									<FeatureSliders
										onChange={(key, value) => this.setState({
											audioFeatures: {
												...this.state.audioFeatures,
												[key]: value,
											}
										})}
										onAfterChange={() => this.submitPlaylist()}
										values={this.state.audioFeatures}
										showValues={this.getSelectedTrackFeatures()}
									/>
								</section>
							</Layout.Sider>
						</Layout>
					</Container>
				</Layout.Content>
				<Layout.Footer>
					<Container>
						<Row align="middle" justify="center">
							<Col span={24} css="text-align: center;">
								<Button icon="github" href="https://github.com/ItsWendell/playlist-generator-spotify">It's open source!</Button>
							</Col>
						</Row>
					</Container>
				</Layout.Footer>
			</Layout>
		);
	}
}

export default connect(
	state => ({
		user: state && state.user && state.user.user,
		tokens: state && state.user && state.user.tokens,
	}),
	{
		fetchUserAction: fetchUser,
		logoutAction: logout,
		loginFromBrowserUrlAction: loginFromBrowserUrl
	}
)(App);
