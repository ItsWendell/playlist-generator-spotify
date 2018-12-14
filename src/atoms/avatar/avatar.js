import React from 'react';
import PropTypes from 'prop-types';
import { AvatarContainer, AvatarImage } from './elements';

export default function AvatarAtom(props) {
	return (
		<AvatarContainer>
			<AvatarImage
				src={props.url}
				alt={props.name}
				title={props.title}
			/>
		</AvatarContainer>
	);
}

AvatarAtom.propTypes = {
	/** The absolute URL to the image. */
	url: PropTypes.string.isRequired,
	/** The name of the person who is displayed, to use as the alternative text for the image. */
	name: PropTypes.string.isRequired,
	/** The title to display when hovering the avatar. */
	title: PropTypes.string,
};

AvatarAtom.defaultProps = {
	title: undefined,
};
