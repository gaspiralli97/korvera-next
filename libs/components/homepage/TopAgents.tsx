import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Stack, Box, Typography, Button } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import EastIcon from '@mui/icons-material/East';
import WestIcon from '@mui/icons-material/West';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import TopAgentCard from './TopAgentCard';
import { Member } from '../../types/member/member';
import { AgentsInquiry } from '../../types/member/member.input';
import { GET_SELLERS } from '../../../apollo/user/query';
import { useQuery } from '@apollo/client';
import { T } from '../../types/common';

interface TopAgentsProps {
	initialInput: AgentsInquiry;
}

const TopAgents = (props: TopAgentsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [topAgents, setTopAgents] = useState<Member[]>([]);

	/** APOLLO REQUESTS **/
	const { loading: getSellersLoading } = useQuery(GET_SELLERS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setTopAgents(data?.getSellers?.list);
		},
	});

	if (!topAgents.length) return null;

	if (device === 'mobile') {
		return (
			<Stack className={'top-brands-section'}>
				<Stack className={'container'}>
					<Stack className={'section-header'}>
						<Typography className={'section-title'}>Top Sellers</Typography>
					</Stack>
					<Swiper
						className={'top-brands-swiper'}
						slidesPerView={'auto'}
						centeredSlides={true}
						spaceBetween={16}
						modules={[Autoplay]}
					>
						{topAgents.map((agent: Member) => (
							<SwiperSlide className={'top-brand-slide'} key={agent?._id}>
								<TopAgentCard agent={agent} key={agent?.memberNick} />
							</SwiperSlide>
						))}
					</Swiper>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'top-brands-section'}>
				<Stack className={'container'}>
					<Stack className={'section-header'}>
						<Box component={'div'} className={'header-left'}>
							<Typography className={'section-eyebrow'}>Discover Sellers</Typography>
							<Typography className={'section-title'}>Top Brands & Sellers</Typography>
							<Typography className={'section-desc'}>
								Shop from our most trusted cosmetics sellers
							</Typography>
						</Box>
						<Box component={'div'} className={'header-right'}>
							<Button
								className={'see-all-btn'}
								endIcon={<EastIcon />}
								onClick={() => router.push('/agent')}
							>
								See All Brands
							</Button>
							<Stack className={'swiper-nav'}>
								<Box component={'div'} className={'nav-btn swiper-brands-prev'}>
									<WestIcon />
								</Box>
								<Box component={'div'} className={'nav-btn swiper-brands-next'}>
									<EastIcon />
								</Box>
							</Stack>
						</Box>
					</Stack>

					<Swiper
						className={'top-brands-swiper'}
						slidesPerView={5}
						spaceBetween={20}
						modules={[Autoplay, Navigation, Pagination]}
						navigation={{
							nextEl: '.swiper-brands-next',
							prevEl: '.swiper-brands-prev',
						}}
					>
						{topAgents.map((agent: Member) => (
							<SwiperSlide className={'top-brand-slide'} key={agent?._id}>
								<TopAgentCard agent={agent} key={agent?.memberNick} />
							</SwiperSlide>
						))}
					</Swiper>
				</Stack>
			</Stack>
		);
	}
};

TopAgents.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		sort: 'memberRank',
		direction: 'DESC',
		search: {},
	},
};

export default TopAgents;
