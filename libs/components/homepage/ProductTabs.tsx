import React, { useState } from 'react';
import { Stack, Box, Typography } from '@mui/material';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper';
import { Product } from '../../types/product/product';
import { ProductsInquiry } from '../../types/product/product.input';
import ProductCard from '../product/ProductCard';
import { useMutation, useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { LIKE_TARGET_PRODUCT } from '../../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { Direction, Message } from '../../enums/common.enum';

const TABS = [
	{ label: 'Trending', sort: 'productLikes' },
	{ label: 'Best Sellers', sort: 'productRank' },
	{ label: 'New Arrivals', sort: 'createdAt' },
];

const getInput = (tabIndex: number): ProductsInquiry => ({
	page: 1,
	limit: 8,
	sort: TABS[tabIndex].sort,
	direction: Direction.DESC,
	search: {},
});

const ProductTabs = () => {
	const [activeTab, setActiveTab] = useState(0);
	const [products, setProducts] = useState<Product[]>([]);

	/** APOLLO REQUESTS **/
	const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);
	const {
		refetch: getProductsRefetch,
	} = useQuery(GET_PRODUCTS, {
		fetchPolicy:'cache-and-network',
		variables:{input:getInput(0)},
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

			await likeTargetProduct({ variables:{input:id} });
			const result = await getProductsRefetch({input:getInput(activeTab)});
			setProducts(result.data?.getProducts?.list ?? []);

			await sweetTopSmallSuccessAlert('success',800);
		} catch (err:any) {
			console.log('ERROR, likeProductHandler', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const handleTabChange = (index: number) => {
		setActiveTab(index);
		setProducts([]);
		getProductsRefetch({input:getInput(index)});
	};

	return (
		<Stack className={'hp-product-tabs'}>
			<Stack className={'container'}>
				<Box component={'div'} className={'hp-pt-header'}>
					<Typography className={'hp-section-eyebrow'}>Discover</Typography>
					<Typography className={'hp-section-title'}>Shop by Mood</Typography>
				</Box>

				<Box className={'hp-pt-tabs'}>
					{TABS.map((tab, i) => (
						<button
							key={tab.label}
							className={`hp-pt-tab${activeTab === i ? ' active' : ''}`}
							onClick={() => handleTabChange(i)}
						>
							{tab.label}
						</button>
					))}
					<Box className={'hp-pt-nav'}>
						<WestIcon className={'swiper-pt-prev'} />
						<EastIcon className={'swiper-pt-next'} />
					</Box>
				</Box>

				<Box className={'hp-pt-swiper-wrap'}>
					<Swiper
						className={'pt-swiper'}
						slidesPerView={4}
						spaceBetween={16}
						modules={[Autoplay, Navigation]}
						navigation={{
							nextEl: '.swiper-pt-next',
							prevEl: '.swiper-pt-prev',
						}}
					>
						{products.map((product: Product) => (
							<SwiperSlide key={product._id} className={'pt-slide'}>
								<ProductCard product={product} likeProductHandler={likeProductHandler} />
							</SwiperSlide>
						))}
					</Swiper>
				</Box>
			</Stack>
		</Stack>
	);
};

export default ProductTabs;
