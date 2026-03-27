import React from 'react';
import { Stack, Box } from '@mui/material';
import { useQuery } from '@apollo/client';
import { GET_BANNERS } from '../../../apollo/user/query';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Link from 'next/link';

const PromoBanners = () => {
	const device = useDeviceDetect();

	const { data } = useQuery(GET_BANNERS, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: {
				page: 1,
				limit: 3,
				search: { bannerType: 'PROMO' },
			},
		},
	});

	const banners = data?.getBanners?.list ?? [];

	if (!banners.length) return null;

	if (device === 'mobile') return null;

	return (
		<Stack className={'promo-banners'}>
			<Stack className={'container'}>
				<Stack className={'promo-banners__grid'}>
					{banners.map((banner: any) => (
						<Link href={banner.bannerLink || '/product'} key={banner._id}>
							<Box
								component={'div'}
								className={'promo-banners__card'}
								style={
									banner.bannerImage
										? {
												backgroundImage: `url(${banner.bannerImage})`,
												backgroundSize: 'cover',
												backgroundPosition: 'center',
											}
										: {}
								}
							>
								<Box component={'div'} className={'promo-banners__content'}>
									<span className={'promo-banners__label'}>PROMO</span>
									<p className={'promo-banners__title'}>{banner.bannerTitle}</p>
									<span className={'promo-banners__cta'}>Shop Now →</span>
								</Box>
							</Box>
						</Link>
					))}
				</Stack>
			</Stack>
		</Stack>
	);
};

export default PromoBanners;
