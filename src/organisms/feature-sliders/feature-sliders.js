
import React from 'react';
import 'styled-components/macro';

import Slider from 'src/atoms/slider';
import Row from 'src/molecules/row';
import Col from 'src/molecules/col';
import Icon from 'src/atoms/icon';

import { Label } from './elements';
/**
 * @see https://developer.spotify.com/documentation/web-api/reference/tracks/get-audio-features/
 */
export const audioFeatures = {
	"acousticness": 'Acousticness',
	"danceability": 'Danceability',
	"energy": 'Energy',
	"instrumentalness": 'Instrumentalness',
	"liveness": 'Liveness',
	"speechiness": 'Speechiness',
	"valence": 'Positivity',
};

export default function FeatureSliders({ onChange, onAfterChange, values, showValues }) {
	const tempoMarks = {
		0: 'Low',
		300: 'High',
	};
	const currentTempoMark = showValues && showValues['tempo'];

	if (currentTempoMark) {
		tempoMarks[currentTempoMark] = {
			label: <Icon type="info" />
		};
	}
	return (
		<Row type="flex" align="middle" justify="center">
			{ Object.keys(audioFeatures).map((audioFeature) => {
				const marks = {
					0: 'Low',
					100: 'High',
				};
				const currentMark = showValues && showValues[audioFeature] * 100;

				if (currentMark) {
					marks[currentMark] = {
						label: <Icon type="info" />
					};
				}
				return (
					<Col
						key={`slider-${audioFeature}`}
						span={24}
					>
						<Label>
							{audioFeatures[audioFeature]}
						</Label>
						<Slider
							range
							marks={marks}
							defaultValue={[0, 100]}
							css="width: 100%"
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
				)}
			)}
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
					marks={tempoMarks}
					css="width: 100%"
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
