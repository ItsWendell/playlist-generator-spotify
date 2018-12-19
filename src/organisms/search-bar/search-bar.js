import React, { Component } from 'react';
import styled from 'styled-components';

import Radio from 'src/atoms/radio';
import Select from 'src/atoms/select';

import Row from 'src/molecules/row';
import Col from 'src/molecules/col';
import SpotifyCover from 'src/molecules/spotify-cover';

import { spotifyClient } from 'src/providers/spotify';

const SEARCH_ARTIST = 'artist';
const SEARCH_TRACKS = 'track';

const Cover = styled(SpotifyCover)`
	min-width: 2.5rem;
	max-width: 2.5rem;
`;

export default class SpotifySearchBar extends Component {
	state = {
		searchType: SEARCH_TRACKS,
		results: [],
		placeholderResults: [],
	};

	searchTypes = [SEARCH_ARTIST, SEARCH_TRACKS];

	componentDidMount() {
		this.fetchPlaceholderResults();
	}

	addPlaceholderResults = (items) => {
		this.setState({
			placeholderResults: [
				...this.state.placeholderResults,
				...items,
			]
		});
	}

	fetchPlaceholderResults = () => {
		spotifyClient.getMyTopArtists()
			.then(({ items }) => this.addPlaceholderResults(items));
		spotifyClient.getMyTopTracks()
			.then(({ items }) => this.addPlaceholderResults(items));
	}

	onRadioChange = ({ target: { value }}) => {
		this.setState({
			searchType: value,
			results: [],
			myTopResults: [],
			searchValue: undefined,
		});
	}

	onSearch = (value) => {
		const { onSearch } = this.props;
		if (!value) {
			this.setState({
				results: [],
			});
			return null;
		}
		return spotifyClient
			.search(value, [this.state.searchType] , {
				limit: 10,
			})
			.then((results) => {
				if (results.artists && results.artists.items.length) {
					this.setState({ results: results.artists.items });
				} else if (results.tracks && results.tracks.items.length) {
					this.setState({ results: results.tracks.items });
				}
				onSearch && onSearch(results)
			});
	}

	getResults() {
		if (this.state.results && this.state.results.length) {
			return this.state.results;
		}


		return this.state.placeholderResults.filter((item) => {
			return this.state.searchType === SEARCH_TRACKS ? !!item.album : !item.album;
		});
	}

	render() {
		const { onChange, onSelect, disabled } = this.props;
		return (
			<Row type="flex" gutter={16}>
				<Col>
					<Select
						disabled={disabled}
						showSearch
						defaultActiveFirstOption
						placeholder={
							this.state.searchType === SEARCH_ARTIST ?
								'Searching Artists' :
								'Searching Tracks'
						}
						width="100%"
						style={{ minWidth: '30rem' }}
						size="large"
						value={this.state.searchValue}
						showArrow={false}
						filterOption={false}
						suffixIcon="search"
						onSearch={this.onSearch}
						onChange={onChange}
						notFoundContent={null}
					>
						{[...this.getResults()].map((item) => {
							const artist = item.artists && item.artists[0] && item.artists[0].name;
							const cover = (item.album && item.album.images &&
								item.album.images.length &&
								item.album.images[0].url) || (item.images &&
								item.images.length &&
								item.images[0].url);
							const name = `${ item.name }${ artist ? ` - ${artist}` : '' }`;
							return (
								<Select.Option onClick={() => {
									this.setState({ searchValue: undefined });
									onSelect(item)
								}} key={item.id}>
									<Row gutter={8} type="flex" align="middle" style={{ flexWrap: 'nowrap' }}>
										<Col>
											<Cover style={{ paddingTop: '0.2rem', paddingBottom: '0.2rem' }} cover={cover}></Cover>
										</Col>
										<Col>
											<label style={{
												textOverflow: 'ellipsis',
												maxWidth: '100%',
												whiteSpace: 'nowrap',
												overflow: 'hidden',
											}}>
												{name}
											</label>
										</Col>
									</Row>
								</Select.Option>
							);
						})}
					</Select>
				</Col>
				<Col>
					<Row type="flex" gutter={16}>
						<Radio.Group
							disabled={disabled}
							size="large"
							buttonStyle="solid"
							onChange={this.onRadioChange}
							defaultValue={this.state.searchType}
							value={this.state.searchType}
						>
							{this.searchTypes.map((type) => (
								<Radio.Button key={type} value={type}>
									<span style={{ textTransform: 'capitalize' }}>
										{type}
									</span>
								</Radio.Button>
							))}
						</Radio.Group>
					</Row>
				</Col>
			</Row>
		);
	}
}
