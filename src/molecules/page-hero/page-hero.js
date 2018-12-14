import React from 'react';
import { HeroContainer } from './elements';

// https://images.unsplash.com/photo-1511233002817-99325d7cc2d6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2000&q=60
export default function PageHero({children, title, fullPage}) {
	return (
		<HeroContainer fullPage={fullPage}>
			{children}
		</HeroContainer>
	);
}
