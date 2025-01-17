/**
 * External dependencies
 */

import React from 'react';
import { Provider } from 'react-redux';

/**
 * Internal dependencies
 */

import createReduxStore from './state';
import { getInitialState } from './state/initial';
import Home from './page/home';
import { apiFetch } from '@wp-plugin-lib';

// Set API nonce and root URL
apiFetch.resetMiddlewares();
apiFetch.use( apiFetch.createRootURLMiddleware( SearchRegexi10n?.api?.WP_API_root ?? '/wp-json/' ) );
apiFetch.use( apiFetch.createNonceMiddleware( SearchRegexi10n?.api?.WP_API_nonce ?? '' ) );

const App = () => (
	<Provider store={ createReduxStore( getInitialState() ) }>
		<React.StrictMode>
			<Home />
		</React.StrictMode>
	</Provider>
);

export default App;
