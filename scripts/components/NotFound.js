/**
 * Import framework
 */
import React from 'react';

/**
 * Not found
 * @rendertag <NotFound />
 */
var NotFound = React.createClass({

 	render: function() {
 		return (<h1>Page not found!</h1>);
 	}

});

/**
 * Export
 */
export default NotFound;