import { Box, Menu, MenuItem, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import IconButton from '@mui/material/IconButton';
import ModeIcon from '@mui/icons-material/Mode';
import DeleteIcon from '@mui/icons-material/Delete';
import { Product } from '../../types/product/product';
import { formatterStr } from '../../utils';
import Moment from 'react-moment';
import { useRouter } from 'next/router';
import { ProductStatus } from '../../enums/product.enum';

interface ProductCardProps {
	product: Product;
	deleteProductHandler?: any;
	memberPage?: boolean;
	updateProductHandler?: any;
}

export const ProductCard = (props: ProductCardProps) => {
	const { product, deleteProductHandler, memberPage, updateProductHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	/** HANDLERS **/
	const pushEditProduct = async (productId: string) => {
		await router.push({
			pathname: '/mypage',
			query: { category: 'addProduct', productId: productId },
		});
	};

	const pushProductDetail = async (productId: string) => {
		if (memberPage)
			await router.push({
				pathname: '/product/detail',
				query: { id: productId },
			});
		else return;
	};

	const handleClick = (event: any) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	if (device === 'mobile') {
		return (
			<Stack className={'mob-mypage-product-card'} onClick={() => pushProductDetail(product?._id)}>
				<Box component={'div'} className={'mob-mypage-product-img-wrap'}>
					<img
						src={`${process.env.REACT_APP_API_URL}/${product.productImages[0]}`}
						alt={product.productTitle}
						className={'mob-mypage-product-img'}
					/>
				</Box>
				<Stack className={'mob-mypage-product-info'}>
					<Typography className={'mob-mypage-product-title'}>{product.productTitle}</Typography>
					<Typography className={'mob-mypage-product-brand'}>{product.productBrand} · {product.productCategory}</Typography>
					<Stack className={'mob-mypage-product-bottom'}>
						<Typography className={'mob-mypage-product-price'}>${formatterStr(product?.productPrice)}</Typography>
						<Stack className={'mob-mypage-product-meta'}>
							<span className={'mob-mypage-product-status'}>{product.productStatus}</span>
							<Typography className={'mob-mypage-product-views'}>{product.productViews.toLocaleString()} views</Typography>
						</Stack>
					</Stack>
					{!memberPage && product.productStatus === ProductStatus.ACTIVE && (
						<Stack className={'mob-mypage-product-actions'}>
							<IconButton size={'small'} onClick={(e) => { e.stopPropagation(); pushEditProduct(product._id); }}>
								<ModeIcon sx={{ fontSize: 18 }} />
							</IconButton>
							<IconButton size={'small'} onClick={(e) => { e.stopPropagation(); deleteProductHandler(product._id); }}>
								<DeleteIcon sx={{ fontSize: 18, color: '#e91e63' }} />
							</IconButton>
						</Stack>
					)}
				</Stack>
			</Stack>
		);
	} else
		return (
			<Stack className="product-card-box">
				<Stack className="image-box" onClick={() => pushProductDetail(product?._id)}>
					<img src={`${process.env.REACT_APP_API_URL}/${product.productImages[0]}`} alt="" />
				</Stack>
				<Stack className="information-box" onClick={() => pushProductDetail(product?._id)}>
					<Typography className="name">{product.productTitle}</Typography>
					<Typography className="address">{product.productBrand} · {product.productCategory}</Typography>
					<Typography className="price">
						<strong>${formatterStr(product?.productPrice)}</strong>
					</Typography>
				</Stack>
				<Stack className="date-box">
					<Typography className="date">
						<Moment format="DD MMMM, YYYY">{product.createdAt}</Moment>
					</Typography>
				</Stack>
				<Stack className="status-box">
					<Stack className="coloured-box" sx={{ background: '#E5F0FD' }} onClick={handleClick}>
						<Typography className="status" sx={{ color: '#3554d1' }}>
							{product.productStatus}
						</Typography>
					</Stack>
				</Stack>
				{!memberPage && product.productStatus !== ProductStatus.SOLD_OUT && (
					<Menu
						anchorEl={anchorEl}
						open={open}
						onClose={handleClose}
						PaperProps={{
							elevation: 0,
							sx: {
								width: '70px',
								mt: 1,
								ml: '10px',
								overflow: 'visible',
								filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
							},
							style: {
								padding: 0,
								display: 'flex',
								justifyContent: 'center',
							},
						}}
					>
						{product.productStatus === 'ACTIVE' && (
							<>
								<MenuItem
									disableRipple
									onClick={() => {
										handleClose();
										updateProductHandler(ProductStatus.SOLD_OUT, product?._id);
									}}
								>
									Sold
								</MenuItem>
							</>
						)}
					</Menu>
				)}

				<Stack className="views-box">
					<Typography className="views">{product.productViews.toLocaleString()}</Typography>
				</Stack>
				{!memberPage && product.productStatus === ProductStatus.ACTIVE && (
					<Stack className="action-box">
						<IconButton className="icon-button" onClick={() => pushEditProduct(product._id)}>
							<ModeIcon className="buttons" />
						</IconButton>
						<IconButton className="icon-button" onClick={() => deleteProductHandler(product._id)}>
							<DeleteIcon className="buttons" />
						</IconButton>
					</Stack>
				)}
			</Stack>
		);
};
