import React, { useState, useRef } from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Product } from '../../types/product/product';
import { REACT_APP_API_URL, topProductRank } from '../../config';
import { formatterStr } from '../../utils';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

interface ProductBigCardProps {
	product: Product;
	likeProductHandler?: any;
}

const LENS_SIZE = 80;

const ProductBigCard = (props: ProductBigCardProps) => {
	const { product, likeProductHandler } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();

	const [activeIdx, setActiveIdx] = useState(0);
	const [isZooming, setIsZooming] = useState(false);
	const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
	const [zoomBg, setZoomBg] = useState({ x: 0, y: 0 });
	const imgRef = useRef<HTMLDivElement>(null);

	const images: string[] = (product?.productImages ?? []).map((img) =>
		img.startsWith('/') ? img : `${REACT_APP_API_URL}/${img}`,
	);
	if (images.length === 0) images.push('/img/banner/header1.svg');

	const mainImage = images[activeIdx] ?? images[0];
	const thumbs = images.slice(0, 4);

	const goProductDetailPage = (e: React.MouseEvent) => {
		e.stopPropagation();
		router.push(`/product/detail?id=${product?._id}`);
	};

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		const rect = imgRef.current?.getBoundingClientRect();
		if (!rect) return;

		// Cursor position relative to image, clamped so lens stays inside
		const rawX = e.clientX - rect.left;
		const rawY = e.clientY - rect.top;

		const x = Math.max(0, Math.min(rawX - LENS_SIZE / 2, rect.width - LENS_SIZE));
		const y = Math.max(0, Math.min(rawY - LENS_SIZE / 2, rect.height - LENS_SIZE));

		setLensPos({ x, y });

		// Map lens position → zoom panel background-position percentage
		const bgX = rect.width === LENS_SIZE ? 0 : (x / (rect.width - LENS_SIZE)) * 100;
		const bgY = rect.height === LENS_SIZE ? 0 : (y / (rect.height - LENS_SIZE)) * 100;
		setZoomBg({ x: bgX, y: bgY });
	};

	if (device === 'mobile') {
		return <div>PRODUCT BIG CARD</div>;
	}

	return (
		<Stack className="product-big-card-box">
			{/* ── Image gallery: thumbnails left + main image right ── */}
			<Stack className={'card-gallery'} direction={'row'}>
				{/* Thumbnail strip */}
				{thumbs.length > 0 && (
					<Stack className={'thumb-strip'} direction={'column'}>
						{thumbs.map((src, i) => (
							<Box
								key={i}
								component={'div'}
								className={`thumb-item ${activeIdx === i ? 'active' : ''}`}
								onClick={(e: React.MouseEvent) => {
									e.stopPropagation();
									setActiveIdx(i);
								}}
								style={{ backgroundImage: `url(${src})` }}
							/>
						))}
					</Stack>
				)}

				{/* Main image with magnifier lens */}
				<Box
					ref={imgRef}
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${mainImage})` }}
					onClick={goProductDetailPage}
					onMouseEnter={() => setIsZooming(true)}
					onMouseLeave={() => setIsZooming(false)}
					onMouseMove={handleMouseMove}
				>
					{/* Lens overlay */}
					{isZooming && (
						<div
							className={'zoom-lens'}
							style={{ left: lensPos.x, top: lensPos.y }}
						/>
					)}

					{product && product?.productRank >= topProductRank && (
						<div className={'status'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<span>top</span>
						</div>
					)}
					<div className={'price'}>${formatterStr(product?.productPrice)}</div>
				</Box>
			</Stack>

			{/* Zoom panel — appears to the right of the card */}
			{isZooming && (
				<div
					className={'zoom-panel'}
					style={{
						backgroundImage: `url(${mainImage})`,
						backgroundPosition: `${zoomBg.x}% ${zoomBg.y}%`,
					}}
				/>
			)}

			{/* ── Info area ── */}
			<Box component={'div'} className={'info'}>
				<strong className={'title'} onClick={goProductDetailPage}>
					{product?.productTitle}
				</strong>
				<p className={'desc'}>{product?.productBrand}</p>
				<div className={'options'}>
					<div>
						<img src="/img/icons/discovery.svg" alt="" />
						<span>{product?.productCategory}</span>
					</div>
					<div>
						<img src="/img/icons/shower.svg" alt="" />
						<span>{product?.productSkinType?.[0] ?? 'All skin'}</span>
					</div>
					<div>
						<img src="/img/icons/expand.svg" alt="" />
						<span>{product?.productVolume} ml</span>
					</div>
				</div>
				<Divider sx={{ mt: '15px', mb: '17px' }} />
				<div className={'bott'}>
					<div />
					<div className="buttons-box">
						<IconButton color={'default'} size="small">
							<RemoveRedEyeIcon />
						</IconButton>
						<Typography className="view-cnt">{product?.productViews}</Typography>
						<IconButton
							color={'default'}
							size="small"
							onClick={(e: any) => {
								e.stopPropagation();
								likeProductHandler?.(user, product?._id);
							}}
						>
							{product?.meLiked && product?.meLiked[0]?.myFavorite ? (
								<FavoriteIcon sx={{ color: '#e91e63' }} />
							) : (
								<FavoriteBorderIcon />
							)}
						</IconButton>
						<Typography className="view-cnt">{product?.productLikes}</Typography>
					</div>
				</div>
			</Box>
		</Stack>
	);
};

export default ProductBigCard;
