import styled from 'styled-components/macro';

/**
 * The user container defines some basic styling for all elements inside.
 */
export const Image = styled.img`
	width: 100%;
	height: 100%;
    object-fit: cover;
	display: block;
	vertical-align: middle;
`;

export const ContentOverlay = styled.div`
    transition: all 0.2s ease-in-out;
    background: rgba(0, 0, 0, 0.8);
    position: absolute;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
    bottom: 0;
	right: 0;
	opacity: 0;
`;

export const CoverContainer = styled.div`
	:hover {
		* {
			opacity: 1;
		}
	}

	figure {
		width: 100%;
    	height: 100%;
    	position: relative;
    	margin: auto;
    	overflow: hidden;
    	-webkit-box-shadow: 1px 1px 16px -2px rgba(0, 0, 0, 0.3);
    	box-shadow: 1px 1px 16px -2px rgba(0, 0, 0, 0.3);
    	cursor: pointer;
	}
`;

export const ContentDetails = styled.div`
    transform: translate(-50%, -50%);
    transition: all 0.2s ease-in-out 0s;
    position: absolute;
    text-align: center;
    padding-left: 1em;
    padding-right: 1em;
    width: 100%;
    top: 50%;
	left: 50%;
	opacity: 0;
`;

export const ArtistDetail = styled.h2`
	font-size: 16px;
    color: #919496;
`;

export const NameDetail = styled.h4`
	font-size: 14px;
	color: white;
	font-weight: 600;
`;
