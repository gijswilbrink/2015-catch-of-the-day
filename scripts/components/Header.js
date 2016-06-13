/**
 * Import framework
 */
import React from 'react';

/**
 * Header 
 * @rendertag  <Header />
 */
var Header = React.createClass({

 	propTypes: {
 		tagline: React.PropTypes.string.isRequired
 	},

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
 * Export
 */
export default Header;