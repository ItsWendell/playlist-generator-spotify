import styled from 'styled-components/macro';

/**
 * The user container defines some basic styling for all elements inside.
 */
export const UserContainer = styled.div`
	color: #6a737d;
`;

/**
 * The user container meta element splits the screen in half and put the avatar and user in this half.
 * It creates some emphasis on the user's name and also allows extra information without affecting this positioning.
 */
export const UserContainerMeta = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-end;
`;

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
