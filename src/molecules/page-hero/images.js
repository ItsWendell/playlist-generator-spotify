export const images = [
	'https://images.unsplash.com/photo-1511233002817-99325d7cc2d6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2000&q=60',
	'https://images.unsplash.com/photo-1532354058425-ba7ccc7e4a24?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2000&q=60',
	'https://images.unsplash.com/photo-1535925191244-17536ca4f8b6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2000&q=60',
	'https://images.unsplash.com/photo-1504509546545-e000b4a62425?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2000&q=60',
	'https://images.unsplash.com/photo-1511138743687-5c14e8cfcf47?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2000&q=50',
	'https://images.unsplash.com/photo-1527150122806-f682d2fd8b09?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=60'
];

export function getRandomImage() {
	return images[Math.floor(Math.random() * images.length)]
}
