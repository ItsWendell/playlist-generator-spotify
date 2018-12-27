import styled from 'styled-components';

import NumberInput from 'src/atoms/input-number';

export const Label = styled.label`
	font-weight: bold;
`;

export const InputNumber = styled(NumberInput)`
	input {
		text-align: center;
	}
`;
