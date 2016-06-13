/**
 * Import framework
 */
import React 				from 'react';
import CSSTransitionGroup	from 'react-addons-css-transition-group';
import h 					from '../helpers';

/**
 * Order
 * @rendertag  <Order /> 
 */
 var Order = React.createClass({

 	propTypes: {
 		fishes: React.PropTypes.object.isRequired,
 		order: React.PropTypes.object.isRequired,
 		removeFishFromOrder: React.PropTypes.func.isRequired
 	},

 	renderOrderRow: function(key) {
 		// init
 		var oFish = this.props.fishes[key];
 		var count = this.props.order[key];
 		var removeButton = <button onClick={this.props.removeFishFromOrder.bind(null,key)}>&times;</button>
 		
 		if(!oFish) {
 			return (
 				<li key={key}>Sorry, fish is no longer available! {removeButton}</li>
 			);
 		}

 		// render order row template
 		return (
 			<li key={key}>
 				{count}lbs
 				{oFish.name}
 				<span className="price">{h.formatPrice(count * oFish.price)}</span>
 				{removeButton}
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
 				<CSSTransitionGroup
 					className="order"
 					component="ul"
 					transitionName="order"
 					transitionEnterTimeout={500}
 					transitionLeaveTimeout={500}
 				>
 					{orderIds.map(this.renderOrderRow)}
 					<li className="total">
 						<strong>Total:</strong>
 						{h.formatPrice(total)}
 					</li>
 				</CSSTransitionGroup>
 			</div>
 		);
 	}
 
 });

/**
 * Export
 */
export default Order;