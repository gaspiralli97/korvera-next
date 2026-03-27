import React from 'react';
import Link from 'next/link';
import { Stack, Box, Typography } from '@mui/material';

const BRANDS = [
	{ name: 'Sulwhasoo', origin: 'Seoul', tagline: 'Timeless Korean beauty', image: '/img/korvera/header1.jpg' },
	{ name: 'Laneige', origin: 'Seoul', tagline: 'Water science skincare', image: '/img/fiber/img1.jpg' },
	{ name: 'COSRX', origin: 'Seoul', tagline: 'Targeted skin solutions', image: '/img/events/skincare.jpg' },
	{ name: 'Innisfree', origin: 'Jeju', tagline: 'Pure island nature', image: '/img/fiber/img6.jpg' },
	{ name: 'Some By Mi', origin: 'Seoul', tagline: '30 days miracle', image: '/img/korvera/header4.jpg' },
	{ name: 'Missha', origin: 'Seoul', tagline: 'Premium innovation', image: '/img/korvera/homepage.jpg' },
	{ name: 'The Face Shop', origin: 'Seoul', tagline: 'Nature & science', image: '/img/korvera/heaader3.jpg' },
	{ name: 'AHC', origin: 'Seoul', tagline: 'Professional clinic care', image: '/img/fiber/img3.jpg' },
	{ name: 'Benton', origin: 'Seoul', tagline: 'Clean gentle skincare', image: '/img/korvera/productpage.jpg' },
	{ name: 'Klairs', origin: 'Seoul', tagline: 'Simple & sensitive', image: '/img/fiber/img7.jpg' },
];

const HomepageBrands = () => {
	return (
		<Stack className={'hp-brands'}>
			<Stack className={'container'}>
				<Typography className={'hp-section-eyebrow'}>Featured Brands</Typography>
				<Typography className={'hp-section-title'}>Korean Beauty, Curated</Typography>
				<Box component={'div'} className={'hp-brands-grid'}>
					{BRANDS.map((brand) => (
						<Link key={brand.name} href={`/product?brand=${encodeURIComponent(brand.name)}`}>
							<Box className={'hp-brand-tile'}>
								<Box className={'hp-brand-img'} style={{ backgroundImage: `url(${brand.image})` }} />
								<Box className={'hp-brand-info'}>
									<span className={'hp-brand-name'}>{brand.name}</span>
									<span className={'hp-brand-tagline'}>{brand.tagline}</span>
								</Box>
							</Box>
						</Link>
					))}
				</Box>
			</Stack>
		</Stack>
	);
};

export default HomepageBrands;
