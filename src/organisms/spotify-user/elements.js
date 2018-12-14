import styled from 'styled-components/macro';

/**
 * This element styles a mention in the user description, which links to this organization or user.
 */
export const GithubUserMentionHighlight = styled.a`
	text-decoration: none;
	color: #24292e;
	font-weight: 600;

	&:hover {
		text-decoration: underline;
	}
`;

/**
 * This element styles a particular keyword, starting with a character, in the user description.
 */
export const GithubUserKeywordHighlight = styled.strong`
	color: #24292e;
	font-weight: 600;
`;
