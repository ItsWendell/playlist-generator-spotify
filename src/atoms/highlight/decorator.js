/**
 * Create a decorator pattern based on starting characters.
 *
 * @param  {string[]}
 * @return {RegExp}
 */
export const createPattern = (chars) => (
	new RegExp(`([${chars.join('')}][a-z0-9-_]+)`, 'gi')
);

/**
 * Create a list of segments relevant to the decorators.
 *
 * @param  {string} text
 * @param  {Object} decorators
 * @return {string[]}
 */
export const createSegments = (text, decorators) => (
	text.split(createPattern(Object.keys(decorators)))
);

/**
 * Apply one of the decorators to a single segment.
 * It will invoke a decorator with the matched segment, inner text, and an optional key.
 *
 * @param  {string} segment
 * @param  {Object} decorators
 * @param  {string|number} [key]
 * @return {string|ReactNode}
 */
export const applyDecorator = (segment, decorators, key = undefined) => {
	const decorator = decorators[segment.charAt(0)];

	return decorator
		? decorator(segment, segment.substr(1), key)
		: segment;
};

/**
 * Decorate a string and return a list of text or components.
 * These can be rendered directly with React.
 *
 * @param  {string} text
 * @param  {Object} decorators
 * @return {(string|ReactNode)[]}
 */
export default (text, decorators) => (
	createSegments(text, decorators).map(
		(segment, key) => applyDecorator(segment, decorators, key)
	)
);
