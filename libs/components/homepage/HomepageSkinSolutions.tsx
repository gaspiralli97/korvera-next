import React, { useState } from 'react';
import Link from 'next/link';
import { Stack, Box, Typography } from '@mui/material';
import { SkinType } from '../../enums/product.enum';

const SOLUTIONS = [
	{
		type: SkinType.DRY,
		label: 'Dry Skin',
		headline: 'Deep Hydration Ritual',
		desc: 'Restore the skin barrier with rich, nourishing formulas that lock in moisture throughout the day.',
		steps: ['Gentle Cream Cleanser', 'Hydrating Toner', 'Barrier Repair Serum', 'Rich Moisturiser'],
		image: '/img/fiber/img1.jpg',
		accent: '#8B6914',
	},
	{
		type: SkinType.OILY,
		label: 'Oily Skin',
		headline: 'Balance & Clarity',
		desc: 'Control excess sebum and minimise pores with lightweight, non-comedogenic formulas.',
		steps: ['Foam Cleanser', 'BHA Toner', 'Niacinamide Serum', 'Oil-Free Moisturiser'],
		image: '/img/fiber/img6.jpg',
		accent: '#3A5C38',
	},
	{
		type: SkinType.SENSITIVE,
		label: 'Sensitive Skin',
		headline: 'Calm & Soothe',
		desc: 'Fragrance-free, dermatologist-tested formulas that reduce redness and strengthen skin resilience.',
		steps: ['Micellar Cleanser', 'Calming Essence', 'Centella Serum', 'Soothing Cream'],
		image: '/img/fiber/img7.jpg',
		accent: '#6B2D45',
	},
	{
		type: SkinType.COMBINATION,
		label: 'Combination',
		headline: 'Balance in Two Zones',
		desc: 'Address oily T-zones and dry cheeks with targeted multi-zone skincare routines.',
		steps: ['Balancing Cleanser', 'Exfoliating Toner', 'Lightweight Serum', 'Dual-Zone Moisturiser'],
		image: '/img/fiber/img4.jpg',
		accent: '#2C5F7A',
	},
];

const HomepageSkinSolutions = () => {
	const [active, setActive] = useState(0);
	const current = SOLUTIONS[active];

	return (
		<Stack className={'hp-skin-solutions'}>
			<Stack className={'container'}>
				<Typography className={'hp-section-eyebrow'}>Skin Solutions</Typography>
				<Typography className={'hp-section-title'}>Find Your Routine</Typography>

				{/* Skin type tabs */}
				<Box className={'hp-skin-tabs'}>
					{SOLUTIONS.map((s, i) => (
						<button
							key={s.type}
							className={`hp-skin-tab${active === i ? ' active' : ''}`}
							onClick={() => setActive(i)}
						>
							{s.label}
						</button>
					))}
				</Box>

				{/* Active solution panel */}
				<Box className={'hp-skin-panel'}>
					<Box className={'hp-skin-panel-img'} style={{ backgroundImage: `url(${current.image})` }} />
					<Box className={'hp-skin-panel-content'}>
						<span className={'hp-skin-headline'}>{current.headline}</span>
						<p className={'hp-skin-desc'}>{current.desc}</p>
						<Box className={'hp-skin-steps'}>
							{current.steps.map((step, i) => (
								<Box key={step} className={'hp-skin-step'}>
									<span className={'hp-skin-step-num'}>0{i + 1}</span>
									<span className={'hp-skin-step-name'}>{step}</span>
								</Box>
							))}
						</Box>
						<Link href={`/product?skinType=${current.type}`}>
							<button className={'hp-solid-btn'} style={{ backgroundColor: current.accent }}>
								Shop This Routine
							</button>
						</Link>
					</Box>
				</Box>
			</Stack>
		</Stack>
	);
};

export default HomepageSkinSolutions;
