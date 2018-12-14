import React from 'react';
import { mount } from 'enzyme';
import Avatar from './avatar';

describe('atoms/avatar/avatar', () => {
	it('renders an image element', () => {
		const component = mount(
			<Avatar
				url='https://github.com/bycedric.png'
				name='Cedric van Putten'
				title='Cedric van Putten - @byCedric'
			/>
		);

		expect(component.find('img'))
			.toExist()
			.toMatchSelector('[src="https://github.com/bycedric.png"]')
			.toMatchSelector('[alt="Cedric van Putten"]')
			.toMatchSelector('[title="Cedric van Putten - @byCedric"]')
	})
});
