import React from 'react';
import 'styled-components/macro';

import Row from 'src/molecules/row';
import Col from 'src/molecules/col';

export default function PageHeader({ logo, children }) {
	return (
		<Row gutter={16} type="flex" align="middle" justify="space-between" css="height: 100%;">
			<Col span={8}>
				{ logo }
			</Col>
			<Col span={16} css="text-align: right">
				{ children }
			</Col>
		</Row>
	)
}
