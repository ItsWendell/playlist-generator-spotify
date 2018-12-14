import React from 'react';
import { render } from 'react-dom';

import Store from 'src/providers/store';
import Router from 'src/providers/router';

import './app.css';


function App({ children }) {
	return (
		<Store>
			<Router />
		</Store>
	);
};

export default render(<App />, document.getElementById('root'));
