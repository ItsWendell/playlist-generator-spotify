import React from 'react';
import { mount } from 'enzyme';
import Highlight from './highlight';

describe('atoms/highlight/highlight', () => {
	it('renders paragraph without decorator matches', () => {
		const text = 'This is my text without decorators.';
		const decorators = {
			'#': () => 'hashtag',
			'@': () => 'at',
		};

		const component = mount(
			<Highlight decorators={decorators}>
				{text}
			</Highlight>
		);

		expect(component.find('p'))
			.toExist()
			.toHaveText(text);
	});

	it('renders paragraph with decorator matches', () => {
		const text = 'This is my #text with @decorators.';
		const decorators = {
			'#': () => 'hashtag',
			'@': () => 'at',
		};

		const component = mount(
			<Highlight decorators={decorators}>
				{text}
			</Highlight>
		);

		expect(component.find('p'))
			.toExist()
			.toHaveText('This is my hashtag with at.');
	});

	it('renders paragraph with elements with decorator matches', () => {
		const text = 'This is my #text with @decorators.';
		const decorators = {
			'@': (text, _, key) => <a key={key} href='#'>{text}</a>,
		};

		const component = mount(
			<Highlight decorators={decorators}>
				{text}
			</Highlight>
		);

		expect(component.find('p'))
			.toExist()
			.toHaveText(text);

		expect(component.find('a'))
			.toExist()
			.toHaveText('@decorators')
			.toMatchSelector('[href="#"]');
	});
});
