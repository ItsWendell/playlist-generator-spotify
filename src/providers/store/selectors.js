import { PENDING, FULFILLED, REJECTED } from 'redux-promise-middleware';

/**
 * Determine if a request is loading or pending using the status.
 *
 * @param  {string} status
 * @return {boolean}
 */
export const isPending = status => status === PENDING;

/**
 * Determine if a request has failed using the status.
 *
 * @param  {string} status
 * @return {boolean}
 */
export const isRejected = status => status === REJECTED;

/**
 * Determine if a request is successful using the status.
 *
 * @param  {string} status
 * @return {boolean}
 */
export const isFulfilled = status => status === FULFILLED;

/**
 * Check if the provided response contains any validation errors.
 *
 * @param  {Object?} response
 * @return {boolean}
 */
export const responseHasErrors = response =>
	response &&
	response.data &&
	response.data.errors &&
	Object.values(response.data.errors).length > 0;

/**
 * Get response errors from an actual received response.
 * An object containing parameter names as keys and all messages as value is returned.
 * Note that this method only returns an object when error messages are found.
 *
 * @param  {Object?} response
 * @return {Object?}
 */
export const responseErrors = response =>
	responseHasErrors(response) ? response.data.errors : undefined;

/**
 * Get a list of all response validation errors.
 * Note that this method always returns an array, either with or without errors.
 *
 * @param  {Object?} response
 * @return {string[]}
 */
export const responseErrorsList = response =>
	responseHasErrors(response)
		? Object.values(response.data.errors).flatten()
		: [];

/**
 * Get all response validation errors for a single attribute or parameter.
 * Note that this method always returns an array, either with or without errors.
 *
 * @param  {Object?} response
 * @param  {string} attribute
 * @return {string[]}
 */
export const responseErrorsFor = (response, attribute) =>
	(responseHasErrors(response) ? response.data.errors[attribute] : undefined) ||
	[];

/**
 * Determine if the attribute contains a response error.
 *
 * @param  {Object?} response
 * @param  {string} attribute
 * @return {boolean}
 */
export const responseHasErrorsFor = (response, attribute) =>
	responseErrorsFor(response, attribute).length > 0;
