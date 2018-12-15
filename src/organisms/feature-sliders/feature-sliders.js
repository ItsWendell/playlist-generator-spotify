
import React from 'react';

import Slider from 'src/atoms/slider';
import Row from 'src/molecules/row';
import Col from 'src/molecules/col';

import { Label } from './elements';
/**
 * @see https://developer.spotify.com/documentation/web-api/reference/tracks/get-audio-features/
 */
export const audioFeatures = {
	"acousticness": 'Acousticness',
	"danceability": 'Danceability',
	"energy": 'Energy',
	"instrumentalness": 'Intrumentalness',
	"liveness": 'Liveness',
	"speechiness": 'Speechiness',
	"valence": 'Positivity',
};

export default function FeatureSliders({ onChange, values }) {
	return (
		<Row type="flex" align="middle" justify="center" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
			{ Object.keys(audioFeatures).map((audioFeature) => (
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
						range
						marks={{
							0: 'Low',
							100: 'High',
						}}
						defaultValue={[0, 100]}
						style={{ minHeight: '12rem' }}
						key={audioFeature}
						vertical
						min={0}
						max={100}
						step={1}
						onChange={(values) => {
							onChange && onChange(audioFeature, values.map((item) => item / 100));
						}}
					/>
					<Label>
						{audioFeatures[audioFeature]}
					</Label>
				</Col>
			)) }
			<Col
				key={`slider-tempo`}
				span={3}
				style={{
					display: 'flex',
					alignItems: 'center',
					flexDirection: 'column',
				}}
			>
				<Slider
					range
					min={0}
					max={300}
					marks={{
						0: 'Low',
						300: 'High',
					}}
					style={{ minHeight: '12rem' }}
					key='tempo'
					vertical
					defaultValue={[0, 300]}
					step={2}
					onChange={(values) => {
						onChange && onChange('tempo', values);
					}}
				/>
				<Label>
					Tempo (BPM)
				</Label>
			</Col>
		</Row>
	)
}
