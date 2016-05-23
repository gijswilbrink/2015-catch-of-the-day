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

/**
 * App
 */
 var App = React.createClass({
 	getInitialState: function(){
 		return {
 			fishes : {},
 			order : {}
 		};
 	},

 	addToOrder: function(key){
 		this.state.order[key] = this.state.order[key] + 1 || 1;
 		this.setState({order: this.state.order});
 	},

 	addFish: function(fish){
 		// 1. Update the state object
 		var fishId = 'fish -' + (new Date()).getTime() + '-' + Math.floor((Math.random() * 100) + 1);
 		this.state.fishes[fishId] = fish;

 		// 2. Set the state
 		this.setState({fishes: this.state.fishes});

 		// 3. Add the fish to the app state
 	},

 	loadSamples: function() {
 		this.setState({
 			fishes: require('./sample-fishes')
 		});
 	},

 	renderFish: function(key) {
 		var oFish = this.state.fishes[key];
 		return <Fish key={key} index={key} details={oFish} />;
 	},

 	render: function() {
 		
 		return (<div className="catch-of-the-day">
 			<div className="menu">
 				<Header tagline="Fresh seafood good" />
 				<ul className="list-of-fishes">
 					{Object.keys(this.state.fishes).map(this.renderFish)}
 				</ul>
 			</div>
 			<Order />
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

 	render: function() {
 		return (<p>Order</p>);
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