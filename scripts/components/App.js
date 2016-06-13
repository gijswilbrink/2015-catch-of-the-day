/**
 * Import framework
 */
import React from 'react';

/**
 * Import components
 */
import Header 		from './Header';
import Fish 		from './Fish';
import Order 		from './Order';
import Inventory 	from './Inventory';
import Catalyst 	from 'react-catalyst';

/**
 * Import firebase
 */
import Rebase from 're-base';
var base = Rebase.createClass('https://catch-of-the-day-ca551.firebaseio.com/');

/**
 * App
 * @renderTag App
 */
 var App = React.createClass({
 	/**
 	 * Init mixins
 	 */
 	mixins: [Catalyst.LinkedStateMixin],

 	/**
 	 * Get the initial app state
 	 */
 	getInitialState: function(){
 		return {
 			fishes : {},
 			order : {}
 		};
 	},

 	/**
 	 * On load
 	 */
 	componentDidMount: function(){
 		// Sync fishes state with firebase
 		base.syncState(this.props.params.storeId + '/fishes', {
 			context: this,
 			state: 'fishes'
 		});

 		// Sync order state with local storage
 		var savedOrderState = localStorage.getItem('order-' + this.props.params.storeId);
 		if(savedOrderState) {
 			// restore saved order state
 			this.setState({
 				order: JSON.parse(savedOrderState)
 			});
 		}
 	},

 	/**
 	 * When something changes
 	 */
 	componentWillUpdate: function(newProps, newState){
 		localStorage.setItem('order-' + this.props.params.storeId, JSON.stringify(newState.order));
 	},

	/**
 	 * Add fish to order
 	 */
 	addFishToOrder: function(key){
 		// 1. Set the state
 		this.state.order[key] = this.state.order[key] + 1 || 1;

 		// 2. Add the fish to the app state
 		this.setState({order: this.state.order});
 	},

 	/**
 	 * Add fish to state (to be able to show it in the menu)
 	 */
 	addFishToMenu: function(oFish){
 		// 1. Create a state key
 		var fishId = 'fish -' + (new Date()).getTime() + '-' + Math.floor((Math.random() * 100) + 1);
 		
 		// 2. Set the state
 		this.state.fishes[fishId] = oFish;

 		// 3. Add the fish to the app state
 		this.setState({fishes: this.state.fishes});
 	},

 	/**
 	 * Remove a fish from inventory
 	 */
 	 removeFish: function(key){
 	 	// Ask for confirmation
 	 	if(!confirm("Are you sure you want to remove this fish?")) return;
 	 	
 	 	// 1. Set fish to null
 	 	this.state.fishes[key] = null;

 	 	// 2. update app state
 	 	this.setState({fishes: this.state.fishes});
 	 	
 	 },

	/**
 	 * Remove a fish from order
 	 */
 	 removeFishFromOrder: function(key){
 	 	delete this.state.order[key];
 	 	this.setState({order: this.state.order});
 	 },

 	/**
 	 * Load some sample data
 	 */
 	loadSamples: function() {
 		// Load sample fishes into state
 		this.setState({
 			fishes: require('../sample-fishes')
 		});
 	},

	/**
 	 * Render one specific fish
 	 */
 	renderFish: function(key) {
 		// Init fish
 		var oFish = this.state.fishes[key];

 		// Render <Fish /> component
 		return <Fish key={key} index={key} details={oFish} addToOrder={this.addFishToOrder} />;
 	},

 	/**
 	 * Render the main app
 	 */
 	render: function() {
 		
 		return (<div className="catch-of-the-day">
 			<div className="menu">
 				<Header tagline="Fresh seafood good" />
 				<ul className="list-of-fishes">
 					{Object.keys(this.state.fishes).map(this.renderFish)}
 				</ul>
 			</div>
 			<Order removeFishFromOrder={this.removeFishFromOrder} fishes={this.state.fishes} order={this.state.order} />
 			<Inventory removeFish={this.removeFish} addFishToMenu={this.addFishToMenu} loadSamples={this.loadSamples} fishes={this.state.fishes} linkState={this.linkState} />
 		</div>);
 	}

 });

/**
 * Export
 */
export default App;