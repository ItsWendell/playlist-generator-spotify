import React from 'react';
import { Grommet } from 'grommet';

const config = {
	global: {
		font: {
			family: 'Roboto',
			size: '14px',
			height: '20px',
		},
	},
};

export default function Theme({ children }) {
	return (
		<Grommet theme={config}>
			{children}
		</Grommet>
	)
}
