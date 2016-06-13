/**
 * Import framework
 */
import React 			from 'react';
import ReactDOM 		from 'react-dom';
import {Router, Route}	from 'react-router';
import {createHistory}	from 'history';

/**
 * Import components
 */
import NotFound 		from './components/NotFound';
import App				from './components/App';
import StorePicker 		from './components/StorePicker';

 /**
  * Routes
  */
var routes = (
	<Router history={createHistory()}>
		<Route path="/" component={StorePicker} />
		<Route path="/store/:storeId" component={App} />
		<Route path="*" component={NotFound} />
	</Router>
);

/**
 * Render
 */
ReactDOM.render(routes, document.getElementById('main'));