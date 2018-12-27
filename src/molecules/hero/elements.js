import styled from 'styled-components/macro';
import { getRandomImage } from './images';

/**
 * The user container defines some basic styling for all elements inside.
 */
export const HeroContainer = styled.div`
	position: relative;
	height: ${props => props.fullPage ? '100vh' : '30vh'};
	min-height: 18rem;
	color: white;
	flex-direction: column;
	background: #191414;
	overflow: hidden;
	display: flex;
    align-items: center;
    justify-content: center;

	* {
		z-index: 1;
		align-items: center;
	}

	:after {
		content: "";
    	display: block;
    	position: absolute;
    	top: 0;
    	left: 0;
    	width: 100%;
    	height: 100%;
    	background: url(${getRandomImage()});
    	opacity: .2;
    	background-position: 50%;
		background-size: cover;
	}
`;

/**
 * The user container meta element splits the screen in half and put the avatar and user in this half.
 * It creates some emphasis on the user's name and also allows extra information without affecting this positioning.
 */
export const HeroTitle = styled.h2`
	color: white;
	font-weight: bold;
`;

/**
 * The user container meta element splits the screen in half and put the avatar and user in this half.
 * It creates some emphasis on the user's name and also allows extra information without affecting this positioning.
 */

const HeroSubtitle = styled.h3`
	color: white;
`;

export { HeroSubtitle };


/**
 * The user container info element centers the user's description horizontally.
 * The length of this content does not affect the avatar and name positioning.
 */
export const UserContainerInfo = styled.div`
	display: flex;
	justify-content: center;
`;

/**
 * The user avatar creates a slightly bigger avatar for the user.
 * It's because this is the primary visual symbol of the user itself.
 */
export const UserAvatar = styled.div`
	padding: 0.5rem;
	font-size: 1.5em;
`;

/**
 * The user's name is increased in size and styled to style the title of the page.
 * It's because this is the actual human-identifiable information about the user.
 */
export const UserName = styled.h1`
	margin: 0;
	padding: 0.5rem;
	text-align: center;
	line-height: 1.5;
	color: #24292e;
	font-size: 2em;
`;

/**
 * The user's description is styled to make it a bit more readable and to have a max width.
 * This styling will create more visual coherence between the name and description.
 */
export const UserDescription = styled.div`
	margin: 0;
	padding: 0.5rem;
	max-width: 24em;
	text-align: center;
	line-height: 1.5;
`;
