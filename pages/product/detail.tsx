
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
		return <div>PROPERTY DETAIL PAGE</div>;
	} else {
		return (
			<div id={'property-detail-page'}>
				<div className={'container'}>
					<Stack className={'property-detail-config'}>

						{/* ───── HERO ───── */}
						<Stack className={'pd-hero'}>

							{/* Gallery */}
							<Stack className={'pd-gallery'}>
								<Stack className={'pd-thumbs'}>
									{property?.productImages.map((subImg: string) => (
										<Stack
											key={subImg}
											className={`pd-thumb${slideImage === subImg ? ' active' : ''}`}
											onClick={() => changeImageHandler(subImg)}
										>
											<img
												src={subImg.startsWith('/') ? subImg : `${REACT_APP_API_URL}/${subImg}`}
												alt=""
											/>
										</Stack>
									))}
								</Stack>
								<Stack className={'pd-main-img'}>
									<img
										src={
											slideImage
												? slideImage.startsWith('/')
													? slideImage
													: `${REACT_APP_API_URL}/${slideImage}`
												: '/img/product/bigImage.png'
										}
										alt={'main-image'}
									/>
								</Stack>
							</Stack>

							{/* Info Panel */}
							<Stack className={'pd-info'}>

								<Typography className={'pd-brand'}>{property?.productBrand}</Typography>
								<Typography className={'pd-title'}>{property?.productTitle}</Typography>

								{/* Rating row */}
								<Stack className={'pd-rating-row'}>
									<Stack className={'pd-stars'}>
										{[1, 2, 3, 4, 5].map((s) => (
											<span key={s} className={`pd-star${s <= Math.round(property?.productRating ?? 0) ? ' filled' : ''}`}>★</span>
										))}
									</Stack>
									<Typography className={'pd-rc'}>{property?.productRatingCount}</Typography>
									<span className={'pd-sep'}>·</span>
									<Typography className={'pd-ask'}>Ask a question</Typography>
									<span className={'pd-sep'}>·</span>
									<Stack className={'pd-pop-row'}>
										{property?.meLiked && property?.meLiked[0]?.myFavorite
											? <FavoriteIcon sx={{ fontSize: 15, color: '#eb6753' }} />
											: <FavoriteBorderIcon sx={{ fontSize: 15 }} />
										}
										<Typography>{property?.productLikes?.toLocaleString()}</Typography>
									</Stack>
								</Stack>

								<Stack className={'pd-praise'}>
									<Typography>
										Highly rated for:{' '}
										<span className={'pd-praise-tags'}>{property?.productSkinType?.slice(0, 3).join(', ')}</span>
									</Typography>
								</Stack>

								{/* Price */}
								<Stack className={'pd-price-block'}>
									<Typography className={'pd-price'}>${formatterStr(property?.productPrice)}</Typography>
									<Stack className={'pd-klarna'}>
										<Typography>
											or 4 payments of{' '}
											<strong>${((property?.productPrice ?? 0) / 4).toFixed(2)}</strong>{' '}
											with <span className={'pd-klarna-badge'}>Klarna</span>
										</Typography>
									</Stack>
								</Stack>

								<Typography className={'pd-replenish'}>
									Get It For{' '}
									<span className={'pd-replenish-price'}>${((property?.productPrice ?? 0) * 0.95).toFixed(2)} (5% Off)</span>{' '}
									With Auto-Replenish
								</Typography>

								{/* Size */}
								<Stack className={'pd-size-block'}>
									<Typography className={'pd-size-label'}>Standard size</Typography>
									<Stack className={'pd-size-options'}>
										<button className={'pd-size-btn active'}>{property?.productVolume} oz / {property?.productVolume} mL</button>
									</Stack>
								</Stack>

								{/* Delivery cards */}
								<Stack className={'pd-delivery'}>
									<Stack className={'pd-dc active'}>
										<Box component={'span'} className={'pd-dc-icon'}>
											<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
												<rect x="1" y="3" width="15" height="13" rx="1"/>
												<path d="M16 8h4l3 3v5h-7V8z"/>
												<circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
											</svg>
										</Box>
										<Stack className={'pd-dc-text'}>
											<Typography className={'pd-dc-title'}>Sign in for <strong>FREE shipping</strong></Typography>
										</Stack>
									</Stack>
									<Stack className={'pd-dc'}>
										<Box component={'span'} className={'pd-dc-icon'}>
											<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
												<polyline points="1 4 1 10 7 10"/>
												<polyline points="23 20 23 14 17 14"/>
												<path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
											</svg>
										</Box>
										<Stack className={'pd-dc-text'}>
											<Typography className={'pd-dc-title'}><strong>Auto-Replenish</strong></Typography>
											<Typography className={'pd-dc-sub'}>Save 5% on this item</Typography>
										</Stack>
									</Stack>
									<Stack className={'pd-dc'}>
										<Box component={'span'} className={'pd-dc-icon'}>
											<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
												<path d="M5 12H2l10-9 10 9h-3"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/>
											</svg>
										</Box>
										<Stack className={'pd-dc-text'}>
											<Typography className={'pd-dc-title'}>Same-Day Delivery</Typography>
										</Stack>
									</Stack>
									<Stack className={'pd-dc'}>
										<Box component={'span'} className={'pd-dc-icon'}>
											<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
												<rect x="2" y="7" width="20" height="14" rx="2"/>
												<path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
											</svg>
										</Box>
										<Stack className={'pd-dc-text'}>
											<Typography className={'pd-dc-title'}>Buy Online & Pick Up</Typography>
										</Stack>
									</Stack>
								</Stack>

								<Stack className={'pd-shipping-note'}>
									<Typography>
										Sign in or{' '}
										<span className={'pd-link'}>create an account</span>{' '}
										to enjoy <strong>FREE standard shipping</strong>.{' '}
										<span className={'pd-link'}>Shipping & Returns</span>
									</Typography>
								</Stack>

								{/* CTA */}
								<Stack className={'pd-cta'}>
									<Stack className={'pd-qty'}>
										<Typography className={'pd-qty-num'}>1</Typography>
										<span className={'pd-qty-arrow'}>▾</span>
									</Stack>
									<Button className={'pd-add-btn'}>
										<Stack className={'pd-add-inner'}>
											<Typography className={'pd-add-title'}>Add to Basket</Typography>
											<Typography className={'pd-add-sub'}>Get It Shipped</Typography>
										</Stack>
									</Button>
									<Box
										component={'div'}
										className={'pd-wishlist'}
										onClick={() => likePropertyHandler(user, property?._id as string)}
									>
										{property?.meLiked && property?.meLiked[0]?.myFavorite
											? <FavoriteIcon />
											: <FavoriteBorderIcon />
										}
									</Box>
								</Stack>

								<Stack className={'pd-popular-badge'}>
									<Typography>
										🔥 POPULAR NOW!{' '}
										<strong>{property?.productViews?.toLocaleString()}+</strong>{' '}
										people recently viewed this.
									</Typography>
								</Stack>

								<Stack className={'pd-meta-row'}>
									<Stack className={'pd-views-box'}>
										<RemoveRedEyeIcon sx={{ fontSize: 15 }} />
										<Typography>{property?.productViews} views</Typography>
									</Stack>
									<Typography className={'pd-listed'}>Listed {moment().diff(property?.createdAt, 'days')} days ago</Typography>
								</Stack>

							</Stack>
						</Stack>

						{/* ───── HIGHLIGHTS ───── */}
						<Stack className={'pd-highlights'}>
							<Typography className={'pd-section-title'}>Highlights</Typography>
							<Stack className={'pd-hl-grid'}>
								<Stack className={'pd-hl-item'}>
									<Stack className={'pd-hl-icon pd-hl-pink'}>
										<svg viewBox="0 0 24 24" width="22" height="22" fill="white"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
									</Stack>
									<Typography>Cruelty-Free ›</Typography>
								</Stack>
								{property?.productSkinType?.map((skin: string) => (
									<Stack key={skin} className={'pd-hl-item'}>
										<Stack className={'pd-hl-icon pd-hl-blue'}>
											<svg viewBox="0 0 24 24" width="22" height="22" fill="white"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/></svg>
										</Stack>
										<Typography>Best for {skin}</Typography>
									</Stack>
								))}
								<Stack className={'pd-hl-item'}>
									<Stack className={'pd-hl-icon pd-hl-orange'}>
										<svg viewBox="0 0 24 24" width="22" height="22" fill="white"><circle cx="12" cy="12" r="4"/><path stroke="white" strokeWidth="2" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
									</Stack>
									<Typography>SPF Protection</Typography>
								</Stack>
								<Stack className={'pd-hl-item'}>
									<Stack className={'pd-hl-icon pd-hl-red'}>
										<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M15 9l-6 6M9 9l6 6"/></svg>
									</Stack>
									<Typography>Non-Comedogenic</Typography>
								</Stack>
								<Stack className={'pd-hl-item'}>
									<Stack className={'pd-hl-icon pd-hl-teal'}>
										<svg viewBox="0 0 24 24" width="22" height="22" fill="white"><path d="M12 2a7 7 0 0 1 7 7c0 4.5-4 9-6.5 12.5a.7.7 0 0 1-1 0C9 18 5 13.5 5 9a7 7 0 0 1 7-7z"/><circle cx="12" cy="9" r="2.5" fill="rgba(255,255,255,0.6)"/></svg>
									</Stack>
									<Typography>Water Resistant</Typography>
								</Stack>
							</Stack>
						</Stack>

						{/* ───── DESCRIPTION + SIDEBAR ───── */}
						<Stack className={'property-desc-config'}>
							<Stack className={'left-config'}>

								{/* Product Details */}
								<Stack className={'pd-details-card'}>
									<Typography className={'pd-dc-header'}>Product Details</Typography>
									<Stack className={'pd-details-grid'}>
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
											<Box key={label} component={'div'} className={'pd-detail-row'}>
												<Typography className={'pd-dr-label'}>{label}</Typography>
												<Typography className={'pd-dr-val'}>{val}</Typography>
											</Box>
										))}
									</Stack>
								</Stack>

								{/* Description */}
								<Stack className={'prop-desc-config'}>
									<Stack className={'top'}>
										<Typography className={'title'}>About this Product</Typography>
										<Typography className={'desc'}>{property?.productDesc ?? 'No description available.'}</Typography>
									</Stack>
								</Stack>

								{/* Ratings Section */}
								<Stack className={'pd-ratings-section'}>
									<Stack className={'pd-rs-head'}>
										<Typography className={'pd-section-title'}>Ratings & Reviews ({commentTotal})</Typography>
										<Typography className={'pd-write-link'}>Write a review</Typography>
									</Stack>
									<Stack className={'pd-ratings-body'}>
										<Stack className={'pd-rating-summary'}>
											<Typography className={'pd-rsum-label'}>Summary</Typography>
											{[5, 4, 3, 2, 1].map((star) => (
												<Stack key={star} className={'pd-rs-row'}>
													<Typography className={'pd-rs-num'}>{star}</Typography>
													<Stack className={'pd-rs-track'}>
														<Stack className={'pd-rs-fill'} style={{ width: `${[60, 25, 10, 3, 2][5 - star]}%` }} />
													</Stack>
												</Stack>
											))}
											<Stack className={'pd-avg-block'}>
												<Typography className={'pd-avg-num'}>{(property?.productRating ?? 4.5).toFixed(1)}</Typography>
												<span className={'pd-avg-star'}>★</span>
											</Stack>
											<Typography className={'pd-avg-sub'}>{property?.productRatingCount} Reviews*</Typography>
										</Stack>
										<Stack className={'pd-pros-cons'}>
											<Stack className={'pd-pros'}>
												<Typography className={'pd-pc-label'}>Pros Mentioned</Typography>
												<Stack className={'pd-tags-row'}>
													{property?.productSkinType?.map((t: string) => (
														<span key={t} className={'pd-tag'}>{t}</span>
													))}
													<span className={'pd-tag'}>lightweight</span>
													<span className={'pd-tag'}>long-lasting</span>
												</Stack>
											</Stack>
											<Stack className={'pd-cons'}>
												<Typography className={'pd-pc-label'}>Cons Mentioned</Typography>
												<Stack className={'pd-tags-row'}>
													<span className={'pd-tag'}>strong scent</span>
													<span className={'pd-tag'}>packaging</span>
												</Stack>
											</Stack>
										</Stack>
									</Stack>
								</Stack>

								{/* Comments list */}
								{commentTotal !== 0 && (
									<Stack className={'reviews-config'}>
										<Stack className={'filter-box'}>
											<Stack className={'review-cnt'}>
												<svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="0 0 16 12" fill="none"><g clipPath="url(#s1)"><path d="M15.7183 4.60288C15.6171 4.3599 15.3413 4.18787 15.0162 4.16489L10.5822 3.8504L8.82988 0.64527C8.7005 0.409792 8.40612 0.257812 8.07846 0.257812C7.7508 0.257812 7.4563 0.409792 7.32774 0.64527L5.57541 3.8504L1.14072 4.16489C0.815641 4.18832 0.540363 4.36035 0.438643 4.60288C0.337508 4.84586 0.430908 5.11238 0.676772 5.28084L4.02851 7.57692L3.04025 10.9774C2.96794 11.2275 3.09216 11.486 3.35771 11.636C3.50045 11.717 3.66815 11.7575 3.83643 11.7575C3.98105 11.7575 4.12577 11.7274 4.25503 11.667L8.07846 9.88098L11.9012 11.667C12.1816 11.7979 12.5342 11.7859 12.7992 11.636C13.0648 11.486 13.189 11.2275 13.1167 10.9774L12.1284 7.57692L15.4801 5.28084C15.7259 5.11238 15.8194 4.84641 15.7183 4.60288Z" fill="#181A20"/></g><defs><clipPath id="s1"><rect width="15.36" height="12" fill="white" transform="translate(0.398438)"/></clipPath></defs></svg>
												<Typography className={'reviews'}>{commentTotal} reviews</Typography>
											</Stack>
										</Stack>
										<Stack className={'review-list'}>
											{productComments?.map((comment: Comment) => (
												<Review comment={comment} key={comment?._id} />
											))}
											<Box component={'div'} className={'pagination-box'}>
												<MuiPagination
													page={commentInquiry.page}
													count={Math.ceil(commentTotal / commentInquiry.limit)}
													onChange={commentPaginationChangeHandler}
													shape="circular"
													color="primary"
												/>
											</Box>
										</Stack>
									</Stack>
								)}

								{/* Leave review */}
								<Stack className={'leave-review-config'}>
									<Typography className={'main-title'}>Leave A Review</Typography>
									<Typography className={'review-title'}>Review</Typography>
									<textarea
										onChange={({ target: { value } }: any) => {
											setInsertCommentData({ ...insertCommentData, commentContent: value });
										}}
										value={insertCommentData.commentContent}
										placeholder="Share your experience with this product..."
									/>
									<Box className={'submit-btn'} component={'div'}>
										<Button
											className={'submit-review'}
											disabled={insertCommentData.commentContent === '' || user?._id === ''}
											onClick={createCommentHandler}
										>
											<Typography className={'title'}>Submit Review</Typography>
											<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none"><g clipPath="url(#s2)"><path d="M16.1571 0.5H6.37936C6.1337 0.5 5.93491 0.698792 5.93491 0.944458C5.93491 1.19012 6.1337 1.38892 6.37936 1.38892H15.0842L0.731781 15.7413C0.558156 15.915 0.558156 16.1962 0.731781 16.3698C0.818573 16.4566 0.932323 16.5 1.04603 16.5C1.15974 16.5 1.27345 16.4566 1.36028 16.3698L15.7127 2.01737V10.7222C15.7127 10.9679 15.9115 11.1667 16.1572 11.1667C16.4028 11.1667 16.6016 10.9679 16.6016 10.7222V0.944458C16.6016 0.698792 16.4028 0.5 16.1571 0.5Z" fill="#181A20"/></g><defs><clipPath id="s2"><rect width="16" height="16" fill="white" transform="translate(0.601562 0.5)"/></clipPath></defs></svg>
										</Button>
									</Box>
								</Stack>

							</Stack>

							{/* Seller sidebar */}
							<Stack className={'right-config'}>
								<Stack className={'info-box'}>
									<Typography className={'main-title'}>Get More Information</Typography>
									<Stack className={'image-info'}>
										<img
											className={'member-image'}
											src={property?.memberData?.memberImage ? `${REACT_APP_API_URL}/${property?.memberData?.memberImage}` : '/img/profile/defaultUser.svg'}
										/>
										<Stack className={'name-phone-listings'}>
											<Link href={`/member?memberId=${property?.memberData?._id}`}>
												<Typography className={'name'}>{property?.memberData?.memberNick}</Typography>
											</Link>
											<Stack className={'phone-number'}>
												<svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none"><g clipPath="url(#s3)"><path d="M16.2858 10.11L14.8658 8.69C14.5607 8.39872 14.1551 8.23619 13.7333 8.23619C13.3115 8.23619 12.9059 8.39872 12.6008 8.69L12.1008 9.19C11.7616 9.528 11.3022 9.71778 10.8233 9.71778C10.3444 9.71778 9.88506 9.528 9.54582 9.19C9.16082 8.805 8.91582 8.545 8.67082 8.29C8.42582 8.035 8.17082 7.76 7.77082 7.365C7.43312 7.02661 7.24347 6.56807 7.24347 6.09C7.24347 5.61193 7.43312 5.15339 7.77082 4.815L8.27082 4.315C8.74082 3.84 8.74082 3.185 8.27082 2.055L6.85082 0.625C6.44967 0.225577 5.9069 0.000919443 5.34082 0C4.77473 0 4.23196 0.225577 3.84082 0.625L2.48582 1.97C1.50938 2.94779 0.960937 4.27315 0.960938 5.655C0.960937 7.03685 1.50938 8.36221 2.48582 9.34C3.26582 10.12 4.15582 11 5.04082 11.92C5.92582 12.84 6.79582 13.7 7.57082 14.5C8.5484 15.4749 9.87269 16.0224 11.2533 16.0224C12.6339 16.0224 13.9582 15.4749 14.9358 14.5L16.2858 13.15C16.6828 12.7513 16.9073 12.2126 16.9108 11.65C16.9108 11.0874 16.6863 10.5488 16.2858 10.11Z" fill="#181A20"/></g><defs><clipPath id="s3"><rect width="16" height="16" fill="white" transform="translate(0.9375)"/></clipPath></defs></svg>
												<Typography className={'number'}>{property?.memberData?.memberPhone}</Typography>
											</Stack>
											<Typography className={'listings'}>View Listings</Typography>
										</Stack>
									</Stack>
								</Stack>
								<Stack className={'info-box'}>
									<Typography className={'sub-title'}>Name</Typography>
									<input type={'text'} placeholder={'Enter your name'} />
								</Stack>
								<Stack className={'info-box'}>
									<Typography className={'sub-title'}>Phone</Typography>
									<input type={'text'} placeholder={'Enter your phone'} />
								</Stack>
								<Stack className={'info-box'}>
									<Typography className={'sub-title'}>Email</Typography>
									<input type={'text'} placeholder={'Enter your email'} />
								</Stack>
								<Stack className={'info-box'}>
									<Typography className={'sub-title'}>Message</Typography>
									<textarea placeholder={'Hello, I am interested in this product...'}></textarea>
								</Stack>
								<Stack className={'info-box'}>
									<Button className={'send-message'}>
										<Typography className={'title'}>Send Message</Typography>
										<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none"><g clipPath="url(#s4)"><path d="M16.0556 0.5H6.2778C6.03214 0.5 5.83334 0.698792 5.83334 0.944458C5.83334 1.19012 6.03214 1.38892 6.2778 1.38892H14.9827L0.630219 15.7413C0.456594 15.915 0.456594 16.1962 0.630219 16.3698C0.71701 16.4566 0.83076 16.5 0.944469 16.5C1.05818 16.5 1.17189 16.4566 1.25872 16.3698L15.6111 2.01737V10.7222C15.6111 10.9679 15.8099 11.1667 16.0556 11.1667C16.3013 11.1667 16.5001 10.9679 16.5001 10.7222V0.944458C16.5 0.698792 16.3012 0.5 16.0556 0.5Z" fill="white"/></g><defs><clipPath id="s4"><rect width="16" height="16" fill="white" transform="translate(0.5 0.5)"/></clipPath></defs></svg>
									</Button>
								</Stack>
							</Stack>
						</Stack>

						{/* ───── SIMILAR PRODUCTS ───── */}
						{destinationProperties.length !== 0 && (
							<Stack className={'similar-properties-config'}>
								<Stack className={'title-pagination-box'}>
									<Stack className={'title-box'}>
										<Typography className={'main-title'}>You May Also Like</Typography>
										<Typography className={'sub-title'}>More from {property?.productCategory}</Typography>
									</Stack>
									<Stack className={'pagination-box'}>
										<WestIcon className={'swiper-similar-prev'} />
										<div className={'swiper-similar-pagination'}></div>
										<EastIcon className={'swiper-similar-next'} />
									</Stack>
								</Stack>
								<Stack className={'cards-box'}>
									<Swiper
										className={'similar-homes-swiper'}
										slidesPerView={'auto'}
										spaceBetween={35}
										modules={[Autoplay, Navigation, Pagination]}
										navigation={{ nextEl: '.swiper-similar-next', prevEl: '.swiper-similar-prev' }}
										pagination={{ el: '.swiper-similar-pagination' }}
									>
										{destinationProperties.map((property: Product) => (
											<SwiperSlide className={'similar-homes-slide'} key={property.productTitle}>
												<ProductBigCard property={property} likePropertyHandler={likePropertyHandler} />
											</SwiperSlide>
										))}
									</Swiper>
								</Stack>
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
