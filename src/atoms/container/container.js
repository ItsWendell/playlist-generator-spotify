import styled from 'styled-components';

export default styled.div`
	margin-right: auto;
	margin-left: auto;
	padding-left: 15px;
	padding-right: 15px;

	${props => props.center && `
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	`}

	@media (min-width: 768px) {
	    width: 750px;
	}

	@media (min-width: 992px) {
	    width: 970px;
	}

	@media (min-width: 1200px) {
		width: 1170px;
	}
`;
