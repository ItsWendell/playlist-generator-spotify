import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate as ReduxPersistProvider } from 'redux-persist/integration/react';

import { store, persistor } from './store';

export default class StoreProvider extends Component {
	static propTypes = {
		/** The app component(s) to render and provide store data for. */
		children: PropTypes.node.isRequired,
		/** An optional reference to the persist store to load, by default its the current persistor. */
		persistor: PropTypes.objectOf(PropTypes.any),
		/** An optional reference to the store to load, by default its the current store. */
		store: PropTypes.objectOf(PropTypes.any),
		/** The component(s) to render during loading. */
		loader: PropTypes.node,
		/** Callback defining that the store has started loading. */
		onLoading: PropTypes.func,
		/** Callback defining that the store is finished loading. */
		onFinished: PropTypes.func,
	};

	static defaultProps = {
		persistor,
		store,
		loader: null,
		onLoading: () => undefined,
		onFinished: () => undefined,
	};

	componentDidMount() {
		const { onLoading } = this.props;
		onLoading();
	}

	onPersistStoreReady = () => {
		const { onFinished } = this.props;
		onFinished();
	};

	render() {
		const {
			store: reducerStore,
			persistor: reduxPersistor,
			loader,
			children,
		} = this.props;
		return (
			<ReduxProvider store={reducerStore}>
				<ReduxPersistProvider
					persistor={reduxPersistor}
					loading={loader}
					onBeforeLift={this.onPersistStoreReady}
				>
					{children}
				</ReduxPersistProvider>
			</ReduxProvider>
		);
	}
}
