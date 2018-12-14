import React from 'react';
import { ConnectedRouter } from 'connected-react-router';
import createHistory from 'history/createBrowserHistory';
import Routes from './routes';

/**
 * Create browser history for router middleware.
 */
export const history = createHistory();

/**
 * General router component.
 *
 * @return {ReactElement}
 */
export default function Router( { children }) {
	return (
		<ConnectedRouter history={history}>
			<Routes />
		</ConnectedRouter>
	);
}
