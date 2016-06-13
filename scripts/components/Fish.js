/**
 * Import framework
 */
import React from 'react';
import h from '../helpers';

/**
 * Fish
 * @renderTag <Fish />
 */

var Fish = React.createClass({
	
	propTypes: {
 		addToOrder: React.PropTypes.func.isRequired,
 		details: React.PropTypes.object.isRequired,
 		index: React.PropTypes.string.isRequired
 	},

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
 * Export
 */
export default Fish;