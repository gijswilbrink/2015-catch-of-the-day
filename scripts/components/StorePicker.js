/**
 * Import framework
 */
import React		from 'react';
import { History }	from 'react-router';
import h			from '../helpers';

/**
 * Store Picker
 * @rendertag  <StorePicker />
 */
var StorePicker = React.createClass({
 	
 	mixins: [History],

 	goToStore: function(e) {
 		e.preventDefault();
 		// get store id from the input
 		var storeId = this.refs.storeId.value;
 		
 		// go from <StorePicker /> to <App />
 		this.history.pushState(null, '/store/' + storeId);

 	},

 	render: function() {
 		
 		return (
 			<form className="store-selector" onSubmit={this.goToStore}>
 				<h2>Please enter a store</h2>
 				<input type="text" ref="storeId" defaultValue={h.getFunName()} required />
 				<input type="submit" />
 			</form>
 		)
 	}
 
});

/**
 * Export
 */
export default StorePicker;