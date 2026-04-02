import React from 'react';
import Link from 'next/link';
import { Stack, Box, Typography } from '@mui/material';
import { ProductCategory } from '../../enums/product.enum';
import useDeviceDetect from '../../hooks/useDeviceDetect';

const CATEGORIES = [
	{ label: 'Skincare', value: ProductCategory.SKINCARE, image: '/img/korvera/skincare.jpg', desc: 'Cleanse, treat, protect' },
	{ label: 'Makeup', value: ProductCategory.MAKEUP, image: '/img/korvera/make-up.avif', desc: 'Colour, refined' },
	{ label: 'Haircare', value: ProductCategory.HAIRCARE, image: '/img/korvera/haircare.jpg', desc: 'Nourish & restore' },
	{ label: 'Bodycare', value: ProductCategory.BODYCARE, image: '/img/korvera/bodycare.jpg', desc: 'Head to toe rituals' },
	{ label: 'Fragrance', value: ProductCategory.FRAGRANCE, image: '/img/korvera/fragrance.jpg', desc: 'Scent as identity' },
	{ label: 'Wellness', value: ProductCategory.WELLNESS, image: '/img/korvera/wellness.jpg', desc: 'Beauty from within' },
];

const HomepageCategories = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Stack className={'mob-hp-categories'}>
				<Typography className={'mob-section-title'}>Shop by Category</Typography>
				<Box className={'mob-cat-scroll'}>
					{CATEGORIES.map((cat) => (
						<Link
							key={cat.value}
							href={`/product?input=${encodeURIComponent(JSON.stringify({ page: 1, limit: 9, sort: 'createdAt', direction: 'DESC', search: { categoryList: [cat.value] } }))}`}
						>
							<Box className={'mob-cat-item'}>
								<Box
									className={'mob-cat-circle'}
									style={{ backgroundImage: `url(${cat.image})` }}
								/>
								<span className={'mob-cat-label'}>{cat.label}</span>
							</Box>
						</Link>
					))}
				</Box>
			</Stack>
		);
	}

	return (
		<Stack className={'hp-categories'}>
			<Stack className={'container'}>
				<Typography className={'hp-section-eyebrow'}>Shop by Category</Typography>
				<Box className={'hp-cat-grid'}>
					{CATEGORIES.map((cat) => (
						<Link key={cat.value} href={`/product?input=${encodeURIComponent(JSON.stringify({ page: 1, limit: 9, sort: 'createdAt', direction: 'DESC', search: { categoryList: [cat.value] } }))}`}>
							<Box className={'hp-cat-tile'}>
								<Box className={'hp-cat-img'} style={{ backgroundImage: `url(${cat.image})` }} />
								<Box className={'hp-cat-info'}>
									<span className={'hp-cat-label'}>{cat.label}</span>
									<span className={'hp-cat-desc'}>{cat.desc}</span>
								</Box>
							</Box>
						</Link>
					))}
				</Box>
			</Stack>
		</Stack>
	);
};

export default HomepageCategories;
