import React from 'react';

import {
	Image,
	ContentOverlay,
	CoverContainer,
	ContentDetails,
	ArtistDetail,
	NameDetail,
	CloseIcon,
	CloseDiv,
} from './elements';

export default function Cover(props) {
	return (
		<CoverContainer className={props.className} target="_blank" href={props.href}>
			<figure>
				<Image src={props.cover} />
				<ContentOverlay>
					{props.onClose && (
						<CloseDiv>
							<CloseIcon onClick={(event) => {
								event.preventDefault();
								event.stopPropagation();
								props.onClose && props.onClose(props.id);
							}} type="close" />
						</CloseDiv>
					)}
					<ContentDetails>
						<NameDetail>{props.name}</NameDetail>
						<ArtistDetail>{props.artist}</ArtistDetail>
					</ContentDetails>
				</ContentOverlay>
			</figure>
		</CoverContainer>
	);
}
