import decorator from './decorator';

describe('atoms/highlight/decorator', () => {
	it('decorates string using decorators', () => {
		const input = 'Something something @mention, something #keyword something.';
		const decorators = {
			'@': jest.fn(() => 'decorated-at'),
			'#': jest.fn(() => 'decorated-hashtag'),
		};

		const output = decorator(input, decorators);

		expect(decorators['@']).toHaveBeenCalledWith('@mention', 'mention', 1);
		expect(decorators['#']).toHaveBeenCalledWith('#keyword', 'keyword', 3);
		expect(output)
			.toHaveLength(5)
			.toContain('Something something ')
			.toContain('decorated-at')
			.toContain(', something ')
			.toContain('decorated-hashtag')
			.toContain(' something.');
	});

	it('decorates string without decorator matches', () => {
		const input = 'Something something mention, something keyword something.';
		const decorators = {
			'@': jest.fn(() => 'decorated-at'),
			'#': jest.fn(() => 'decorated-hashtag'),
		};

		const output = decorator(input, decorators);

		expect(decorators['@']).not.toHaveBeenCalled();
		expect(decorators['#']).not.toHaveBeenCalled();
		expect(output)
			.toHaveLength(1)
			.toContain(input);
	});
});
