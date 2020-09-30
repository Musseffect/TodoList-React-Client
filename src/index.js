import React from "react";
import { render } from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import { Provider } from "react-redux";
import App from './containers/app.jsx';
import store from "./store.js";
import {CookiesProvider} from 'react-cookie';

render(	<CookiesProvider>
			<Provider store={store}>
				<BrowserRouter basename={process.env.PUBLIC_URL}>
				      <App/>
				</BrowserRouter>
			</Provider>
		</CookiesProvider>,
			    document.getElementById('root'));