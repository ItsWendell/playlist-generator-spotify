
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

export default function FeatureSliders({ onChange, onAfterChange, values }) {
	return (
		<Row type="flex" align="middle" justify="center" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
			{ Object.keys(audioFeatures).map((audioFeature) => (
				<Col
					key={`slider-${audioFeature}`}
					span={24}
				>
					<Label>
						{audioFeatures[audioFeature]}
					</Label>
					<Slider
						range
						marks={{
							0: 'Low',
							100: 'High',
						}}
						defaultValue={[0, 100]}
						style={{ width: '100%' }}
						key={audioFeature}
						min={0}
						max={100}
						step={1}
						onChange={(values) => {
							onChange && onChange(audioFeature, values.map((item) => item / 100));
						}}
						onAfterChange={(values) => {
							onAfterChange && onAfterChange(audioFeature, values.map((item) => item / 100));
						}}
					/>
				</Col>
			)) }
			<Col
				key={`slider-tempo`}
				span={24}
			>
				<Label>
					Tempo (BPM)
				</Label>
				<Slider
					range
					min={0}
					max={300}
					marks={{
						0: 'Low',
						300: 'High',
					}}
					style={{ width: '100%' }}
					key='tempo'
					defaultValue={[0, 300]}
					step={2}
					onChange={(values) => {
						onChange && onChange('tempo', values);
					}}
					onAfterChange={(values) => {
						onAfterChange && onAfterChange('tempo', values.map((item) => item / 100));
					}}
				/>
			</Col>
		</Row>
	)
}
