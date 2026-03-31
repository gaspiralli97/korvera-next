import React, { useState } from 'react';
import { Stack, Box, Typography } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { useQuery, useMutation } from '@apollo/client';
import { SEARCH_PRODUCTS } from '../../../apollo/user/query';
import { LIKE_TARGET_PRODUCT } from '../../../apollo/user/mutation';
import { Product } from '../../types/product/product';
import { ProductCertification } from '../../enums/product.enum';
import { T } from '../../types/common';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { Message } from '../../enums/common.enum';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import ProductCard from '../product/ProductCard';

const TABS: { label: string; value: ProductCertification; emoji: string }[] = [
	{ label: 'Organic', value: ProductCertification.ORGANIC, emoji: '🌿' },
	{ label: 'Vegan', value: ProductCertification.VEGAN, emoji: '🌱' },
	{ label: 'Cruelty Free', value: ProductCertification.CRUELTY_FREE, emoji: '🐰' },
	{ label: 'Paraben Free', value: ProductCertification.PARABEN_FREE, emoji: '✨' },
	{ label: 'Fragrance Free', value: ProductCertification.FRAGRANCE_FREE, emoji: '🍃' },
	{ label: 'Dermatologist Tested', value: ProductCertification.DERMATOLOGIST_TESTED, emoji: '🔬' },
];

const HomepageCleanBeauty = () => {
	const user = useReactiveVar(userVar);
	const [activeTab, setActiveTab] = useState(0);
	const [products, setProducts] = useState<Product[]>([]);

	const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);

	const { refetch } = useQuery(SEARCH_PRODUCTS, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: {
				page: 1,
				limit: 8,
				sort: 'productRating',
				direction: 'DESC',
				search: {
					certificationList: [TABS[activeTab].value],
				},
			},
		},
		onCompleted: (data: T) => {
			setProducts(data?.searchProducts?.list ?? []);
		},
	});

	const handleTabChange = (index: number) => {
		setActiveTab(index);
		refetch({
			input: {
				page: 1,
				limit: 8,
				sort: 'productRating',
				direction: 'DESC',
				search: {
					certificationList: [TABS[index].value],
				},
			},
		}).then((result: T) => {
			setProducts(result.data?.searchProducts?.list ?? []);
		});
	};

	const likeProductHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
			await likeTargetProduct({ variables: { input: id } });
			const result = await refetch();
			setProducts(result.data?.searchProducts?.list ?? []);
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (products.length === 0) return null;

	return (
		<Stack className={'hp-clean-beauty'}>
			<Stack className={'container'}>
				<Stack className={'hp-clean-beauty__header'}>
					<Box>
						<Typography className={'hp-section-eyebrow'}>Clean Beauty</Typography>
						<Typography className={'hp-section-title'}>Good for You & the Planet</Typography>
					</Box>
					<Box className={'hp-clean-beauty__nav'}>
						<WestIcon className={'swiper-clean-prev'} />
						<EastIcon className={'swiper-clean-next'} />
					</Box>
				</Stack>

				<Box className={'hp-clean-beauty__tabs'}>
					{TABS.map((tab, i) => (
						<button
							key={tab.value}
							className={`hp-clean-tab${activeTab === i ? ' active' : ''}`}
							onClick={() => handleTabChange(i)}
						>
							<span>{tab.emoji}</span>
							{tab.label}
						</button>
					))}
				</Box>

				<Swiper
					className={'hp-clean-beauty__swiper'}
					slidesPerView={4}
					spaceBetween={16}
					modules={[Autoplay, Navigation]}
					navigation={{
						nextEl: '.swiper-clean-next',
						prevEl: '.swiper-clean-prev',
					}}
				>
					{products.map((product: Product) => (
						<SwiperSlide key={product._id}>
							<div className={'card-config'}>
								<ProductCard product={product} likeProductHandler={likeProductHandler} />
							</div>
						</SwiperSlide>
					))}
				</Swiper>
			</Stack>
		</Stack>
	);
};

export default HomepageCleanBeauty;
