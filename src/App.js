import React, { Component } from 'react';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Routes from './routes';
const store = configureStore(); 

class App extends Component {

	render() {
		return (
			<Provider store={store}>
				<MuiThemeProvider>
					<Routes />
				</MuiThemeProvider>
			</Provider>
		);
	}

}

export default App;
