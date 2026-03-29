import React from 'react';
import { Stack, Typography, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import IconButton from '@mui/material/IconButton';

export interface CrudProduct {
	_id: string;
	productImages: string[];
	productPrice: number;
	productTitle: string;
	productDesc: string;
	productBrand: string;
	productCategory: string;
	productSize: string;
	productVolume: number;
	productStatus: string;
	productViews: number;
	productLikes: number;
	productRank: number;
	createdAt: number;
}

interface CrudProductCardProps {
	product: CrudProduct;
}

const CrudProductCard = (props: CrudProductCardProps) => {
	const { product } = props;
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return <div>PRODUCT CARD</div>;
	} else {
		return (
			<Stack className="card-config">
				<Stack className="top">
					<img src={product.productImages[0]} alt="" />
					<Box component={'div'} className={'price-box'}>
						<Typography>${product.productPrice}</Typography>
					</Box>
				</Stack>
				<Stack className="bottom">
					<Stack className="name-address">
						<Stack className="name">
							<Typography>{product.productTitle}</Typography>
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
						<Stack className="buttons">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{product.productViews}</Typography>
							<IconButton color={'default'}>
								<FavoriteBorderIcon />
							</IconButton>
							<Typography className="view-cnt">{product.productLikes}</Typography>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default CrudProductCard;
