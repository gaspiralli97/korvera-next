import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import PopularProductCard from './PopularProductCard';
import { Product } from '../../types/product/product';
import Link from 'next/link';
import { ProductsInquiry } from '../../types/product/product.input';
import { useMutation, useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { LIKE_TARGET_PRODUCT } from '../../../apollo/user/mutation';
import { Message } from '../../enums/common.enum';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';

interface PopularProductsProps {
	initialInput: ProductsInquiry;
}

const PopularProducts = (props: PopularProductsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [popularProducts, setPopularProducts] = useState<Product[]>([]);

	/** APOLLO REQUESTS **/
	const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);
   const {
		loading:getPropertiesLoading,
		data:getPropertiesData,
		error:getPropertiesError,
		refetch: getPropertiesRefetch,
	}=useQuery(GET_PRODUCTS, {
		fetchPolicy:'cache-and-network',
		variables:{input:initialInput},
		notifyOnNetworkStatusChange:true,
		onCompleted:(data:T)=>{
			setPopularProducts(data?.getProducts?.list);
		},
	});
	/** HANDLERS **/
	const likeProductHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user?._id) throw new Error(Message.NOT_AUTHENTICATED);
			await likeTargetProduct({ variables: { input: id } });
			const result = await getPropertiesRefetch({ input: initialInput });
			setPopularProducts(result.data?.getProducts?.list ?? []);
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likeProductHandler', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (!popularProducts) return null;

	if (device === 'mobile') {
		return (
			<Stack className={'popular-products'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Popular Products</span>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'popular-product-swiper'}
							slidesPerView={'auto'}
							centeredSlides={true}
							spaceBetween={25}
							modules={[Autoplay]}
						>
							{popularProducts.map((product: Product) => {
								return (
									<SwiperSlide key={product._id} className={'popular-product-slide'}>
										<PopularProductCard product={product} likeProductHandler={likeProductHandler} />
									</SwiperSlide>
								);
							})}
						</Swiper>
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'popular-products'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Popular Products</span>
							<p>Popularity is based on views</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'more-box'}>
								<Link href={'/product'}>
									<span>See All Categories</span>
								</Link>
								<img src="/img/icons/rightup.svg" alt="" />
							</div>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'popular-product-swiper'}
							slidesPerView={'auto'}
							spaceBetween={25}
							modules={[Autoplay, Navigation, Pagination]}
							navigation={{
								nextEl: '.swiper-popular-next',
								prevEl: '.swiper-popular-prev',
							}}
							pagination={{
								el: '.swiper-popular-pagination',
							}}
						>
							{popularProducts.map((product: Product) => {
								return (
									<SwiperSlide key={product._id} className={'popular-product-slide'}>
										<PopularProductCard product={product} likeProductHandler={likeProductHandler} />
									</SwiperSlide>
								);
							})}
						</Swiper>
					</Stack>
					<Stack className={'pagination-box'}>
						<WestIcon className={'swiper-popular-prev'} />
						<div className={'swiper-popular-pagination'}></div>
						<EastIcon className={'swiper-popular-next'} />
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

PopularProducts.defaultProps = {
	initialInput: {
		page: 1,
		limit: 7,
		sort: 'productViews',
		direction: 'DESC',
		search: {},
	},
};

export default PopularProducts;
