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
	property: Product;
	likePropertyHandler?: any;
	myFavorites?: boolean;
	recentlyVisited?: boolean;
}

const ProductCard = (props: ProductCardType) => {
	const { property, likePropertyHandler, myFavorites, recentlyVisited } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const imagePath: string = property?.productImages[0]
		? property.productImages[0].startsWith('/')
			? property.productImages[0]
			: `${REACT_APP_API_URL}/${property.productImages[0]}`
		: '/img/banner/header1.svg';

	if (device === 'mobile') {
		return <div>PROPERTY CARD</div>;
	} else {
		return (
			<Stack className="card-config">
				<Stack className="top">
					<Link
						href={{
							pathname: '/product/detail',
							query: { id: property?._id },
						}}
					>
						<img src={imagePath} alt="" />
					</Link>
					{property && property?.productRank > topProductRank && (
						<Box component={'div'} className={'top-badge'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<Typography>TOP</Typography>
						</Box>
					)}
					<Box component={'div'} className={'price-box'}>
						<Typography>${formatterStr(property?.productPrice)}</Typography>
					</Box>
					<Link
						href={{
							pathname: '/product/detail',
							query: { id: property?._id },
						}}
						className={'quicklook-link'}
					>
						<Box component={'div'} className={'quicklook-btn'}>
							<Typography>Quick Look</Typography>
						</Box>
					</Link>
				</Stack>
				<Stack className="bottom">
					<Stack className="name-address">
						<Stack className="name">
							<Link
								href={{
									pathname: '/product/detail',
									query: { id: property?._id },
								}}
							>
								<Typography>{property.productTitle}</Typography>
							</Link>
						</Stack>
						<Stack className="address">
							<Typography>
								{property.productBrand}, {property.productCategory}
							</Typography>
						</Stack>
					</Stack>
					<Stack className="options">
						<Stack className="option">
							<Typography>{property.productCategory}</Typography>
						</Stack>
						<Stack className="option">
							<Typography>{property.productVolume} ml</Typography>
						</Stack>
					</Stack>
					<Stack className="divider"></Stack>
					<Stack className="type-buttons">
						<Stack className="type">
							<Typography sx={{ fontWeight: 500, fontSize: '13px' }}>
								{property.productStatus}
							</Typography>
						</Stack>
						{!recentlyVisited && (
							<Stack className="buttons">
								<IconButton color={'default'}>
									<RemoveRedEyeIcon />
								</IconButton>
								<Typography className="view-cnt">{property?.productViews}</Typography>
								<IconButton color={'default'} onClick={() => likePropertyHandler(user, property?._id)}>
									{myFavorites ? (
										<FavoriteIcon color="primary" />
									) : property?.meLiked && property?.meLiked[0]?.myFavorite ? (
										<FavoriteIcon color="primary" />
									) : (
										<FavoriteBorderIcon />
									)}
								</IconButton>
								<Typography className="view-cnt">{property?.productLikes}</Typography>
							</Stack>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default ProductCard;
