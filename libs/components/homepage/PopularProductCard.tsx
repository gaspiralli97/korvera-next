import React from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Product } from '../../types/product/product';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { REACT_APP_API_URL, topProductRank } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface PopularProductCardProps {
	property: Product;
}

const PopularProductCard = (props: PopularProductCardProps) => {
	const { property } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	/** HANDLERS **/
	 const pushDetailHandler = async (propertyId:string) =>{
        console.log("propertyId", propertyId);
		await router.push({pathname:'/product/detail', query:{id:propertyId}});
	};

	if (device === 'mobile') {
		return (
			<Stack className="popular-card-box">
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${property?.productImages[0]})` }}
					onClick={() =>{pushDetailHandler(property._id);}}
				>
					{property && property?.productRank >= topProductRank ? (
						<div className={'status'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<span>top</span>
						</div>
					) : (
						''
					)}

					<div className={'price'}>${property.productPrice}</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong className={'title'} onClick={() =>{pushDetailHandler(property._id);}}>{property.productTitle}</strong>
					<p className={'desc'}>{property.productBrand}</p>
					<div className={'options'}>
						<div>
							<img src="/img/icons/discovery.svg" alt="" />
							<span>{property?.productCategory}</span>
						</div>
						<div>
							<img src="/img/icons/tune.svg" alt="" />
							<span>{property?.productSize}</span>
						</div>
						<div>
							<img src="/img/icons/expand.svg" alt="" />
							<span>{property?.productVolume} ml</span>
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<p>{property?.productStatus ?? ''}</p>
						<div className="view-like-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{property?.productViews}</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	} else {
		return (
			<Stack className="popular-card-box">
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${property?.productImages[0]})` }}
					onClick={() =>{pushDetailHandler(property._id);}}
				>
					{property && property?.productRank >= topProductRank ? (
						<div className={'status'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<span>top</span>
						</div>
					) : (
						''
					)}

					<div className={'price'}>${property.productPrice}</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong className={'title'} onClick={() =>{pushDetailHandler(property._id);}}>{property.productTitle}</strong>
					<p className={'desc'}>{property.productBrand}</p>
					<div className={'options'}>
						<div>
							<img src="/img/icons/discovery.svg" alt="" />
							<span>{property?.productCategory}</span>
						</div>
						<div>
							<img src="/img/icons/tune.svg" alt="" />
							<span>{property?.productSize}</span>
						</div>
						<div>
							<img src="/img/icons/expand.svg" alt="" />
							<span>{property?.productVolume} ml</span>
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<p>{property?.productStatus ?? ''}</p>
						<div className="view-like-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{property?.productViews}</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	}
};

export default PopularProductCard;
