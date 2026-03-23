import React from 'react';
import Link from 'next/link';
import { Stack, Box, Typography } from '@mui/material';
import { ProductCategory } from '../../enums/product.enum';

const CATEGORIES = [
	{ label: 'Skincare', value: ProductCategory.SKINCARE, image: '/img/events/skincare.jpg', desc: 'Cleanse, treat, protect' },
	{ label: 'Makeup', value: ProductCategory.MAKEUP, image: '/img/fiber/img2.jpg', desc: 'Colour, refined' },
	{ label: 'Haircare', value: ProductCategory.HAIRCARE, image: '/img/fiber/img3.jpg', desc: 'Nourish & restore' },
	{ label: 'Bodycare', value: ProductCategory.BODYCARE, image: '/img/fiber/img4.jpg', desc: 'Head to toe rituals' },
	{ label: 'Fragrance', value: ProductCategory.FRAGRANCE, image: '/img/fiber/img5.jpg', desc: 'Scent as identity' },
	{ label: 'Wellness', value: ProductCategory.WELLNESS, image: '/img/fiber/img1.jpg', desc: 'Beauty from within' },
];

const HomepageCategories = () => {
	return (
		<Stack className={'hp-categories'}>
			<Stack className={'container'}>
				<Typography className={'hp-section-eyebrow'}>Shop by Category</Typography>
				<Box className={'hp-cat-grid'}>
					{CATEGORIES.map((cat) => (
						<Link key={cat.value} href={`/product?productCategory=${cat.value}`}>
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
