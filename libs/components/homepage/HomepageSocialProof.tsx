import React, { useRef, useState } from 'react';
import { Stack, Box, Typography } from '@mui/material';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper';

// ── Before & After data ──────────────────────────────────────────────────────
const CASES = [
	{
		id: 'ba-1',
		product: 'Advanced Snail 96 Mucin Essence',
		brand: 'COSRX',
		duration: '4 weeks',
		before: '/img/korvera/header1.jpg',
		after: '/img/korvera/header4.jpg',
		result: 'Visibly reduced texture and improved skin radiance',
	},
	{
		id: 'ba-2',
		product: 'Vitamin C Brightening Cream',
		brand: 'Rosé Edit',
		duration: '6 weeks',
		before: '/img/korvera/heaader3.jpg',
		after: '/img/korvera/homepage.jpg',
		result: 'Significant brightening and even skin tone',
	},
	{
		id: 'ba-3',
		product: 'Hydra Boost Serum',
		brand: 'Lumière',
		duration: '3 weeks',
		before: '/img/korvera/mypage.jpg',
		after: '/img/korvera/productpage.jpg',
		result: 'Deep hydration, plumper and smoother skin',
	},
	{
		id: 'ba-4',
		product: 'Water Sleeping Mask',
		brand: 'Laneige',
		duration: '5 weeks',
		before: '/img/korvera/sellerpage.jpg',
		after: '/img/korvera/communitypage.jpg',
		result: 'Overnight repair, visibly smoother skin by morning',
	},
];

// ── Reviews data ─────────────────────────────────────────────────────────────
const REVIEWS = [
	{
		id: 'r1',
		name: 'Sarah K.',
		location: 'New York',
		rating: 5,
		product: 'Hydra Boost Serum',
		brand: 'Lumière',
		skinType: 'Dry skin',
		text: 'This serum transformed my skin within two weeks. My dryness is completely gone and my face looks visibly plumper every morning.',
		date: 'March 2025',
		avatar: 'S',
		color: '#C9A96E',
	},
	{
		id: 'r2',
		name: 'Ji-yeon P.',
		location: 'Los Angeles',
		rating: 5,
		product: 'Advanced Snail 96 Mucin Essence',
		brand: 'COSRX',
		skinType: 'Combination skin',
		text: 'Absorbs instantly, never sticky. My pores look significantly smaller after just one month of use. Worth every penny.',
		date: 'February 2025',
		avatar: 'J',
		color: '#7B9E7B',
	},
	{
		id: 'r3',
		name: 'Emma R.',
		location: 'London',
		rating: 5,
		product: 'Water Sleeping Mask',
		brand: 'Laneige',
		skinType: 'Normal skin',
		text: 'I wake up with the softest skin every morning. The texture is incredible and the calming scent makes my nighttime routine feel luxurious.',
		date: 'January 2025',
		avatar: 'E',
		color: '#A67C9B',
	},
	{
		id: 'r4',
		name: 'Mia T.',
		location: 'Sydney',
		rating: 4,
		product: 'Green Tea Seed Serum',
		brand: 'Innisfree',
		skinType: 'Oily skin',
		text: 'Lightweight and effective. My oily T-zone is much more manageable and my complexion is noticeably brighter after three weeks.',
		date: 'March 2025',
		avatar: 'M',
		color: '#5C8A6E',
	},
	{
		id: 'r5',
		name: 'Yuna H.',
		location: 'Seoul',
		rating: 5,
		product: 'AHA/BHA Clarifying Treatment Toner',
		brand: 'Some By Mi',
		skinType: 'Acne-prone skin',
		text: 'My breakouts reduced dramatically in the first two weeks. This is genuinely the best toner I have ever used for acne-prone skin.',
		date: 'April 2025',
		avatar: 'Y',
		color: '#8B7355',
	},
	{
		id: 'r6',
		name: 'Camille D.',
		location: 'Paris',
		rating: 5,
		product: 'First Care Activating Serum',
		brand: 'Sulwhasoo',
		skinType: 'Sensitive skin',
		text: 'My sensitive skin has never felt this balanced. A true luxury product that actually delivers on its promises. Reordering immediately.',
		date: 'February 2025',
		avatar: 'C',
		color: '#9B7B5C',
	},
	{
		id: 'r7',
		name: 'Aisha M.',
		location: 'Dubai',
		rating: 4,
		product: 'Eye Cream EX',
		brand: 'AHC',
		skinType: 'All skin types',
		text: 'The fine lines around my eyes have visibly softened. I apply it morning and night — the texture is rich but absorbs quickly with no residue.',
		date: 'March 2025',
		avatar: 'A',
		color: '#7A8BA0',
	},
	{
		id: 'r8',
		name: 'Hana L.',
		location: 'Toronto',
		rating: 5,
		product: 'Moisture Surge Cream',
		brand: 'Klairs',
		skinType: 'Dry & sensitive',
		text: 'Fragrance-free and gentle enough for my reactive skin. My face stays hydrated all day even in harsh Canadian winters. A holy grail.',
		date: 'January 2025',
		avatar: 'H',
		color: '#8A9E8A',
	},
];

// ── Before & After slider card ────────────────────────────────────────────────
const BeforeAfterCard = ({ item }: { item: typeof CASES[0] }) => {
	const [dragging, setDragging] = useState(false);
	const [pos, setPos] = useState(50);
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
		<Stack className={'ba-card'}>
			<Box
				ref={wrapRef}
				className={'ba-slider'}
				onMouseMove={onMouseMove}
				onMouseUp={() => setDragging(false)}
				onMouseLeave={() => setDragging(false)}
				onTouchMove={onTouchMove}
				onTouchEnd={() => setDragging(false)}
			>
				<Box className={'ba-img ba-img--after'} style={{ backgroundImage: `url(${item.after})` }}>
					<span className={'ba-label ba-label--after'}>After</span>
				</Box>
				<Box
					className={'ba-img ba-img--before'}
					style={{ backgroundImage: `url(${item.before})`, clipPath: `inset(0 ${100 - pos}% 0 0)` }}
				>
					<span className={'ba-label ba-label--before'}>Before</span>
				</Box>
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
			<Box component={'div'} className={'ba-info'}>
				<strong className={'ba-product'}>{item.product}</strong>
				<p className={'ba-result'}>{item.result}</p>
				<div className={'ba-bott'}>
					<span className={'ba-brand'}>{item.brand}</span>
					<span className={'ba-duration'}>{item.duration}</span>
				</div>
			</Box>
		</Stack>
	);
};

// ── Review card (product card dimensions) ────────────────────────────────────
const ReviewCard = ({ r }: { r: typeof REVIEWS[0] }) => (
	<Stack className={'rv-card'}>
		<Box className={'rv-card-top'} style={{ backgroundColor: r.color }}>
			<Box className={'rv-avatar'}>{r.avatar}</Box>
			<Box className={'rv-stars'}>
				{[1, 2, 3, 4, 5].map((i) => (
					<span key={i} className={i <= r.rating ? 'star filled' : 'star'}>★</span>
				))}
			</Box>
			<span className={'rv-skin-type'}>{r.skinType}</span>
		</Box>
		<Box component={'div'} className={'rv-info'}>
			<strong className={'rv-name'}>{r.name}</strong>
			<p className={'rv-text'}>{r.text}</p>
			<div className={'rv-bott'}>
				<span className={'rv-product'}>{r.product}</span>
				<span className={'rv-location'}>{r.location}</span>
			</div>
		</Box>
	</Stack>
);

// ── Combined Social Proof section ─────────────────────────────────────────────
const HomepageSocialProof = () => {
	return (
		<Stack className={'hp-social-proof'}>

			{/* Before & After */}
			<Stack className={'container'}>
				<Stack className={'info-box'}>
					<Box component={'div'} className={'left'}>
						<span>Before & After</span>
						<p>Real customer transformations</p>
					</Box>
					<Box component={'div'} className={'right'}>
						<div className={'pagination-box'}>
							<WestIcon className={'swiper-ba-prev'} />
							<div className={'swiper-ba-pagination'}></div>
							<EastIcon className={'swiper-ba-next'} />
						</div>
					</Box>
				</Stack>
				<Stack className={'card-box'}>
					<Swiper
						className={'ba-swiper'}
						slidesPerView={4}
						spaceBetween={15}
						modules={[Navigation, Pagination]}
						navigation={{
							nextEl: '.swiper-ba-next',
							prevEl: '.swiper-ba-prev',
						}}
						pagination={{
							el: '.swiper-ba-pagination',
						}}
					>
						{CASES.map((item) => (
							<SwiperSlide key={item.id} className={'ba-slide'}>
								<BeforeAfterCard item={item} />
							</SwiperSlide>
						))}
					</Swiper>
				</Stack>
			</Stack>

			{/* Reviews */}
			<Box className={'hp-sp-reviews'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Real People, Real Results</span>
							<p>Verified customer reviews</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'pagination-box'}>
								<WestIcon className={'swiper-rv-prev'} />
								<div className={'swiper-rv-pagination'}></div>
								<EastIcon className={'swiper-rv-next'} />
							</div>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'rv-swiper'}
							slidesPerView={4}
							spaceBetween={15}
							modules={[Navigation, Pagination]}
							navigation={{
								nextEl: '.swiper-rv-next',
								prevEl: '.swiper-rv-prev',
							}}
							pagination={{
								el: '.swiper-rv-pagination',
							}}
						>
							{REVIEWS.map((r) => (
								<SwiperSlide key={r.id} className={'rv-slide'}>
									<ReviewCard r={r} />
								</SwiperSlide>
							))}
						</Swiper>
					</Stack>
				</Stack>
			</Box>

		</Stack>
	);
};

export default HomepageSocialProof;
