import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutFull from '../../libs/components/layout/LayoutFull';
import { NextPage } from 'next';
import Review from '../../libs/components/product/Review';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay, Navigation, Pagination } from 'swiper';
import ProductBigCard from '../../libs/components/common/ProductBigCard';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import { Product } from '../../libs/types/product/product';
import moment from 'moment';
import { formatterStr } from '../../libs/utils';
import { REACT_APP_API_URL } from '../../libs/config';
import { userVar, cartVar, saveCart, CartItem } from '../../apollo/store';
import { Rating, RatingStats } from '../../libs/types/rating/rating';
import { RatingInput, RatingsInquiry } from '../../libs/types/rating/rating.input';
import { Pagination as MuiPagination } from '@mui/material';
import Link from 'next/link';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import 'swiper/css';
import 'swiper/css/pagination';

import { GET_RATINGS, GET_RATING_STATS, GET_PRODUCTS, GET_PRODUCT } from '../../apollo/user/query';
import { T } from '../../libs/types/common';
import { Direction, Message } from '../../libs/enums/common.enum';
import { CREATE_RATING, LIKE_TARGET_PRODUCT } from '../../apollo/user/mutation';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';


SwiperCore.use([Autoplay, Navigation, Pagination]);

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

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

const ProductDetail: NextPage = ({ initialRating, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const queryProductId = typeof router.query.id === 'string' ? router.query.id : '';
	const [productId, setProductId] = useState<string | null>(null);
	const [product, setProduct] = useState<Product | null>(null);
	const [slideImage, setSlideImage] = useState<string>('');
	const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
	const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'reviews'>('description');
	const [activeSize, setActiveSize] = useState<number>(1);
	const [qty, setQty] = useState<number>(1);
	const [isZooming, setIsZooming] = useState(false);
	const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
	const [zoomBg, setZoomBg] = useState({ x: 0, y: 0 });
	const [panelPos, setPanelPos] = useState({ left: 0, top: 0 });
	const imgRef = useRef<HTMLDivElement>(null);
	const heroRef = useRef<HTMLDivElement>(null);
	const tabsRef = useRef<HTMLDivElement>(null);
	const [ratingInquiry, setRatingInquiry] = useState<RatingsInquiry>(initialRating);
	const [productRatings, setProductRatings] = useState<Rating[]>([]);
	const [ratingTotal, setRatingTotal] = useState<number>(0);
	const [ratingStats, setRatingStats] = useState<RatingStats | null>(null);
	const [insertRatingData, setInsertRatingData] = useState<RatingInput>({
		productId: '',
		ratingScore: 0,
		reviewText: '',
	});
	const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
	const sizes = useMemo(
		() => [
			{ label: `${Math.round((product?.productVolume ?? 30) * 0.33)} mL`, price: Math.round((product?.productPrice ?? 0) * 0.55) },
			{ label: `${product?.productVolume ?? 90} mL`, price: product?.productPrice ?? 0 },
			{ label: `${Math.round((product?.productVolume ?? 90) * 2)} mL`, price: Math.round((product?.productPrice ?? 0) * 1.8) },
		],
		[product?.productVolume, product?.productPrice],
	);
	const safeActiveSize = Math.min(Math.max(activeSize, 0), Math.max(sizes.length - 1, 0));
	const selectedSize = sizes[safeActiveSize] ?? { label: '0 mL', price: 0 };
	const relatedCategoryList = product?.productCategory ? [product.productCategory] : [];
	const stockCount = Number(product?.productLeftCount);
	const hasStockLimit = Number.isFinite(stockCount);
	const maxQty = hasStockLimit ? Math.max(0, Math.floor(stockCount)) : Number.POSITIVE_INFINITY;
	const outOfStock = hasStockLimit && maxQty <= 0;
	const effectiveQty = Math.max(1, Number.isFinite(qty) ? Math.floor(qty) : 1);
	const totalPrice = selectedSize.price * effectiveQty;

	/** APOLLO REQUESTS **/
	const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);
	const [createRating] = useMutation(CREATE_RATING);

	const {
		loading: getProductLoading,
		data: getProductData,
		error: getProductError,
		refetch: getProductRefetch,
	} = useQuery(GET_PRODUCT, {
		fetchPolicy: 'network-only',
		variables: { input: productId },
		skip: !productId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			if (data?.getProduct) setProduct(data?.getProduct);
			if (data?.getProduct) setSlideImage(data?.getProduct?.productImages[0]);
		},
	});

	const {
		loading: getProductsLoading,
		data: getProductsData,
		error: getProductsError,
		refetch: getProductsRefetch,
	} = useQuery(GET_PRODUCTS, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: {
				page: 1,
				limit: 4,
				sort: 'createdAt',
				direction: Direction.DESC,
				search: {
					categoryList: relatedCategoryList,
				},
			},
		},
		skip: !productId && !product,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			if (data?.getProducts?.list) {
				setRelatedProducts(data.getProducts.list.filter((item: Product) => item?._id !== productId));
			}
		},
	});

	const {
		loading: getRatingsLoading,
		data: getRatingsData,
		error: getRatingsError,
		refetch: getRatingsRefetch,
	} = useQuery(GET_RATINGS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: ratingInquiry },
		skip: !ratingInquiry.search.productId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			if (data?.getRatings?.list) setProductRatings(data.getRatings.list);
			setRatingTotal(data?.getRatings?.metaCounter[0]?.total ?? 0);
		},
	});

	const {
		loading: getRatingStatsLoading,
		data: getRatingStatsData,
		error: getRatingStatsError,
		refetch: getRatingStatsRefetch,
	} = useQuery(GET_RATING_STATS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: productId },
		skip: !productId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			if (data?.getRatingStats) setRatingStats(data.getRatingStats);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (!queryProductId) return;
		setProductId(queryProductId);
		setRatingInquiry((prev) => ({
			...prev,
			page: 1,
			search: { productId: queryProductId },
		}));
		setInsertRatingData((prev) => ({
			...prev,
			productId: queryProductId,
		}));
	}, [queryProductId]);

	useEffect(() => {
		if (!hasStockLimit) return;
		setQty((prev) => {
			const normalized = Math.max(1, Number.isFinite(prev) ? Math.floor(prev) : 1);
			return Math.min(normalized, Math.max(maxQty, 1));
		});
	}, [hasStockLimit, maxQty]);


	/** HANDLERS **/
	const LENS_SIZE = 100;

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		const rect = imgRef.current?.getBoundingClientRect();
		if (!rect) return;
		const rawX = e.clientX - rect.left;
		const rawY = e.clientY - rect.top;
		const x = Math.max(0, Math.min(rawX - LENS_SIZE / 2, rect.width - LENS_SIZE));
		const y = Math.max(0, Math.min(rawY - LENS_SIZE / 2, rect.height - LENS_SIZE));
		setLensPos({ x, y });
		const bgX = rect.width === LENS_SIZE ? 0 : (x / (rect.width - LENS_SIZE)) * 100;
		const bgY = rect.height === LENS_SIZE ? 0 : (y / (rect.height - LENS_SIZE)) * 100;
		setZoomBg({ x: bgX, y: bgY });
		// Position relative to pdp-hero so panel scrolls with page
		const heroRect = heroRef.current?.getBoundingClientRect();
		if (heroRect) {
			setPanelPos({ left: rect.right - heroRect.left + 16, top: rect.top - heroRect.top });
		}
	};

	const changeImageHandler = (image: string) => {
		setSlideImage(image);
	};

	const toggleLikeOnProduct = (target: Product, targetId: string): Product => {
		if (!target || target._id !== targetId) return target;
		const wasLiked = Boolean(target.meLiked?.[0]?.myFavorite);
		const nextLiked = !wasLiked;
		const nextLikes = Math.max(0, (target.productLikes ?? 0) + (nextLiked ? 1 : -1));
		return {
			...target,
			productLikes: nextLikes,
			meLiked: [
				{
					memberId: user?._id ?? '',
					likeRefId: targetId,
					myFavorite: nextLiked,
				},
			],
		};
	};

	const likeProductHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
			setProduct((prev) => (prev ? toggleLikeOnProduct(prev, id) : prev));
			setRelatedProducts((prev) => prev.map((item) => toggleLikeOnProduct(item, id)));
			await likeTargetProduct({ variables: { input: id } });
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likeProductHandler', err.message);
			await getProductRefetch({ input: id });
			await getProductsRefetch({
				input: {
					page: 1,
					limit: 4,
					sort: 'createdAt',
					direction: Direction.DESC,
					search: {
						categoryList: relatedCategoryList,
					},
				},
			});
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const addToCartHandler = async () => {
		try {
			if (!product?._id) return;
			if (isAddingToCart) return;
			if (!selectedSize.label) {
				await sweetMixinErrorAlert('Please select size.');
				return;
			}
			if (outOfStock) {
				await sweetMixinErrorAlert('This product is out of stock.');
				return;
			}
			setIsAddingToCart(true);
			const normalizedQty = Math.min(effectiveQty, maxQty);
			const payload = {
				productId: product._id,
				quantity: normalizedQty,
				selectedSize: selectedSize.label,
			};
			const newItem: CartItem = {
				productId: payload.productId,
				productTitle: product?.productTitle ?? '',
				productBrand: product?.productBrand ?? '',
				productPrice: selectedSize.price,
				productImage: product?.productImages?.[0] ?? '',
				qty: payload.quantity,
				size: payload.selectedSize,
				stockCount: hasStockLimit ? maxQty : undefined,
			};
			const current = cartVar();
			const existing = current.findIndex((i) => i.productId === newItem.productId && i.size === newItem.size);
			let updated: CartItem[];
			if (existing >= 0) {
				updated = current.map((item, idx) =>
					idx === existing ? { ...item, qty: item.qty + normalizedQty } : item,
				);
			} else {
				updated = [...current, newItem];
			}
			cartVar(updated);
			saveCart(updated, user?._id ?? '');
			await sweetTopSmallSuccessAlert('Added to basket!', 800);
			await router.push('/cart');
		} finally {
			setIsAddingToCart(false);
		}
	};

	const ratingPaginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
		setRatingInquiry((prev) => ({ ...prev, page: value }));
	};

	const createRatingHandler = async () => {
		try {
			if (!user._id) throw Error(Message.NOT_AUTHENTICATED);
			if (!insertRatingData.productId) throw Error('Invalid product reference.');
			if (!insertRatingData.ratingScore || insertRatingData.ratingScore < 1) throw Error('Please select a star rating.');
			const reviewText = (insertRatingData.reviewText ?? '').trim();
			if (reviewText.length < 10) throw Error('Review must be at least 10 characters.');
			await createRating({
				variables: {
					input: { ...insertRatingData, reviewText },
				},
			});
			setInsertRatingData((prev) => ({ ...prev, ratingScore: 0, reviewText: '' }));
			await getRatingsRefetch({ input: ratingInquiry });
			await getRatingStatsRefetch({ input: productId });
			await getProductRefetch({ input: productId });
			await sweetTopSmallSuccessAlert('Review submitted!', 800);
		} catch (err) {
			await sweetErrorHandling(err);
		}
	};


	const increaseQtyHandler = () => {
		setQty((prev) => Math.min(Math.max(maxQty, 1), prev + 1));
	};

	const decreaseQtyHandler = () => {
		setQty((prev) => Math.max(1, prev - 1));
	};

	const scrollToReviewsHandler = () => {
		setActiveTab('reviews');
		setTimeout(() => tabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
	};

	if (getProductLoading) {
		return (
			<Stack sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '1080px' }}>
				<CircularProgress size={"4rem"} />
			</Stack>
		);
	}

	if (device === 'mobile') {
		return <div>PRODUCT DETAIL PAGE</div>;
	} else {
		return (
			<div id={'product-detail-ui-page'}>
				<div className={'container'}>
					<Stack className={'pdp-page-wrap'}>

						{/* ══════════════════════════════════════════════════
						    1. HERO — gallery (left) + info (right)
						══════════════════════════════════════════════════ */}
						<Stack ref={heroRef} className={'pdp-hero'}>

							{/* LEFT — gallery */}
							<Stack className={'pdp-gallery'}>
								{/* Thumbnail strip */}
								<Stack className={'pdp-thumbs'}>
									{(product?.productImages ?? []).map((img: string, idx: number) => (
										<button
											key={idx}
											className={`pdp-thumb${slideImage === img ? ' active' : ''}`}
											onClick={() => changeImageHandler(img)}
										>
											<img src={img.startsWith('/') ? img : `${REACT_APP_API_URL}/${img}`} alt={`thumb-${idx}`} />
										</button>
									))}
								</Stack>

								{/* Main image + magnifier lens */}
								<Stack
									ref={imgRef}
									className={'pdp-main-img-wrap'}
									onMouseEnter={() => setIsZooming(true)}
									onMouseLeave={() => setIsZooming(false)}
									onMouseMove={handleMouseMove}
								>
									<Stack className={'pdp-main-img'}>
										<img
											src={slideImage ? (slideImage.startsWith('/') ? slideImage : `${REACT_APP_API_URL}/${slideImage}`) : '/img/product/bigImage.png'}
											alt={'product'}
										/>
										<Box className={'pdp-img-badge'}>NEW</Box>
										{/* Lens inside overflow:hidden so box-shadow clips to image bounds */}
										{isZooming && (
											<div className={'pdp-zoom-lens'} style={{ left: lensPos.x, top: lensPos.y }} />
										)}
									</Stack>
								</Stack>

								{/* Zoom panel — fixed so scroll doesn't move it */}
								{isZooming && (
									<div
										className={'pdp-zoom-panel'}
										style={{
											backgroundImage: `url(${slideImage ? (slideImage.startsWith('/') ? slideImage : `${REACT_APP_API_URL}/${slideImage}`) : '/img/product/bigImage.png'})`,
											backgroundPosition: `${zoomBg.x}% ${zoomBg.y}%`,
											left: panelPos.left,
										}}
									/>
								)}
							</Stack>

							{/* RIGHT — info panel */}
							<Stack className={'pdp-info'}>

								{/* Brand */}
								<Typography className={'pdp-brand'}>{product?.productBrand}</Typography>

								{/* Title */}
								<Typography className={'pdp-title'}>{product?.productTitle}</Typography>

								{/* Rating row */}
								<Stack className={'pdp-rating-row'}>
									<RatingStars rating={product?.productRating ?? 0} />
									<Typography className={'pdp-rating-score'}>{product?.productRating ?? 0}</Typography>
									<Typography
										className={'pdp-rating-count'}
										onClick={scrollToReviewsHandler}
										sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
									>
										{(product?.productRatingCount ?? 0).toLocaleString()} reviews
									</Typography>
									<span className={'pdp-sep'}>·</span>
									<Stack
										className={'pdp-likes'}
										onClick={() => likeProductHandler(user, product?._id ?? '')}
										sx={{ cursor: 'pointer' }}
									>
										{product?.meLiked?.[0]?.myFavorite
											? <FavoriteIcon sx={{ fontSize: 14, color: '#D4849A' }} />
											: <FavoriteBorderIcon sx={{ fontSize: 14, color: '#D4849A' }} />}
										<Typography>{(product?.productLikes ?? 0).toLocaleString()}</Typography>
									</Stack>
								</Stack>

								{/* Skin type praise */}
								<Stack className={'pdp-praise'}>
									<Typography className={'pdp-praise-text'}>
										Best for: <span>{(product?.productSkinType ?? []).join(', ')}</span>
									</Typography>
								</Stack>

								{/* Divider */}
								<Box className={'pdp-divider'} />

								{/* Price */}
								<Stack className={'pdp-price-block'}>
									<Typography className={'pdp-price'}>${formatterStr(totalPrice)}</Typography>
								</Stack>

								{/* Subscribe discount */}
								<Stack className={'pdp-subscribe-note'}>
									<Box className={'pdp-subscribe-icon'}>🔄</Box>
									<Typography>
										Subscribe & Save 5% —{'  '}
										<strong>${(totalPrice * 0.95).toFixed(2)}</strong>
									</Typography>
								</Stack>

								{/* Size selector */}
								<Stack className={'pdp-size-block'}>
									<Typography className={'pdp-field-label'}>Size</Typography>
									<Stack className={'pdp-size-options'}>
										{sizes.map((s, i) => (
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
										<button className={'pdp-qty-btn'} onClick={decreaseQtyHandler}>−</button>
										<Typography className={'pdp-qty-val'}>{effectiveQty}</Typography>
										<button className={'pdp-qty-btn'} onClick={increaseQtyHandler}>+</button>
									</Stack>

									{/* Add to cart */}
									<Button className={'pdp-add-btn'} disableRipple onClick={addToCartHandler} disabled={isAddingToCart || outOfStock}>
										<Box className={'pdp-add-icon'}>🛒</Box>
										{outOfStock ? 'Out of Stock' : isAddingToCart ? 'Adding...' : 'Add to Basket'}
									</Button>

									{/* Wishlist */}
									<button
										className={`pdp-wish-btn${product?.meLiked?.[0]?.myFavorite ? ' active' : ''}`}
										onClick={() => likeProductHandler(user, product?._id as string)}
									>
										{product?.meLiked?.[0]?.myFavorite
											? <FavoriteIcon sx={{ fontSize: 22 }} />
											: <FavoriteBorderIcon sx={{ fontSize: 22 }} />}
									</button>
								</Stack>

								{/* Meta */}
								<Stack className={'pdp-meta-row'}>
									<Stack className={'pdp-views'}>
										<RemoveRedEyeIcon sx={{ fontSize: 14 }} />
										<Typography>{(product?.productViews ?? 0).toLocaleString()} views</Typography>
									</Stack>
									<Stack className={'pdp-trending'}>
										<Box className={'pdp-fire'}>🔥</Box>
										<Typography><strong>{(product?.productViews ?? 0).toLocaleString()}+</strong> people viewed this today</Typography>
									</Stack>
								</Stack>

							</Stack>
						</Stack>

						{/* ══════════════════════════════════════════════════
						    2. HIGHLIGHTS — pill badges
						══════════════════════════════════════════════════ */}
						{(product?.certifications ?? []).length > 0 && (
							<Stack className={'pdp-highlights'}>
								{(product?.certifications ?? []).map((cert: string) => {
									const CERT_EMOJI: Record<string, string> = {
										ORGANIC: '🌿', VEGAN: '🌱', CRUELTY_FREE: '🐰',
										PARABEN_FREE: '✨', ALCOHOL_FREE: '🚫', FRAGRANCE_FREE: '🍃',
										DERMATOLOGIST_TESTED: '🔬', HYPOALLERGENIC: '🌸',
										SULFATE_FREE: '💧', NATURAL: '🌾',
									};
									return (
										<Stack key={cert} className={'pdp-hl-pill'}>
											<span className={'pdp-hl-emoji'}>{CERT_EMOJI[cert] ?? '✔️'}</span>
											<Typography className={'pdp-hl-label'}>{cert.replace(/_/g, ' ')}</Typography>
										</Stack>
									);
								})}
							</Stack>
						)}

						{/* ══════════════════════════════════════════════════
						    3. TABS — Description | Ingredients | Reviews
						══════════════════════════════════════════════════ */}
						<Stack className={'pdp-tabs-wrap'} ref={tabsRef as any}>

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
											<span className={'pdp-tab-badge'}>{ratingTotal.toLocaleString()}</span>
										)}
									</button>
								))}
							</Stack>

							{/* ── Description ── */}
							{activeTab === 'description' && (
								<Stack className={'pdp-tab-panel'}>
									<Stack className={'pdp-desc-block'}>
										<Typography className={'pdp-section-title'}>About This Product</Typography>
										<Typography className={'pdp-desc-text'}>{product?.productDesc ?? 'No description available.'}</Typography>
									</Stack>

									<Stack className={'pdp-details-table'}>
										<Typography className={'pdp-section-title'}>Product Details</Typography>
										<Stack className={'pdp-table-grid'}>
											{[
												{ label: 'Brand', val: product?.productBrand },
												{ label: 'Category', val: product?.productCategory },
												{ label: 'Volume', val: `${product?.productVolume ?? 0} mL` },
												{ label: 'Skin Type', val: (product?.productSkinType ?? []).join(', ') },
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
											{(product?.certifications ?? []).map((c: string) => (
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
											{(product?.keyIngredients ?? []).map((ing: any) => (
												<Stack key={ing.name} className={'pdp-ing-card'}>
													<Stack className={'pdp-ing-header'}>
														<span className={'pdp-ing-emoji'}>{ing.emoji ?? '🌿'}</span>
														<Typography className={'pdp-ing-name'}>{ing.name}</Typography>
													</Stack>
													<Typography className={'pdp-ing-benefit'}>{ing.benefit}</Typography>
												</Stack>
											))}
										</Stack>
									</Stack>

									<Stack className={'pdp-full-ing'}>
										<Typography className={'pdp-section-title'}>Full Ingredient List</Typography>
										<Typography className={'pdp-ing-list'}>
											{Array.isArray(product?.ingredients) ? (product as any).ingredients.join(', ') : ((product as any)?.ingredients ?? 'Not available.')}
										</Typography>
									</Stack>
								</Stack>
							)}

							{/* ── Reviews ── */}
							{activeTab === 'reviews' && (
								<Stack className={'pdp-tab-panel'}>

									{/* Rating summary */}
									<Stack className={'pdp-reviews-summary'}>
										<Stack className={'pdp-avg-block'}>
											<Typography className={'pdp-avg-num'}>{(product?.productRating ?? 0).toFixed(1)}</Typography>
											<RatingStars rating={product?.productRating ?? 0} size={24} />
											<Typography className={'pdp-avg-sub'}>{ratingTotal.toLocaleString()} Review{ratingTotal !== 1 ? 's' : ''}</Typography>
										</Stack>
										{ratingStats && ratingStats.totalRatings > 0 && (
											<Stack className={'pdp-bar-block'}>
												{([
													{ label: '5 stars', count: ratingStats.fiveStars },
													{ label: '4 stars', count: ratingStats.fourStars },
													{ label: '3 stars', count: ratingStats.threeStars },
													{ label: '2 stars', count: ratingStats.twoStars },
													{ label: '1 star',  count: ratingStats.oneStar },
												]).map(({ label, count }) => (
													<Stack key={label} className={'pdp-bar-row'}>
														<Typography className={'pdp-bar-label'}>{label}</Typography>
														<Stack className={'pdp-bar-track'}>
															<Stack
																className={'pdp-bar-fill'}
																style={{ width: `${Math.round((count / ratingStats.totalRatings) * 100)}%` }}
															/>
														</Stack>
														<Typography className={'pdp-bar-pct'}>
															{Math.round((count / ratingStats.totalRatings) * 100)}%
														</Typography>
													</Stack>
												))}
											</Stack>
										)}
									</Stack>

									{/* Review cards */}
									<Stack className={'pdp-review-cards'}>
										{productRatings.map((rating: Rating) => (
											<Stack key={rating._id} className={'pdp-review-card'}>
												<Stack className={'pdp-rv-header'}>
													<Stack className={'pdp-rv-user'}>
														<img
															src={rating?.memberData?.memberImage
																? (rating.memberData.memberImage.startsWith('/') ? rating.memberData.memberImage : `${REACT_APP_API_URL}/${rating.memberData.memberImage}`)
																: '/img/profile/defaultUser.svg'}
															alt={rating?.memberData?.memberNick}
															className={'pdp-rv-avatar'}
														/>
														<Stack className={'pdp-rv-user-info'}>
															<Typography className={'pdp-rv-name'}>{rating?.memberData?.memberNick}</Typography>
															<RatingStars rating={rating.ratingScore} size={14} />
														</Stack>
													</Stack>
													<Stack className={'pdp-rv-meta'}>
														<Typography className={'pdp-rv-date'}>{moment(rating?.createdAt).format('MMMM D, YYYY')}</Typography>
													</Stack>
												</Stack>
												<Typography className={'pdp-rv-body'}>{rating?.reviewText}</Typography>
											</Stack>
										))}
										{ratingTotal > ratingInquiry.limit && (
											<Box component={'div'} className={'pdp-review-pagination'}>
												<MuiPagination
													page={ratingInquiry.page}
													count={Math.ceil(ratingTotal / ratingInquiry.limit)}
													onChange={ratingPaginationChangeHandler}
													shape="circular"
													color="primary"
												/>
											</Box>
										)}
									</Stack>

									{/* Write review */}
									<Stack className={'pdp-write-review'}>
										<Typography className={'pdp-section-title'}>Leave A Review</Typography>
										<Stack className={'pdp-star-selector'}>
											{[1, 2, 3, 4, 5].map((star) => (
												<span
													key={star}
													className={'pdp-star-btn'}
													onClick={() => setInsertRatingData((prev) => ({ ...prev, ratingScore: star }))}
												>
													{star <= insertRatingData.ratingScore
														? <StarIcon sx={{ fontSize: 28, color: '#C9A680', cursor: 'pointer' }} />
														: <StarBorderIcon sx={{ fontSize: 28, color: '#C9A680', cursor: 'pointer' }} />
													}
												</span>
											))}
										</Stack>
										<textarea
											onChange={({ target: { value } }: any) => {
												setInsertRatingData((prev) => ({ ...prev, reviewText: value }));
											}}
											value={insertRatingData.reviewText ?? ''}
											placeholder="Share your experience with this product... (min 10 characters)"
										/>
										<Box className={'pdp-submit-row'} component={'div'}>
											<Button
												className={'pdp-submit-btn'}
												disabled={
													!insertRatingData.ratingScore ||
													(insertRatingData.reviewText ?? '').trim().length < 10 ||
													!user?._id
												}
												onClick={createRatingHandler}
											>
												Submit Review
											</Button>
										</Box>
									</Stack>

								</Stack>
							)}
						</Stack>

						{/* ══════════════════════════════════════════════════
						    4. RECOMMENDED PRODUCTS — horizontal scroll
						══════════════════════════════════════════════════ */}
						{relatedProducts.length !== 0 && (
							<Stack className={'pdp-recommended'}>
								<Stack className={'pdp-rec-head'}>
									<Stack className={'pdp-rec-titles'}>
										<Typography className={'pdp-rec-title'}>You May Also Like</Typography>
										<Typography className={'pdp-rec-sub'}>Curated picks in {product?.productCategory}</Typography>
									</Stack>
									<Stack className={'pdp-rec-arrows'}>
										<WestIcon className={'pdp-rec-prev'} />
										<EastIcon className={'pdp-rec-next'} />
									</Stack>
								</Stack>

								<Stack className={'pdp-rec-scroll'}>
									{relatedProducts.map((item: Product) => (
										<Stack key={item._id} className={'pdp-rec-card'}>
											<Link href={{ pathname: '/product/detail', query: { id: item._id } }}>
												<Stack className={'pdp-rec-img-wrap'}>
													<img
														src={item.productImages?.[0] ? (item.productImages[0].startsWith('/') ? item.productImages[0] : `${REACT_APP_API_URL}/${item.productImages[0]}`) : '/img/product/bigImage.png'}
														alt={item.productTitle}
														className={'pdp-rec-img'}
													/>
													<button
														className={'pdp-rec-wish'}
														onClick={(e) => { e.preventDefault(); likeProductHandler(user, item._id); }}
													>
														{item.meLiked?.[0]?.myFavorite
															? <FavoriteIcon sx={{ fontSize: 16, color: '#e75480' }} />
															: <FavoriteBorderIcon sx={{ fontSize: 16 }} />}
													</button>
												</Stack>
												<Stack className={'pdp-rec-body'}>
													<Typography className={'pdp-rec-brand'}>{item.productBrand}</Typography>
													<Typography className={'pdp-rec-name'}>{item.productTitle}</Typography>
													<Stack className={'pdp-rec-row'}>
														<RatingStars rating={item.productRating ?? 0} size={13} />
														<Typography className={'pdp-rec-price'}>${item.productPrice}</Typography>
													</Stack>
													<Button className={'pdp-rec-add-btn'} disableRipple>Add to Cart</Button>
												</Stack>
											</Link>
										</Stack>
									))}
								</Stack>
							</Stack>
						)}

					</Stack>
				</div>
			</div>
		);
	}
};

export default withLayoutFull(ProductDetail);

ProductDetail.defaultProps = {
	initialRating: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		direction: 'DESC',
		search: { productId: '' },
	},
};
