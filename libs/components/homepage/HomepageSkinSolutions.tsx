import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import { Product } from '../../types/product/product';
import { ProductsInquiry } from '../../types/product/product.input';
import ProductCard from '../product/ProductCard';
import { useMutation, useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { LIKE_TARGET_PRODUCT } from '../../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { Message } from '../../enums/common.enum';
import { MOCK_PRODUCTS } from '../../data/mockProducts';

interface HomepageSkinSolutionsProps {
	initialInput: ProductsInquiry;
}

const HomepageSkinSolutions = (props: HomepageSkinSolutionsProps) => {
	const { initialInput } = props;
	const [products, setProducts] = useState<Product[]>([]);

	/** APOLLO REQUESTS **/
	const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);
	const {
		refetch: getProductsRefetch,
	} = useQuery(GET_PRODUCTS, {
		fetchPolicy:'cache-and-network',
		variables:{input:initialInput},
		notifyOnNetworkStatusChange:true,
		onCompleted:(data:T)=>{
			setProducts(data?.getProducts?.list);
		},
	});

	/** HANDLERS **/
	const likeProductHandler = async (user:T, id:string) => {
		try {
			if(!id) return;
			if(!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await likeTargetProduct({
				variables:{input:id},
			});
			await getProductsRefetch({input:initialInput});

			await sweetTopSmallSuccessAlert('success',800);
		} catch (err:any) {
			console.log('ERROR, likeProductHandler', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (!products) return null;

	return (
		<Stack className={'hp-recommend'}>
			<Stack className={'container'}>
				<Stack className={'info-box'}>
					<Box component={'div'} className={'left'}>
						<span>Recommended for You</span>
						<p>Picked based on what others love</p>
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
						className={'top-product-swiper'}
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
						{(products.length > 0 ? products : MOCK_PRODUCTS).map((product: Product) => (
							<SwiperSlide className={'top-product-slide'} key={product._id}>
								<ProductCard product={product} likeProductHandler={likeProductHandler} />
							</SwiperSlide>
						))}
					</Swiper>
				</Stack>
			</Stack>
		</Stack>
	);
};

HomepageSkinSolutions.defaultProps = {
	initialInput: {
		page: 1,
		limit: 8,
		sort: 'productRank',
		direction: 'DESC',
		search: {},
	},
};

export default HomepageSkinSolutions;
