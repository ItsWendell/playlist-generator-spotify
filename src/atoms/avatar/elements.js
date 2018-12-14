import styled from 'styled-components/macro';

/**
 * The avatar container "masks" the underlying image and makes it circular.
 * It creates an element with rounded corners with overflow hidden.
 */
export const AvatarContainer = styled.div`
	display: block;
	border-radius: 50%;
	background: currentColor;
	width: 3.75em;
	height: 3.75em;
	overflow: hidden;
	user-select: none;
`;

/**
 * The avatar image contains the actual image to display, set to fully "cover" the element.
 * To fully cover the avatar the image will be scaled and cropped maintaining aspect ratio.
 */
export const AvatarImage = styled.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
`;
