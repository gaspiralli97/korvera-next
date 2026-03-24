import React, { useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarHalfIcon from '@mui/icons-material/StarHalf';

// ─── Static mock data ────────────────────────────────────────────────────────

const PRODUCT = {
	brand: 'SULWHASOO',
	title: 'First Care Activating Serum EX — Clarifying & Nourishing',
	rating: 4.5,
	reviewCount: 2847,
	likes: 12430,
	views: 58200,
	price: 98,
	volume: 90,
	category: 'SKINCARE',
	skinTypes: ['Normal', 'Dry', 'Combination'],
	description:
		'A luxurious first-step serum enriched with 5 Activating Botanicals — a proprietary blend of White Lily, Lotus, Rehmannia, Solomon\'s Seal, and Zingiber officinale — that work synergistically to balance skin\'s natural ecosystem and strengthen its natural protection barrier from the very first step of your skincare routine.',
	images: [
		'/img/product/img1.png',
		'/img/product/img2.png',
		'/img/product/img3.png',
		'/img/product/img4.png',
	],
	sizes: [
		{ label: '30 mL', price: 48 },
		{ label: '90 mL', price: 98 },
		{ label: '180 mL', price: 178 },
	],
	highlights: [
		{ emoji: '🐰', label: 'Cruelty-Free' },
		{ emoji: '🌿', label: 'Clean Formula' },
		{ emoji: '✨', label: 'Brightening' },
		{ emoji: '💧', label: 'Hydrating' },
		{ emoji: '🚫', label: 'Paraben-Free' },
		{ emoji: '🌸', label: 'Fragrance-Free' },
		{ emoji: '🌾', label: 'Vegan' },
	],
	certifications: ['DERMATOLOGIST_TESTED', 'CRUELTY_FREE', 'VEGAN', 'PARABEN_FREE'],
	keyIngredients: [
		{
			name: 'White Lily Extract',
			benefit: 'Brightens and evens skin tone, reduces the appearance of dark spots.',
			emoji: '🌸',
		},
		{
			name: 'Lotus Extract',
			benefit: 'Deeply hydrates and strengthens the skin barrier.',
			emoji: '🪷',
		},
		{
			name: 'Rehmannia Root',
			benefit: 'Rich in antioxidants; protects against environmental stressors.',
			emoji: '🌿',
		},
		{
			name: 'Solomon\'s Seal',
			benefit: 'Firms and restores skin elasticity over time.',
			emoji: '🌾',
		},
		{
			name: 'Zingiber Officinale',
			benefit: 'Stimulates microcirculation for a healthy, radiant glow.',
			emoji: '🫚',
		},
		{
			name: 'Hyaluronic Acid',
			benefit: 'Locks in moisture for plump, dewy skin all day long.',
			emoji: '💧',
		},
	],
	ingredients:
		'Water, Butylene Glycol, Niacinamide, Glycerin, Panthenol, Hydroxyethyl Urea, PEG-60 Hydrogenated Castor Oil, Sodium Hyaluronate, Lilium Candidum Flower Extract, Nelumbo Nucifera Flower Extract, Rehmannia Glutinosa Root Extract, Polygonatum Officinale Root/Stem Extract, Zingiber Officinale Root Extract, Allantoin, Betaine, Carbomer, Arginine, Ethylhexylglycerin, Phenoxyethanol.',
};

const REVIEWS = [
	{
		id: '1',
		name: 'Sophie L.',
		avatar: '/img/profile/defaultUser.svg',
		rating: 5,
		date: 'March 12, 2025',
		skinType: 'Combination',
		title: 'Holy grail serum!',
		body: 'I\'ve been using this for 6 months and my skin has never looked better. The texture is silky smooth and it absorbs instantly without any stickiness. My skin looks brighter and more even-toned.',
		helpful: 142,
	},
	{
		id: '2',
		name: 'Min J.',
		avatar: '/img/profile/defaultUser.svg',
		rating: 4,
		date: 'February 28, 2025',
		skinType: 'Dry',
		title: 'Worth every penny',
		body: 'Expensive but 100% worth it. I noticed a difference within two weeks — my skin feels plumper and my other products absorb better after using this. The scent is very subtle and luxurious.',
		helpful: 98,
	},
	{
		id: '3',
		name: 'Aisha K.',
		avatar: '/img/profile/defaultUser.svg',
		rating: 5,
		date: 'January 15, 2025',
		skinType: 'Normal',
		title: 'Repurchased 4 times',
		body: 'This is my desert island skincare product. I\'ve tried countless serums at this price point and nothing compares. My skin looks genuinely healthier and more radiant every morning.',
		helpful: 217,
	},
];

const RATING_BARS = [
	{ stars: 5, pct: 68 },
	{ stars: 4, pct: 20 },
	{ stars: 3, pct: 7 },
	{ stars: 2, pct: 3 },
	{ stars: 1, pct: 2 },
];

const RECOMMENDED = [
	{
		id: 'r1',
		brand: 'LANEIGE',
		title: 'Water Sleeping Mask',
		price: 29,
		rating: 4.7,
		img: '/img/product/img2.png',
	},
	{
		id: 'r2',
		brand: 'COSRX',
		title: 'Advanced Snail 96 Mucin Power Essence',
		price: 25,
		rating: 4.8,
		img: '/img/product/img3.png',
	},
	{
		id: 'r3',
		brand: 'INNISFREE',
		title: 'Green Tea Seed Hyaluronic Serum',
		price: 34,
		rating: 4.6,
		img: '/img/product/img1.png',
	},
	{
		id: 'r4',
		brand: 'SOME BY MI',
		title: 'AHA BHA PHA 30 Days Miracle Toner',
		price: 19,
		rating: 4.5,
		img: '/img/product/img4.png',
	},
	{
		id: 'r5',
		brand: 'KLAIRS',
		title: 'Freshly Juiced Vitamin C Serum',
		price: 22,
		rating: 4.4,
		img: '/img/product/img2.png',
	},
];

// ─── Sub-components ──────────────────────────────────────────────────────────

const RatingStars = ({ rating, size = 18 }: { rating: number; size?: number }) => {
	const full = Math.floor(rating);
	const half = rating % 1 >= 0.5;
	const empty = 5 - full - (half ? 1 : 0);
	return (
		<Stack className={'pdp-stars'}>
			{Array.from({ length: full }).map((_, i) => (
				<StarIcon key={`f${i}`} sx={{ fontSize: size, color: '#C9A680' }} />
			))}
			{half && <StarHalfIcon sx={{ fontSize: size, color: '#C9A680' }} />}
			{Array.from({ length: empty }).map((_, i) => (
				<StarBorderIcon key={`e${i}`} sx={{ fontSize: size, color: '#C9A680' }} />
			))}
		</Stack>
	);
};

// ─── Main Component ──────────────────────────────────────────────────────────

const ProductDetailUI = () => {
	const [activeImg, setActiveImg] = useState(0);
	const [activeSize, setActiveSize] = useState(1);
	const [qty, setQty] = useState(1);
	const [wished, setWished] = useState(false);
	const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'reviews'>('description');

	return (
		<div id={'product-detail-ui-page'}>
			<div className={'container'}>
				<Stack className={'pdp-page-wrap'}>

					{/* ══════════════════════════════════════════════════
					    1. HERO — gallery (left) + info (right)
					══════════════════════════════════════════════════ */}
					<Stack className={'pdp-hero'}>

						{/* LEFT — gallery */}
						<Stack className={'pdp-gallery'}>
							{/* Thumbnail strip */}
							<Stack className={'pdp-thumbs'}>
								{PRODUCT.images.map((src, idx) => (
									<button
										key={idx}
										className={`pdp-thumb${activeImg === idx ? ' active' : ''}`}
										onClick={() => setActiveImg(idx)}
									>
										<img src={src} alt={`thumb-${idx}`} />
									</button>
								))}
							</Stack>

							{/* Main image */}
							<Stack className={'pdp-main-img'}>
								<img src={PRODUCT.images[activeImg]} alt={'product'} />
								<Box className={'pdp-img-badge'}>NEW</Box>
							</Stack>
						</Stack>

						{/* RIGHT — info panel */}
						<Stack className={'pdp-info'}>

							{/* Brand */}
							<Typography className={'pdp-brand'}>{PRODUCT.brand}</Typography>

							{/* Title */}
							<Typography className={'pdp-title'}>{PRODUCT.title}</Typography>

							{/* Rating row */}
							<Stack className={'pdp-rating-row'}>
								<RatingStars rating={PRODUCT.rating} />
								<Typography className={'pdp-rating-score'}>{PRODUCT.rating}</Typography>
								<Typography className={'pdp-rating-count'}>{PRODUCT.reviewCount.toLocaleString()} reviews</Typography>
								<span className={'pdp-sep'}>·</span>
								<Stack className={'pdp-likes'}>
									<FavoriteBorderIcon sx={{ fontSize: 14, color: '#D4849A' }} />
									<Typography>{PRODUCT.likes.toLocaleString()}</Typography>
								</Stack>
							</Stack>

							{/* Skin type praise */}
							<Stack className={'pdp-praise'}>
								<Typography className={'pdp-praise-text'}>
									Best for: <span>{PRODUCT.skinTypes.join(', ')}</span>
								</Typography>
							</Stack>

							{/* Divider */}
							<Box className={'pdp-divider'} />

							{/* Price */}
							<Stack className={'pdp-price-block'}>
								<Typography className={'pdp-price'}>${PRODUCT.sizes[activeSize].price}</Typography>
								<Stack className={'pdp-installment'}>
									<Typography>
										or 4 × <strong>${(PRODUCT.sizes[activeSize].price / 4).toFixed(2)}</strong> with{' '}
										<span className={'pdp-klarna'}>Klarna</span>
									</Typography>
								</Stack>
							</Stack>

							{/* Subscribe discount */}
							<Stack className={'pdp-subscribe-note'}>
								<Box className={'pdp-subscribe-icon'}>🔄</Box>
								<Typography>
									Subscribe & Save 5% —{' '}
									<strong>${(PRODUCT.sizes[activeSize].price * 0.95).toFixed(2)}</strong>
								</Typography>
							</Stack>

							{/* Size selector */}
							<Stack className={'pdp-size-block'}>
								<Typography className={'pdp-field-label'}>Size</Typography>
								<Stack className={'pdp-size-options'}>
									{PRODUCT.sizes.map((s, i) => (
										<button
											key={i}
											className={`pdp-size-btn${activeSize === i ? ' active' : ''}`}
											onClick={() => setActiveSize(i)}
										>
											{s.label}
										</button>
									))}
								</Stack>
							</Stack>

							{/* Delivery options */}
							<Stack className={'pdp-delivery-row'}>
								{[
									{ icon: '🚚', label: 'Free Shipping', sub: 'Sign in to unlock' },
									{ icon: '🔄', label: 'Auto-Replenish', sub: 'Save 5% each order' },
									{ icon: '⚡', label: 'Same-Day', sub: 'Order before 2 PM' },
									{ icon: '🏪', label: 'Pick Up', sub: 'Check availability' },
								].map(({ icon, label, sub }) => (
									<Stack key={label} className={'pdp-delivery-card'}>
										<span className={'pdp-dc-icon'}>{icon}</span>
										<Typography className={'pdp-dc-label'}>{label}</Typography>
										<Typography className={'pdp-dc-sub'}>{sub}</Typography>
									</Stack>
								))}
							</Stack>

							{/* CTA row */}
							<Stack className={'pdp-cta-row'}>
								{/* Qty */}
								<Stack className={'pdp-qty-control'}>
									<button className={'pdp-qty-btn'} onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
									<Typography className={'pdp-qty-val'}>{qty}</Typography>
									<button className={'pdp-qty-btn'} onClick={() => setQty((q) => q + 1)}>+</button>
								</Stack>

								{/* Add to cart */}
								<Button className={'pdp-add-btn'} disableRipple>
									<Box className={'pdp-add-icon'}>🛒</Box>
									Add to Basket
								</Button>

								{/* Wishlist */}
								<button
									className={`pdp-wish-btn${wished ? ' active' : ''}`}
									onClick={() => setWished((w) => !w)}
								>
									{wished ? <FavoriteIcon sx={{ fontSize: 22 }} /> : <FavoriteBorderIcon sx={{ fontSize: 22 }} />}
								</button>
							</Stack>

							{/* Meta */}
							<Stack className={'pdp-meta-row'}>
								<Stack className={'pdp-views'}>
									<RemoveRedEyeIcon sx={{ fontSize: 14 }} />
									<Typography>{PRODUCT.views.toLocaleString()} views</Typography>
								</Stack>
								<Stack className={'pdp-trending'}>
									<Box className={'pdp-fire'}>🔥</Box>
									<Typography><strong>1,240+</strong> people viewed this today</Typography>
								</Stack>
							</Stack>

						</Stack>
					</Stack>

					{/* ══════════════════════════════════════════════════
					    2. HIGHLIGHTS — pill badges
					══════════════════════════════════════════════════ */}
					<Stack className={'pdp-highlights'}>
						{PRODUCT.highlights.map(({ emoji, label }) => (
							<Stack key={label} className={'pdp-hl-pill'}>
								<span className={'pdp-hl-emoji'}>{emoji}</span>
								<Typography className={'pdp-hl-label'}>{label}</Typography>
							</Stack>
						))}
					</Stack>

					{/* ══════════════════════════════════════════════════
					    3. TABS — Description | Ingredients | Reviews
					══════════════════════════════════════════════════ */}
					<Stack className={'pdp-tabs-wrap'}>

						{/* Tab nav */}
						<Stack className={'pdp-tab-nav'}>
							{(['description', 'ingredients', 'reviews'] as const).map((tab) => (
								<button
									key={tab}
									className={`pdp-tab-btn${activeTab === tab ? ' active' : ''}`}
									onClick={() => setActiveTab(tab)}
								>
									{tab.charAt(0).toUpperCase() + tab.slice(1)}
									{tab === 'reviews' && (
										<span className={'pdp-tab-badge'}>{PRODUCT.reviewCount.toLocaleString()}</span>
									)}
								</button>
							))}
						</Stack>

						{/* ── Description ── */}
						{activeTab === 'description' && (
							<Stack className={'pdp-tab-panel'}>
								<Stack className={'pdp-desc-block'}>
									<Typography className={'pdp-section-title'}>About This Product</Typography>
									<Typography className={'pdp-desc-text'}>{PRODUCT.description}</Typography>
								</Stack>

								<Stack className={'pdp-details-table'}>
									<Typography className={'pdp-section-title'}>Product Details</Typography>
									<Stack className={'pdp-table-grid'}>
										{[
											{ label: 'Brand', val: PRODUCT.brand },
											{ label: 'Category', val: PRODUCT.category },
											{ label: 'Volume', val: `${PRODUCT.volume} mL` },
											{ label: 'Skin Type', val: PRODUCT.skinTypes.join(', ') },
											{ label: 'Best For', val: 'All skin types' },
											{ label: 'Origin', val: 'South Korea' },
										].map(({ label, val }) => (
											<Box key={label} className={'pdp-table-row'}>
												<Typography className={'pdp-table-label'}>{label}</Typography>
												<Typography className={'pdp-table-val'}>{val}</Typography>
											</Box>
										))}
									</Stack>
								</Stack>

								<Stack className={'pdp-certs-block'}>
									<Typography className={'pdp-section-title'}>Certifications</Typography>
									<Stack className={'pdp-cert-row'}>
										{PRODUCT.certifications.map((c) => (
											<span key={c} className={'pdp-cert-badge'}>
												{c.replace(/_/g, ' ')}
											</span>
										))}
									</Stack>
								</Stack>
							</Stack>
						)}

						{/* ── Ingredients ── */}
						{activeTab === 'ingredients' && (
							<Stack className={'pdp-tab-panel'}>
								<Stack className={'pdp-ing-section'}>
									<Typography className={'pdp-section-title'}>Key Ingredients</Typography>
									<Stack className={'pdp-ing-grid'}>
										{PRODUCT.keyIngredients.map((ing) => (
											<Stack key={ing.name} className={'pdp-ing-card'}>
												<Stack className={'pdp-ing-header'}>
													<span className={'pdp-ing-emoji'}>{ing.emoji}</span>
													<Typography className={'pdp-ing-name'}>{ing.name}</Typography>
												</Stack>
												<Typography className={'pdp-ing-benefit'}>{ing.benefit}</Typography>
											</Stack>
										))}
									</Stack>
								</Stack>

								<Stack className={'pdp-full-ing'}>
									<Typography className={'pdp-section-title'}>Full Ingredient List</Typography>
									<Typography className={'pdp-ing-list'}>{PRODUCT.ingredients}</Typography>
								</Stack>
							</Stack>
						)}

						{/* ── Reviews ── */}
						{activeTab === 'reviews' && (
							<Stack className={'pdp-tab-panel'}>

								{/* Rating summary */}
								<Stack className={'pdp-reviews-summary'}>
									<Stack className={'pdp-avg-block'}>
										<Typography className={'pdp-avg-num'}>{PRODUCT.rating.toFixed(1)}</Typography>
										<RatingStars rating={PRODUCT.rating} size={24} />
										<Typography className={'pdp-avg-sub'}>{PRODUCT.reviewCount.toLocaleString()} Reviews</Typography>
									</Stack>
									<Stack className={'pdp-rating-bars'}>
										{RATING_BARS.map(({ stars, pct }) => (
											<Stack key={stars} className={'pdp-bar-row'}>
												<Typography className={'pdp-bar-stars'}>{stars} ★</Typography>
												<Stack className={'pdp-bar-track'}>
													<Stack className={'pdp-bar-fill'} style={{ width: `${pct}%` }} />
												</Stack>
												<Typography className={'pdp-bar-pct'}>{pct}%</Typography>
											</Stack>
										))}
									</Stack>
									<Stack className={'pdp-pros-cons'}>
										<Stack className={'pdp-pros'}>
											<Typography className={'pdp-pc-label'}>Pros</Typography>
											{['hydrating', 'fast-absorbing', 'brightening', 'long-lasting', 'lightweight'].map((t) => (
												<span key={t} className={'pdp-tag'}>{t}</span>
											))}
										</Stack>
										<Stack className={'pdp-cons'}>
											<Typography className={'pdp-pc-label'}>Cons</Typography>
											{['pricey', 'subtle scent'].map((t) => (
												<span key={t} className={'pdp-tag'}>{t}</span>
											))}
										</Stack>
									</Stack>
								</Stack>

								{/* Review cards */}
								<Stack className={'pdp-review-cards'}>
									{REVIEWS.map((r) => (
										<Stack key={r.id} className={'pdp-review-card'}>
											<Stack className={'pdp-rv-header'}>
												<Stack className={'pdp-rv-user'}>
													<img src={r.avatar} alt={r.name} className={'pdp-rv-avatar'} />
													<Stack className={'pdp-rv-user-info'}>
														<Typography className={'pdp-rv-name'}>{r.name}</Typography>
														<Typography className={'pdp-rv-skin'}>Skin type: {r.skinType}</Typography>
													</Stack>
												</Stack>
												<Stack className={'pdp-rv-meta'}>
													<RatingStars rating={r.rating} size={14} />
													<Typography className={'pdp-rv-date'}>{r.date}</Typography>
												</Stack>
											</Stack>
											<Typography className={'pdp-rv-title'}>{r.title}</Typography>
											<Typography className={'pdp-rv-body'}>{r.body}</Typography>
											<Stack className={'pdp-rv-footer'}>
												<Typography className={'pdp-rv-helpful'}>
													👍 {r.helpful} people found this helpful
												</Typography>
											</Stack>
										</Stack>
									))}
								</Stack>

							</Stack>
						)}
					</Stack>

					{/* ══════════════════════════════════════════════════
					    4. RECOMMENDED PRODUCTS — horizontal scroll
					══════════════════════════════════════════════════ */}
					<Stack className={'pdp-recommended'}>
						<Stack className={'pdp-rec-head'}>
							<Stack className={'pdp-rec-titles'}>
								<Typography className={'pdp-rec-title'}>You May Also Like</Typography>
								<Typography className={'pdp-rec-sub'}>Curated picks in {PRODUCT.category}</Typography>
							</Stack>
							<Stack className={'pdp-rec-arrows'}>
								<WestIcon className={'pdp-rec-prev'} />
								<EastIcon className={'pdp-rec-next'} />
							</Stack>
						</Stack>

						<Stack className={'pdp-rec-scroll'}>
							{RECOMMENDED.map((item) => (
								<Stack key={item.id} className={'pdp-rec-card'}>
									<Stack className={'pdp-rec-img-wrap'}>
										<img src={item.img} alt={item.title} className={'pdp-rec-img'} />
										<button className={'pdp-rec-wish'}>
											<FavoriteBorderIcon sx={{ fontSize: 16 }} />
										</button>
									</Stack>
									<Stack className={'pdp-rec-body'}>
										<Typography className={'pdp-rec-brand'}>{item.brand}</Typography>
										<Typography className={'pdp-rec-name'}>{item.title}</Typography>
										<Stack className={'pdp-rec-row'}>
											<RatingStars rating={item.rating} size={13} />
											<Typography className={'pdp-rec-price'}>${item.price}</Typography>
										</Stack>
										<Button className={'pdp-rec-add-btn'} disableRipple>
											Add to Cart
										</Button>
									</Stack>
								</Stack>
							))}
						</Stack>
					</Stack>

				</Stack>
			</div>
		</div>
	);
};

export default ProductDetailUI;
