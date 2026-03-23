import React, { useRef, useState } from 'react';
import { Stack, Box, Typography } from '@mui/material';

const CASES = [
	{
		id: 'ba-1',
		product: 'Advanced Snail 96 Mucin Essence',
		brand: 'COSRX',
		duration: '4 weeks',
		before: '/img/fiber/img8.jpg',
		after: '/img/events/skincare.jpg',
		result: 'Visibly reduced texture and improved skin radiance',
	},
	{
		id: 'ba-2',
		product: 'Vitamin C Brightening Cream',
		brand: 'Rosé Edit',
		duration: '6 weeks',
		before: '/img/fiber/img3.jpg',
		after: '/img/fiber/img6.jpg',
		result: 'Significant brightening and even skin tone',
	},
	{
		id: 'ba-3',
		product: 'Hydra Boost Serum',
		brand: 'Lumière',
		duration: '3 weeks',
		before: '/img/fiber/img7.jpg',
		after: '/img/fiber/img1.jpg',
		result: 'Deep hydration, plumper and smoother skin',
	},
];

const BeforeAfterCard = ({ item }: { item: typeof CASES[0] }) => {
	const [dragging, setDragging] = useState(false);
	const [pos, setPos] = useState(50); // percentage 0-100
	const wrapRef = useRef<HTMLDivElement>(null);

	const updatePos = (clientX: number) => {
		const rect = wrapRef.current?.getBoundingClientRect();
		if (!rect) return;
		const pct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
		setPos(pct);
	};

	const onMouseMove = (e: React.MouseEvent) => { if (dragging) updatePos(e.clientX); };
	const onTouchMove = (e: React.TouchEvent) => updatePos(e.touches[0].clientX);

	return (
		<Box className={'ba-card'}>
			<Box
				ref={wrapRef}
				className={'ba-slider'}
				onMouseMove={onMouseMove}
				onMouseUp={() => setDragging(false)}
				onMouseLeave={() => setDragging(false)}
				onTouchMove={onTouchMove}
				onTouchEnd={() => setDragging(false)}
			>
				{/* After image — full width, behind */}
				<Box className={'ba-img ba-img--after'} style={{ backgroundImage: `url(${item.after})` }}>
					<span className={'ba-label ba-label--after'}>After</span>
				</Box>

				{/* Before image — clipped to left of slider */}
				<Box
					className={'ba-img ba-img--before'}
					style={{ backgroundImage: `url(${item.before})`, clipPath: `inset(0 ${100 - pos}% 0 0)` }}
				>
					<span className={'ba-label ba-label--before'}>Before</span>
				</Box>

				{/* Drag handle */}
				<Box
					className={'ba-handle'}
					style={{ left: `${pos}%` }}
					onMouseDown={() => setDragging(true)}
					onTouchStart={() => setDragging(true)}
				>
					<Box className={'ba-handle-line'} />
					<Box className={'ba-handle-knob'}>
						<span>{'‹'}</span>
						<span>{'›'}</span>
					</Box>
				</Box>
			</Box>

			<Box className={'ba-meta'}>
				<span className={'ba-brand'}>{item.brand}</span>
				<span className={'ba-product'}>{item.product}</span>
				<span className={'ba-result'}>{item.result}</span>
				<span className={'ba-duration'}>{item.duration} results</span>
			</Box>
		</Box>
	);
};

const BeforeAfter = () => {
	return (
		<Stack className={'hp-before-after'}>
			<Stack className={'container'}>
				<Box className={'hp-ba-header'}>
					<Typography className={'hp-section-eyebrow'}>Real Results</Typography>
					<Typography className={'hp-section-title'}>Before & After</Typography>
					<p className={'hp-ba-subtitle'}>
						Drag the slider to reveal real customer transformations.
					</p>
				</Box>
				<Box className={'hp-ba-grid'}>
					{CASES.map((item) => (
						<BeforeAfterCard key={item.id} item={item} />
					))}
				</Box>
			</Stack>
		</Stack>
	);
};

export default BeforeAfter;
