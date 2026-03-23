import React from 'react';
import Link from 'next/link';
import { Stack, Box, Typography } from '@mui/material';

const BRANDS = [
	{ name: 'Sulwhasoo', origin: 'Seoul', tagline: 'Timeless Korean beauty' },
	{ name: 'Laneige', origin: 'Seoul', tagline: 'Water science skincare' },
	{ name: 'COSRX', origin: 'Seoul', tagline: 'Targeted skin solutions' },
	{ name: 'Innisfree', origin: 'Jeju', tagline: 'Pure island nature' },
	{ name: 'Some By Mi', origin: 'Seoul', tagline: '30 days miracle' },
	{ name: 'Missha', origin: 'Seoul', tagline: 'Premium innovation' },
	{ name: 'The Face Shop', origin: 'Seoul', tagline: 'Nature & science' },
	{ name: 'AHC', origin: 'Seoul', tagline: 'Professional clinic care' },
	{ name: 'Benton', origin: 'Seoul', tagline: 'Clean gentle skincare' },
	{ name: 'Klairs', origin: 'Seoul', tagline: 'Simple & sensitive' },
];

const HomepageBrands = () => {
	return (
		<Stack className={'hp-brands'}>
			<Stack className={'container'}>
				<Box className={'hp-brands-header'}>
					<Typography className={'hp-section-eyebrow'}>Featured Brands</Typography>
					<Typography className={'hp-section-title'}>Korean Beauty, Curated</Typography>
				</Box>
				<Box className={'hp-brands-grid'}>
					{BRANDS.map((brand) => (
						<Link key={brand.name} href={`/product?brand=${encodeURIComponent(brand.name)}`}>
							<Box className={'hp-brand-card'}>
								<span className={'hp-brand-name'}>{brand.name}</span>
								<span className={'hp-brand-origin'}>{brand.origin}</span>
								<span className={'hp-brand-tagline'}>{brand.tagline}</span>
							</Box>
						</Link>
					))}
				</Box>
				<Box className={'hp-brands-cta'}>
					<Link href={'/agent'}>
						<button className={'hp-outline-btn'}>View All Brands</button>
					</Link>
				</Box>
			</Stack>
		</Stack>
	);
};

export default HomepageBrands;
