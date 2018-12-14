import React from 'react';
import PropTypes from 'prop-types';
import decorator from './decorator';
import { HighlightContainer } from './elements';

export default function HighlightAtom(props) {
	return (
		<HighlightContainer>
			{decorator(props.children, props.decorators)}
		</HighlightContainer>
	);
}

HighlightAtom.propTypes = {
	/** The text to highlight with the decorators. */
	children: PropTypes.string.isRequired,
	/** All decorators with their starting character. */
	decorators: PropTypes.object.isRequired,
};
