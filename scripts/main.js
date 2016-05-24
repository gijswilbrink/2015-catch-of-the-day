// Init react & DOM
var React = require('react');
var ReactDOM = require('react-dom');

// Init router
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var History = ReactRouter.History;
var createBrowserHistory = require('history/lib/createBrowserHistory');

// Init helpers
var h = require('./helpers');

// Init firebase
var Rebase = require('re-base');
var base = Rebase.createClass('https://catch-of-the-day-ca551.firebaseio.com/');

/**
 * App
 */
 var App = React.createClass({

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
 		base.syncState(this.props.params.storeId + '/fishes', {
 			context: this,
 			state: 'fishes'
 		});
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
 	 * Load some sample data
 	 */
 	loadSamples: function() {
 		// Load sample fishes into state
 		this.setState({
 			fishes: require('./sample-fishes')
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
 			<Order fishes={this.state.fishes} order={this.state.order} />
 			<Inventory addFish={this.addFish} loadSamples={this.loadSamples} />
 		</div>);
 	}

 });

/**
 * Fish
 * <Fish />
 */
var Fish = React.createClass({

	onButtonClick: function(){
		this.props.addToOrder(this.props.index);
	},

	render: function(){
		// init
		var oDetails = this.props.details;
		var isAvailable = true;
		if(oDetails.status !== 'available') isAvailable = false;
		var buttonText = 'Add to order';
		if(!isAvailable) buttonText = 'Sold out!';

		// render
		return (
			<li className="menu-fish">
				<img src={oDetails.image} alt={oDetails.name} />
				<h3 className="fish-name">
					{oDetails.name}
					<span className="price">{h.formatPrice(oDetails.price)}</span>
				</h3>
				<p>{oDetails.desc}</p>
				<button onClick={this.onButtonClick} disabled={!isAvailable}>{buttonText}</button>
			</li>
		);
	}
});

/**
 * Add fish form
 * @rendertag <AddFishForm />
 */
var AddFishForm = React.createClass({

	createFish: function(e) {
		// 1. Init
		e.preventDefault();

		// 2. Take form data and create object
		var oFish = {
			name: this.refs.name.value,
			price: this.refs.price.value,
			status: this.refs.status.value,
			desc: this.refs.desc.value,
			image: this.refs.image.value
		};

		// 3. Add the fish to the app state
		this.props.addFish(oFish);
		this.refs.fishForm.reset();
	},

	render: function() {
		return (
		<form className="fish-edit" ref="fishForm" onSubmit={this.createFish}>
	        <input type="text" ref="name" placeholder="Fish Name"/>
	        <input type="text" ref="price" placeholder="Fish Price" />
	        <select ref="status">
	          <option value="available">Fresh!</option>
	          <option value="unavailable">Sold Out!</option>
	        </select>
	        <textarea type="text" ref="desc" placeholder="Desc"></textarea>
	        <input type="text" ref="image" placeholder="URL to Image" />
	        <button type="submit">+ Add Item </button>
	      </form>
	    )
	}
});

/**
 * Header 
 * @rendertag  <Header />
 */
 var Header = React.createClass({

 	render: function() {

		return(
			<header className="top">
				<h1>
					Catch
					<span className="ofThe">
						<span className="of">of</span>
						<span className="the">the</span>
					</span>
					day
				</h1>
				<h3 className="tagline"><span>{this.props.tagline}</span></h3>	
			</header>
		);
 	}
 });

/**
 * Order
 * @rendertag  <Order /> 
 */
 var Order = React.createClass({

 	renderOrderRow: function(key) {
 		// init
 		var oFish = this.props.fishes[key];
 		var count = this.props.order[key];

 		if(!oFish) {
 			return (
 				<li key={key}>Sorry, fish is no longer available!</li>
 			);
 		}

 		// render order row template
 		return (
 			<li key={key}>
 				{count}lbs
 				{oFish.name}
 				<span className="price">{h.formatPrice(count * oFish.price)}</span>
 			</li>
 		);
 	},

 	render: function() {

 		// init
 		var orderIds = Object.keys(this.props.order);
 		var total = orderIds.reduce((prevTotal, key)=> {
 			var oFish = this.props.fishes[key];
 			var count = this.props.order[key];
 			var isAvailable = oFish && oFish.status === 'available';

 			if(oFish && isAvailable) { 
 				return prevTotal + (count * parseInt(oFish.price) || 0);
 			}

 			return prevTotal;
 		}, 0	);

 		// render template
 		return (
 			<div className="order-wrap">
 				<h2 className="order-title">Your Order</h2>
 				<ul className="order">
 					{orderIds.map(this.renderOrderRow)}
 					<li className="total">
 						<strong>Total:</strong>
 						{h.formatPrice(total)}
 					</li>
 				</ul>
 			</div>
 		);
 	}
 });

/**
 * Inventory 
 * @rendertag  <Inventory />
 */
 var Inventory = React.createClass({

 	render: function() {
 		return (
 			<div>
 				<h2>Inventory</h2>
 				<AddFishForm {...this.props} />
 				<button onClick={this.props.loadSamples}>Load sample fishes</button>
 			</div>
 		);
 	}
 });

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
 * Not found
 * @rendertag <NotFound />
 */
 var NotFound = React.createClass({

 	render: function() {
 		return (<h1>Page not found!</h1>);
 	}
 });

 /**
  * Routes
  */
 var routes = (
 	<Router history={createBrowserHistory()}>
 		<Route path="/" component={StorePicker} />
 		<Route path="/store/:storeId" component={App} />
 		<Route path="*" component={NotFound} />
 	</Router>
 );


ReactDOM.render(routes, document.getElementById('main'));