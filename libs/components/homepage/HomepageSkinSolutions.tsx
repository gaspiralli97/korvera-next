import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import { Product } from '../../types/product/product';
import ProductCard from '../product/ProductCard';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { GET_PRODUCT_RECOMMENDATIONS } from '../../../apollo/user/query';
import { LIKE_TARGET_PRODUCT } from '../../../apollo/user/mutation';
import { T } from '../../types/common';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { Message } from '../../enums/common.enum';
import { userVar } from '../../../apollo/store';

const HomepageSkinSolutions = () => {
	const user = useReactiveVar(userVar);
	const [products, setProducts] = useState<Product[]>([]);

	const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);

	const { refetch } = useQuery(GET_PRODUCT_RECOMMENDATIONS, {
		fetchPolicy: 'cache-and-network',
		skip: !user?._id,
		onCompleted: (data: T) => {
			setProducts(data?.getProductRecommendations?.list ?? []);
		},
	});

	const likeProductHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
			await likeTargetProduct({ variables: { input: id } });
			const result = await refetch();
			setProducts(result.data?.getProductRecommendations?.list ?? []);
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (!user?._id || products.length === 0) return null;

	return (
		<Stack className={'hp-recommend'}>
			<Stack className={'container'}>
				<Stack className={'info-box'}>
					<Box component={'div'} className={'left'}>
						<span>Recommended for You</span>
						<p>Picked based on what you love</p>
					</Box>
					<Box component={'div'} className={'right'}>
						<div className={'pagination-box'}>
							<WestIcon className={'swiper-recommend-prev'} />
							<div className={'swiper-recommend-pagination'}></div>
							<EastIcon className={'swiper-recommend-next'} />
						</div>
					</Box>
				</Stack>
				<Stack className={'card-box'}>
					<Swiper
						className={'top-property-swiper'}
						slidesPerView={4}
						spaceBetween={15}
						modules={[Autoplay, Navigation, Pagination]}
						navigation={{
							nextEl: '.swiper-recommend-next',
							prevEl: '.swiper-recommend-prev',
						}}
						pagination={{
							el: '.swiper-recommend-pagination',
						}}
					>
						{products.map((product: Product) => (
							<SwiperSlide className={'top-property-slide'} key={product._id}>
								<ProductCard product={product} likeProductHandler={likeProductHandler} />
							</SwiperSlide>
						))}
					</Swiper>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default HomepageSkinSolutions;
