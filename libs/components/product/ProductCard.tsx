import React from 'react';
import { Stack, Typography, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Product } from '../../types/product/product';
import Link from 'next/link';
import { formatterStr, getSaleInfo } from '../../utils';
import { REACT_APP_API_URL, topProductRank } from '../../config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';


interface ProductCardType {
	product: Product;
	likeProductHandler?: any;
	deleteProductHandler?: any;
	updateProductHandler?: any;
	myFavorites?: boolean;
	recentlyVisited?: boolean;
	isNew?: boolean;
	isTrending?: boolean;
}

const ProductCard = (props: ProductCardType) => {
	const { product, likeProductHandler, deleteProductHandler, updateProductHandler, myFavorites, recentlyVisited, isNew, isTrending } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const saleInfo = getSaleInfo(product?.productPrice ?? 0);
	const imagePath: string = product?.productImages[0]
		? product.productImages[0].startsWith('/')
			? product.productImages[0]
			: `${REACT_APP_API_URL}/${product.productImages[0]}`
		: '';

	if (device === 'mobile') {
		return (
			<Stack className={'mob-product-card'}>
				<Link href={{ pathname: '/product/detail', query: { id: product?._id } }} style={{ display: 'block' }}>
					<Box className={'mob-card-img'} style={{ backgroundImage: `url(${imagePath})` }}>
						{isTrending && <div className={'mob-card-badge mob-badge-hot'}>🔥 HOT</div>}
						{saleInfo && <div className={'mob-card-badge mob-badge-sale'}>{saleInfo.discount}% OFF</div>}
						{isNew && !saleInfo && <div className={'mob-card-badge mob-badge-new'}>NEW</div>}
					</Box>
				</Link>
				<Box className={'mob-card-info'}>
					<Link
						href={{ pathname: '/product/detail', query: { id: product?._id } }}
						className={'mob-card-title-link'}
					>
						<span className={'mob-card-title'}>{product.productTitle}</span>
					</Link>
					<span className={'mob-card-desc'}>{product.productBrand}, {product.productCategory}</span>
					<Box className={'mob-card-bott'}>
						{saleInfo ? (
							<Box className={'mob-card-price-wrap'}>
								<span className={'mob-card-price-original'}>${product.productPrice}</span>
								<span className={'mob-card-price-sale'}>${saleInfo.salePrice}</span>
							</Box>
						) : (
							<span className={'mob-card-price'}>${product.productPrice}</span>
						)}
						<Box className={'mob-card-actions'}>
							<IconButton onClick={() => likeProductHandler && likeProductHandler(user, product?._id)} size={'small'}>
								{product?.meLiked && product?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon sx={{ color: '#e91e63', fontSize: 18 }} />
								) : (
									<FavoriteBorderIcon sx={{ fontSize: 18 }} />
								)}
							</IconButton>
							<span className={'mob-card-likes'}>{product?.productLikes}</span>
						</Box>
					</Box>
				</Box>
			</Stack>
		);
	} else {
		return (
			<Stack className="card-config">
				<Stack className="top">
					<Link
						href={{
							pathname: '/product/detail',
							query: { id: product?._id },
						}}
					>
						<img src={imagePath} alt="" />
					</Link>
					{product && product?.productRank > topProductRank && (
						<Box component={'div'} className={'top-badge'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<Typography>TOP</Typography>
						</Box>
					)}
					{isTrending && (
						<Box component={'div'} className={'fire-badge'}>
							🔥 HOT
						</Box>
					)}
					{saleInfo && (
						<Box component={'div'} className={'sale-badge'}>
							{saleInfo.discount}% OFF
						</Box>
					)}
					{isNew && !saleInfo && (
						<Box component={'div'} className={'new-badge'}>
							NEW
						</Box>
					)}
					{!myFavorites && !recentlyVisited && (
						<Link
							href={{
								pathname: '/product/detail',
								query: { id: product?._id },
							}}
							className={'quicklook-link'}
						>
							<Box component={'div'} className={'quicklook-btn'}>
								<Typography>Quick Look</Typography>
							</Box>
						</Link>
					)}
				</Stack>
				<Stack className="bottom">
					<Stack className="name-address">
						<Stack className="name-price-row">
							<Link
								href={{
									pathname: '/product/detail',
									query: { id: product?._id },
								}}
								className={'name-link'}
							>
								<Typography className={'product-title'}>{product.productTitle}</Typography>
							</Link>
						</Stack>
						<Stack className="address">
							<Typography>
								{product.productBrand}, {product.productCategory}
							</Typography>
						</Stack>
					</Stack>
					<Stack className="options">
						<Stack className="option">
							<Typography>{product.productCategory}</Typography>
						</Stack>
						<Stack className="option">
							<Typography>{product.productVolume} ml</Typography>
						</Stack>
						{saleInfo ? (
							<Stack className="price-sale-wrap">
								<Typography className="price-original">${formatterStr(product?.productPrice)}</Typography>
								<Typography className="price-discounted">${formatterStr(saleInfo.salePrice)}</Typography>
							</Stack>
						) : (
							<Typography className={'product-price'}>${formatterStr(product?.productPrice)}</Typography>
						)}
					</Stack>
					<Stack className="divider"></Stack>
					<Stack className="type-buttons">
						<Stack className="type">
							<Typography sx={{ fontWeight: 500, fontSize: '13px' }}>
								{product.productStatus}
							</Typography>
						</Stack>
						{!recentlyVisited && (
							<Stack className="buttons">
								<IconButton color={'default'}>
									<RemoveRedEyeIcon />
								</IconButton>
								<Typography className="view-cnt">{product?.productViews}</Typography>
								<IconButton onClick={() => likeProductHandler(user, product?._id)}>
									{product?.meLiked && product?.meLiked[0]?.myFavorite ? (
										<FavoriteIcon sx={{ color: '#e91e63' }} />
									) : (
										<FavoriteBorderIcon />
									)}
								</IconButton>
								<Typography className="view-cnt">{product?.productLikes}</Typography>
							</Stack>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default ProductCard;
