import React from 'react';
import { Stack, Box, Typography } from '@mui/material';

const REVIEWS = [
	{
		id: 'r1',
		name: 'Sarah K.',
		location: 'New York',
		rating: 5,
		product: 'Hydra Boost Serum',
		brand: 'Lumière',
		text: 'I have tried countless serums over the years, but this one genuinely transformed my skin within two weeks. My dryness is completely gone and my skin looks plump.',
		date: 'March 2025',
		avatar: 'S',
	},
	{
		id: 'r2',
		name: 'Ji-yeon P.',
		location: 'Los Angeles',
		rating: 5,
		product: 'Advanced Snail 96 Mucin Essence',
		brand: 'COSRX',
		text: 'As someone with combination skin, finding the right essence was a struggle. This absorbs immediately, never feels sticky, and my pores look significantly smaller after a month.',
		date: 'February 2025',
		avatar: 'J',
	},
	{
		id: 'r3',
		name: 'Emma R.',
		location: 'London',
		rating: 5,
		product: 'Water Sleeping Mask',
		brand: 'Laneige',
		text: 'I wake up every morning with the softest skin. This has become an essential part of my nightly routine. The subtle scent is calming and the texture is like a dream.',
		date: 'January 2025',
		avatar: 'E',
	},
	{
		id: 'r4',
		name: 'Mia T.',
		location: 'Sydney',
		rating: 4,
		product: 'Green Tea Seed Serum',
		brand: 'Innisfree',
		text: 'Lightweight yet effective. Perfect for Australia\'s humid climate. My oily T-zone is much more manageable and my overall complexion is brighter. Highly recommend.',
		date: 'March 2025',
		avatar: 'M',
	},
];

const Stars = ({ count }: { count: number }) => (
	<Box className={'hp-review-stars'}>
		{[1, 2, 3, 4, 5].map((i) => (
			<span key={i} className={i <= count ? 'star filled' : 'star'}>★</span>
		))}
	</Box>
);

const HomepageReviews = () => {
	return (
		<Stack className={'hp-reviews'}>
			<Stack className={'container'}>
				<Box className={'hp-reviews-header'}>
					<Typography className={'hp-section-eyebrow'}>Customer Stories</Typography>
					<Typography className={'hp-section-title'}>Real People, Real Results</Typography>
				</Box>
				<Box className={'hp-reviews-grid'}>
					{REVIEWS.map((r) => (
						<Box key={r.id} className={'hp-review-card'}>
							<Stars count={r.rating} />
							<p className={'hp-review-text'}>{r.text}</p>
							<Box className={'hp-review-product'}>
								<span className={'hp-review-product-brand'}>{r.brand}</span>
								<span className={'hp-review-product-name'}>{r.product}</span>
							</Box>
							<Box className={'hp-review-author'}>
								<Box className={'hp-review-avatar'}>{r.avatar}</Box>
								<Box>
									<span className={'hp-review-name'}>{r.name}</span>
									<span className={'hp-review-location'}>{r.location} · {r.date}</span>
								</Box>
							</Box>
						</Box>
					))}
				</Box>
			</Stack>
		</Stack>
	);
};

export default HomepageReviews;
