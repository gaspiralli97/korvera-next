import React from 'react';
import { Stack, Typography, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Product } from '../../types/product/product';
import Link from 'next/link';
import { formatterStr } from '../../utils';
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
}

const ProductCard = (props: ProductCardType) => {
	const { product, likeProductHandler, deleteProductHandler, updateProductHandler, myFavorites, recentlyVisited } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const imagePath: string = product?.productImages[0]
		? product.productImages[0].startsWith('/')
			? product.productImages[0]
			: `${REACT_APP_API_URL}/${product.productImages[0]}`
		: '/img/banner/header1.svg';

	if (device === 'mobile') {
		return <div>PRODUCT CARD</div>;
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
							<Typography className={'product-price'}>${formatterStr(product?.productPrice)}</Typography>
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
								<IconButton color={'default'} onClick={() => likeProductHandler(user, product?._id)}>
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
