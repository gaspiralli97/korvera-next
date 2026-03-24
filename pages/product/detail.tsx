
import React, { ChangeEvent, useEffect, useState } from 'react';
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
import { userVar } from '../../apollo/store';
import { CommentInput, CommentsInquiry } from '../../libs/types/comment/comment.input';
import { Comment } from '../../libs/types/comment/comment';
import { CommentGroup } from '../../libs/enums/comment.enum';
import { Pagination as MuiPagination } from '@mui/material';
import Link from 'next/link';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import 'swiper/css';
import 'swiper/css/pagination';

import { GET_COMMENTS, GET_PRODUCTS, GET_PRODUCT } from '../../apollo/user/query';
import { T } from '../../libs/types/common';
import { Direction, Message } from '../../libs/enums/common.enum';
import { CREATE_COMMENT, LIKE_TARGET_PRODUCT } from '../../apollo/user/mutation';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';


SwiperCore.use([Autoplay, Navigation, Pagination]);

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const PropertyDetail: NextPage = ({ initialComment, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [productId, setProductId] = useState<string | null>(null);
	const [property, setProperty] = useState<Product | null>(null);
	const [slideImage, setSlideImage] = useState<string>('');
	const [destinationProperties, setDestinationProperties] = useState<Product[]>([]);
	const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'reviews'>('description');
	const [commentInquiry, setCommentInquiry] = useState<CommentsInquiry>(initialComment);
	const [productComments, setProductComments] = useState<Comment[]>([]);
	const [commentTotal, setCommentTotal] = useState<number>(0);
	const [insertCommentData, setInsertCommentData] = useState<CommentInput>({
		commentGroup: CommentGroup.PRODUCT,
		commentContent: '',
		commentRefId: '',
	});

	/** APOLLO REQUESTS **/
	const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);
	const [createComment] = useMutation(CREATE_COMMENT);

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
			if (data?.getProduct) setProperty(data?.getProduct);
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
					categoryList: property?.productCategory ? [property?.productCategory] : [],
				},
			},
		},
		skip: !productId && !property,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			if (data?.getProducts?.list) setDestinationProperties(data?.getProducts?.list);
		},
	});

	const {
		loading: getCommentsLoading,
		data: getCommentsData,
		error: getCommentsError,
		refetch: getCommentsRefetch,
	} = useQuery(GET_COMMENTS, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: initialComment,
		},
		skip: !commentInquiry.search.commentRefId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			if (data?.getComments?.list) setProductComments(data?.getComments?.list);
			setCommentTotal(data?.getComments?.metaCounter[0]?.total ?? 0);
		},
	});
	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.id) {
			setProductId(router.query.id as string);
			setCommentInquiry({
				...commentInquiry,
				search: {
					commentRefId: router.query.id as string,
				},
			});
			setInsertCommentData({
				...insertCommentData,
				commentRefId: router.query.id as string,
			});
		}
	}, [router]);

	useEffect(() => {
		if (commentInquiry.search.commentRefId) {
			getCommentsRefetch({ input: commentInquiry });
		}
	}, [commentInquiry]);

	/** HANDLERS **/
	const changeImageHandler = (image: string) => {
		setSlideImage(image);
	};

	const likePropertyHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
			//execute likePropertyHandler Mutation
			await likeTargetProduct({ variables: { input: id }, });

			
			await getProductRefetch({ input: id });
			await getProductsRefetch({
				input: {
					page: 1,
					limit: 4,
					sort: 'createdAt',
					direction: Direction.DESC,
					search: {
						categoryList: [property?.productCategory],
					},
				},
			});

			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likePropertyHandler', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const commentPaginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
		commentInquiry.page = value;
		setCommentInquiry({ ...commentInquiry });
	};
 
	const createCommentHandler = async () => {
		try {
			if (!user._id) throw Error(Message.NOT_AUTHENTICATED);
			await createComment({ variables: { input: insertCommentData } });

			setInsertCommentData({ ...insertCommentData, commentContent: '' });

			await getCommentsRefetch({ input: commentInquiry });
		} catch (err) {
			await sweetErrorHandling(err);
		}
	};

	if (getProductsLoading) {
		return (
			<Stack
				sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '1080px' }}
			>
				<CircularProgress size={"4rem"}/>
			</Stack>
		);
	}


	if (device === 'mobile') {
		return <div>PRODUCT DETAIL PAGE</div>;
	} else {
		return (
			<div id={'product-detail-page'}>
				<div className={'container'}>
					<Stack className={'pdp-wrap'}>

						{/* ═══════════════════════════════════════
						    HERO — 2-column: gallery | info
						════════════════════════════════════════ */}
						<Stack className={'pdp-hero'}>

							{/* LEFT — image gallery */}
							<Stack className={'pdp-gallery'}>
								<Stack className={'pdp-thumbs'}>
									{property?.productImages.map((subImg: string) => (
										<Stack
											key={subImg}
											className={`pdp-thumb${slideImage === subImg ? ' active' : ''}`}
											onClick={() => changeImageHandler(subImg)}
										>
											<img
												src={subImg.startsWith('/') ? subImg : `${REACT_APP_API_URL}/${subImg}`}
												alt=""
											/>
										</Stack>
									))}
								</Stack>
								<Stack className={'pdp-main-img'}>
									<img
										src={
											slideImage
												? slideImage.startsWith('/')
													? slideImage
													: `${REACT_APP_API_URL}/${slideImage}`
												: '/img/product/bigImage.png'
										}
										alt={'product-main'}
									/>
								</Stack>
							</Stack>

							{/* RIGHT — product info */}
							<Stack className={'pdp-info'}>

								{/* Brand + Title */}
								<Typography className={'pdp-brand'}>{property?.productBrand}</Typography>
								<Typography className={'pdp-title'}>{property?.productTitle}</Typography>

								{/* Rating row */}
								<Stack className={'pdp-rating-row'}>
									<Stack className={'pdp-stars'}>
										{[1, 2, 3, 4, 5].map((s) => (
											<span key={s} className={`pdp-star${s <= Math.round(property?.productRating ?? 0) ? ' filled' : ''}`}>★</span>
										))}
									</Stack>
									<Typography className={'pdp-rating-count'}>{property?.productRatingCount} reviews</Typography>
									<span className={'pdp-dot'}>·</span>
									<Stack className={'pdp-likes-row'}>
										{property?.meLiked && property?.meLiked[0]?.myFavorite
											? <FavoriteIcon sx={{ fontSize: 14, color: '#e75480' }} />
											: <FavoriteBorderIcon sx={{ fontSize: 14 }} />
										}
										<Typography>{property?.productLikes?.toLocaleString()}</Typography>
									</Stack>
								</Stack>

								{/* Skin type praise */}
								{property?.productSkinType && property.productSkinType.length > 0 && (
									<Stack className={'pdp-praise'}>
										<Typography>
											Best for: <span className={'pdp-praise-tags'}>{property?.productSkinType?.slice(0, 3).join(', ')}</span>
										</Typography>
									</Stack>
								)}

								{/* Price */}
								<Stack className={'pdp-price-row'}>
									<Typography className={'pdp-price'}>${formatterStr(property?.productPrice)}</Typography>
									<Typography className={'pdp-installment'}>
										or 4 × <strong>${((property?.productPrice ?? 0) / 4).toFixed(2)}</strong> with <span className={'pdp-klarna'}>Klarna</span>
									</Typography>
								</Stack>

								{/* Auto-replenish note */}
								<Typography className={'pdp-replenish'}>
									Subscribe & Save 5% —{' '}
									<span className={'pdp-replenish-price'}>${((property?.productPrice ?? 0) * 0.95).toFixed(2)}</span>
								</Typography>

								{/* Size selector */}
								<Stack className={'pdp-size-block'}>
									<Typography className={'pdp-size-label'}>Size</Typography>
									<Stack className={'pdp-size-options'}>
										<button className={'pdp-size-btn active'}>
											{property?.productVolume} mL
										</button>
									</Stack>
								</Stack>

								{/* Delivery options */}
								<Stack className={'pdp-delivery-grid'}>
									{[
										{
											icon: (
												<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
													<rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/>
													<circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
												</svg>
											),
											label: 'Free Shipping',
											sub: 'Sign in to unlock',
											active: true,
										},
										{
											icon: (
												<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
													<polyline points="1 4 1 10 7 10"/><polyline points="23 20 23 14 17 14"/>
													<path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
												</svg>
											),
											label: 'Auto-Replenish',
											sub: 'Save 5% each order',
											active: false,
										},
										{
											icon: (
												<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
													<path d="M5 12H2l10-9 10 9h-3"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/>
												</svg>
											),
											label: 'Same-Day Delivery',
											sub: '',
											active: false,
										},
										{
											icon: (
												<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
													<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
												</svg>
											),
											label: 'Pick Up In Store',
											sub: '',
											active: false,
										},
									].map(({ icon, label, sub, active }) => (
										<Stack key={label} className={`pdp-delivery-card${active ? ' active' : ''}`}>
											<Box component={'span'} className={'pdp-dc-icon'}>{icon}</Box>
											<Stack className={'pdp-dc-body'}>
												<Typography className={'pdp-dc-label'}>{label}</Typography>
												{sub && <Typography className={'pdp-dc-sub'}>{sub}</Typography>}
											</Stack>
										</Stack>
									))}
								</Stack>

								{/* CTA row */}
								<Stack className={'pdp-cta-row'}>
									<Stack className={'pdp-qty-selector'}>
										<Typography className={'pdp-qty-val'}>1</Typography>
										<span className={'pdp-qty-caret'}>▾</span>
									</Stack>
									<Button className={'pdp-add-to-cart'}>
										Add to Basket
									</Button>
									<Box
										component={'div'}
										className={'pdp-wishlist-btn'}
										onClick={() => likePropertyHandler(user, property?._id as string)}
									>
										{property?.meLiked && property?.meLiked[0]?.myFavorite
											? <FavoriteIcon />
											: <FavoriteBorderIcon />
										}
									</Box>
								</Stack>

								{/* Popularity + meta */}
								<Stack className={'pdp-meta'}>
									<Stack className={'pdp-popularity'}>
										<Typography>
											🔥 <strong>{property?.productViews?.toLocaleString()}+</strong> people viewed this recently
										</Typography>
									</Stack>
									<Stack className={'pdp-views-listed'}>
										<Stack className={'pdp-views'}>
											<RemoveRedEyeIcon sx={{ fontSize: 14 }} />
											<Typography>{property?.productViews} views</Typography>
										</Stack>
										<Typography className={'pdp-listed'}>
											Listed {moment().diff(property?.createdAt, 'days')} days ago
										</Typography>
									</Stack>
								</Stack>

							</Stack>
						</Stack>

						{/* ═══════════════════════════════════════
						    HIGHLIGHTS — badge row
						════════════════════════════════════════ */}
						<Stack className={'pdp-highlights'}>
							{[
								{ emoji: '🐰', label: 'Cruelty-Free' },
								{ emoji: '🌿', label: 'Clean Formula' },
								{ emoji: '☀️', label: 'SPF Protection' },
								{ emoji: '🚫', label: 'Non-Comedogenic' },
								{ emoji: '💧', label: 'Water Resistant' },
								...(property?.productSkinType?.map((s) => ({ emoji: '✨', label: `Best for ${s}` })) ?? []),
							].map(({ emoji, label }) => (
								<Stack key={label} className={'pdp-hl-badge'}>
									<span className={'pdp-hl-emoji'}>{emoji}</span>
									<Typography className={'pdp-hl-label'}>{label}</Typography>
								</Stack>
							))}
						</Stack>

						{/* ═══════════════════════════════════════
						    TAB SECTION — Description | Ingredients | Reviews
						════════════════════════════════════════ */}
						<Stack className={'pdp-tabs-section'}>

							{/* Tab nav */}
							<Stack className={'pdp-tab-nav'}>
								{(['description', 'ingredients', 'reviews'] as const).map((tab) => (
									<button
										key={tab}
										className={`pdp-tab-btn${activeTab === tab ? ' active' : ''}`}
										onClick={() => setActiveTab(tab)}
									>
										{tab === 'description' && 'Description'}
										{tab === 'ingredients' && 'Ingredients'}
										{tab === 'reviews' && `Reviews (${commentTotal})`}
									</button>
								))}
							</Stack>

							{/* ── Tab: Description ── */}
							{activeTab === 'description' && (
								<Stack className={'pdp-tab-panel'}>
									{/* About */}
									<Stack className={'pdp-about'}>
										<Typography className={'pdp-panel-title'}>About this Product</Typography>
										<Typography className={'pdp-panel-body'}>{property?.productDesc ?? 'No description available.'}</Typography>
									</Stack>

									{/* Details table */}
									<Stack className={'pdp-details-card'}>
										<Typography className={'pdp-details-header'}>Product Details</Typography>
										<Stack className={'pdp-details-grid'}>
											{[
												{ label: 'Category', val: property?.productCategory },
												{ label: 'Volume', val: `${property?.productVolume} mL` },
												{ label: 'Size', val: property?.productSize },
												{ label: 'Brand', val: property?.productBrand },
												{ label: 'Status', val: property?.productStatus },
												{ label: 'Price', val: `$${formatterStr(property?.productPrice)}` },
												{ label: 'Listed', val: moment(property?.createdAt).format('MMM D, YYYY') },
												{ label: 'Skin Type', val: property?.productSkinType?.join(', ') },
											].map(({ label, val }) => (
												<Box key={label} component={'div'} className={'pdp-detail-row'}>
													<Typography className={'pdp-detail-label'}>{label}</Typography>
													<Typography className={'pdp-detail-val'}>{val}</Typography>
												</Box>
											))}
										</Stack>
									</Stack>

									{/* Seller info card */}
									<Stack className={'pdp-seller-card'}>
										<Typography className={'pdp-seller-title'}>Sold By</Typography>
										<Stack className={'pdp-seller-body'}>
											<img
												className={'pdp-seller-avatar'}
												src={property?.memberData?.memberImage ? `${REACT_APP_API_URL}/${property?.memberData?.memberImage}` : '/img/profile/defaultUser.svg'}
												alt={'seller'}
											/>
											<Stack className={'pdp-seller-info'}>
												<Link href={`/member?memberId=${property?.memberData?._id}`}>
													<Typography className={'pdp-seller-name'}>{property?.memberData?.memberNick}</Typography>
												</Link>
												<Stack className={'pdp-seller-phone'}>
													<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 17 16" fill="none"><g clipPath="url(#s3)"><path d="M16.2858 10.11L14.8658 8.69C14.5607 8.39872 14.1551 8.23619 13.7333 8.23619C13.3115 8.23619 12.9059 8.39872 12.6008 8.69L12.1008 9.19C11.7616 9.528 11.3022 9.71778 10.8233 9.71778C10.3444 9.71778 9.88506 9.528 9.54582 9.19C9.16082 8.805 8.91582 8.545 8.67082 8.29C8.42582 8.035 8.17082 7.76 7.77082 7.365C7.43312 7.02661 7.24347 6.56807 7.24347 6.09C7.24347 5.61193 7.43312 5.15339 7.77082 4.815L8.27082 4.315C8.74082 3.84 8.74082 3.185 8.27082 2.055L6.85082 0.625C6.44967 0.225577 5.9069 0.000919443 5.34082 0C4.77473 0 4.23196 0.225577 3.84082 0.625L2.48582 1.97C1.50938 2.94779 0.960937 4.27315 0.960938 5.655C0.960937 7.03685 1.50938 8.36221 2.48582 9.34C3.26582 10.12 4.15582 11 5.04082 11.92C5.92582 12.84 6.79582 13.7 7.57082 14.5C8.5484 15.4749 9.87269 16.0224 11.2533 16.0224C12.6339 16.0224 13.9582 15.4749 14.9358 14.5L16.2858 13.15C16.6828 12.7513 16.9073 12.2126 16.9108 11.65C16.9108 11.0874 16.6863 10.5488 16.2858 10.11Z" fill="#8A8A9A"/></g><defs><clipPath id="s3"><rect width="16" height="16" fill="white" transform="translate(0.9375)"/></clipPath></defs></svg>
													<Typography>{property?.memberData?.memberPhone}</Typography>
												</Stack>
												<Typography className={'pdp-seller-listings'}>View all listings</Typography>
											</Stack>
										</Stack>
										{/* Contact form */}
										<Stack className={'pdp-contact-form'}>
											<Stack className={'pdp-form-row'}>
												<Stack className={'pdp-field'}>
													<Typography className={'pdp-field-label'}>Name</Typography>
													<input type={'text'} placeholder={'Your name'} />
												</Stack>
												<Stack className={'pdp-field'}>
													<Typography className={'pdp-field-label'}>Email</Typography>
													<input type={'text'} placeholder={'Your email'} />
												</Stack>
											</Stack>
											<Stack className={'pdp-field'}>
												<Typography className={'pdp-field-label'}>Phone</Typography>
												<input type={'text'} placeholder={'Your phone'} />
											</Stack>
											<Stack className={'pdp-field'}>
												<Typography className={'pdp-field-label'}>Message</Typography>
												<textarea placeholder={'Hello, I am interested in this product...'}></textarea>
											</Stack>
											<Button className={'pdp-send-btn'}>
												Send Message
												<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 17 17" fill="none"><g clipPath="url(#s4)"><path d="M16.0556 0.5H6.2778C6.03214 0.5 5.83334 0.698792 5.83334 0.944458C5.83334 1.19012 6.03214 1.38892 6.2778 1.38892H14.9827L0.630219 15.7413C0.456594 15.915 0.456594 16.1962 0.630219 16.3698C0.71701 16.4566 0.83076 16.5 0.944469 16.5C1.05818 16.5 1.17189 16.4566 1.25872 16.3698L15.6111 2.01737V10.7222C15.6111 10.9679 15.8099 11.1667 16.0556 11.1667C16.3013 11.1667 16.5001 10.9679 16.5001 10.7222V0.944458C16.5 0.698792 16.3012 0.5 16.0556 0.5Z" fill="white"/></g><defs><clipPath id="s4"><rect width="16" height="16" fill="white" transform="translate(0.5 0.5)"/></clipPath></defs></svg>
											</Button>
										</Stack>
									</Stack>
								</Stack>
							)}

							{/* ── Tab: Ingredients ── */}
							{activeTab === 'ingredients' && (
								<Stack className={'pdp-tab-panel'}>
									<Stack className={'pdp-ingredients'}>
										<Typography className={'pdp-panel-title'}>Key Ingredients</Typography>
										{property?.keyIngredients && property.keyIngredients.length > 0 ? (
											<Stack className={'pdp-key-ingredients'}>
												{property.keyIngredients.map((ing, idx) => (
													<Stack key={idx} className={'pdp-ing-card'}>
														<Typography className={'pdp-ing-name'}>{ing.name}</Typography>
														<Typography className={'pdp-ing-benefit'}>{ing.benefit}</Typography>
													</Stack>
												))}
											</Stack>
										) : (
											<Typography className={'pdp-panel-body'}>No key ingredients listed.</Typography>
										)}

										<Typography className={'pdp-panel-title'} sx={{ mt: '32px' }}>Full Ingredient List</Typography>
										<Typography className={'pdp-ingredient-list'}>
											{property?.ingredients?.join(', ') ?? 'Not available.'}
										</Typography>

										{/* Certifications */}
										{property?.certifications && property.certifications.length > 0 && (
											<>
												<Typography className={'pdp-panel-title'} sx={{ mt: '32px' }}>Certifications</Typography>
												<Stack className={'pdp-cert-row'}>
													{property.certifications.map((cert) => (
														<span key={cert} className={'pdp-cert-badge'}>{cert.replace(/_/g, ' ')}</span>
													))}
												</Stack>
											</>
										)}
									</Stack>
								</Stack>
							)}

							{/* ── Tab: Reviews ── */}
							{activeTab === 'reviews' && (
								<Stack className={'pdp-tab-panel'}>
									{/* Rating summary */}
									<Stack className={'pdp-rating-summary'}>
										<Stack className={'pdp-avg-block'}>
											<Typography className={'pdp-avg-num'}>{(property?.productRating ?? 4.5).toFixed(1)}</Typography>
											<span className={'pdp-avg-star'}>★</span>
											<Typography className={'pdp-avg-sub'}>{property?.productRatingCount} Reviews</Typography>
										</Stack>
										<Stack className={'pdp-bar-chart'}>
											{[5, 4, 3, 2, 1].map((star) => (
												<Stack key={star} className={'pdp-bar-row'}>
													<Typography className={'pdp-bar-label'}>{star} ★</Typography>
													<Stack className={'pdp-bar-track'}>
														<Stack className={'pdp-bar-fill'} style={{ width: `${[60, 25, 10, 3, 2][5 - star]}%` }} />
													</Stack>
													<Typography className={'pdp-bar-pct'}>{[60, 25, 10, 3, 2][5 - star]}%</Typography>
												</Stack>
											))}
										</Stack>
										<Stack className={'pdp-tag-summary'}>
											<Stack className={'pdp-pros'}>
												<Typography className={'pdp-tag-label'}>Pros</Typography>
												<Stack className={'pdp-tag-row'}>
													{property?.productSkinType?.map((t: string) => (
														<span key={t} className={'pdp-tag'}>{t}</span>
													))}
													<span className={'pdp-tag'}>lightweight</span>
													<span className={'pdp-tag'}>long-lasting</span>
												</Stack>
											</Stack>
											<Stack className={'pdp-cons'}>
												<Typography className={'pdp-tag-label'}>Cons</Typography>
												<Stack className={'pdp-tag-row'}>
													<span className={'pdp-tag'}>strong scent</span>
													<span className={'pdp-tag'}>packaging</span>
												</Stack>
											</Stack>
										</Stack>
									</Stack>

									{/* Review list */}
									{commentTotal !== 0 && (
										<Stack className={'pdp-review-list'}>
											{productComments?.map((comment: Comment) => (
												<Review comment={comment} key={comment?._id} />
											))}
											<Box component={'div'} className={'pdp-review-pagination'}>
												<MuiPagination
													page={commentInquiry.page}
													count={Math.ceil(commentTotal / commentInquiry.limit)}
													onChange={commentPaginationChangeHandler}
													shape="circular"
													color="primary"
												/>
											</Box>
										</Stack>
									)}

									{/* Write review */}
									<Stack className={'pdp-write-review'}>
										<Typography className={'pdp-panel-title'}>Leave A Review</Typography>
										<textarea
											onChange={({ target: { value } }: any) => {
												setInsertCommentData({ ...insertCommentData, commentContent: value });
											}}
											value={insertCommentData.commentContent}
											placeholder="Share your experience with this product..."
										/>
										<Box className={'pdp-submit-row'} component={'div'}>
											<Button
												className={'pdp-submit-btn'}
												disabled={insertCommentData.commentContent === '' || user?._id === ''}
												onClick={createCommentHandler}
											>
												Submit Review
												<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 17 17" fill="none"><g clipPath="url(#s2)"><path d="M16.1571 0.5H6.37936C6.1337 0.5 5.93491 0.698792 5.93491 0.944458C5.93491 1.19012 6.1337 1.38892 6.37936 1.38892H15.0842L0.731781 15.7413C0.558156 15.915 0.558156 16.1962 0.731781 16.3698C0.818573 16.4566 0.932323 16.5 1.04603 16.5C1.15974 16.5 1.27345 16.4566 1.36028 16.3698L15.7127 2.01737V10.7222C15.7127 10.9679 15.9115 11.1667 16.1572 11.1667C16.4028 11.1667 16.6016 10.9679 16.6016 10.7222V0.944458C16.6016 0.698792 16.4028 0.5 16.1571 0.5Z" fill="#fff"/></g><defs><clipPath id="s2"><rect width="16" height="16" fill="white" transform="translate(0.601562 0.5)"/></clipPath></defs></svg>
											</Button>
										</Box>
									</Stack>
								</Stack>
							)}
						</Stack>

						{/* ═══════════════════════════════════════
						    RECOMMENDATIONS — product slider
						════════════════════════════════════════ */}
						{destinationProperties.length !== 0 && (
							<Stack className={'pdp-recommendations'}>
								<Stack className={'pdp-rec-header'}>
									<Stack className={'pdp-rec-titles'}>
										<Typography className={'pdp-rec-title'}>You May Also Like</Typography>
										<Typography className={'pdp-rec-sub'}>More from {property?.productCategory}</Typography>
									</Stack>
									<Stack className={'pdp-rec-nav'}>
										<WestIcon className={'swiper-rec-prev'} />
										<div className={'swiper-rec-pagination'}></div>
										<EastIcon className={'swiper-rec-next'} />
									</Stack>
								</Stack>
								<Swiper
									className={'pdp-rec-swiper'}
									slidesPerView={'auto'}
									spaceBetween={24}
									modules={[Autoplay, Navigation, Pagination]}
									navigation={{ nextEl: '.swiper-rec-next', prevEl: '.swiper-rec-prev' }}
									pagination={{ el: '.swiper-rec-pagination' }}
								>
									{destinationProperties.map((property: Product) => (
										<SwiperSlide className={'pdp-rec-slide'} key={property.productTitle}>
											<ProductBigCard property={property} likePropertyHandler={likePropertyHandler} />
										</SwiperSlide>
									))}
								</Swiper>
							</Stack>
						)}

					</Stack>
				</div>
			</div>
		);
	}
};

export default PropertyDetail;

PropertyDetail.defaultProps = {
	initialComment: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		direction: 'DESC',
		search: { commentRefId: '' },
	},
};
