/**
 * Import framework
 */
import React from 'react';

/**
 * Add fish form
 * @rendertag <AddFishForm />
 */
var AddFishForm = React.createClass({

	propTypes: {
 		addFishToMenu: React.PropTypes.func.isRequired
 	},

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
		this.props.addFishToMenu(oFish);
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
 * Export
 */
export default AddFishForm;