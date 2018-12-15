import styled from 'styled-components';

import NumberInput from 'src/atoms/input-number';

export const Label = styled.label`
	font-weight: bold;
	margin: 1rem 0;
`;

export const InputNumber = styled(NumberInput)`
	input {
		text-align: center;
	}
`;
