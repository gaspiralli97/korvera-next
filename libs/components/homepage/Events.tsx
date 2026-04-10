import React from 'react';
import { Stack, Box, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useQuery } from '@apollo/client';
import { GET_EVENTS } from '../../../apollo/user/query';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper';

const CATEGORY_FALLBACK: Record<string, string> = {
	SKINCARE: '/img/korvera/skincare.jpg',
	MAKEUP: '/img/korvera/make-up.avif',
	HAIRCARE: '/img/korvera/haircare.jpg',
	WELLNESS: '/img/korvera/wellness.jpg',
	FRAGRANCE: '/img/korvera/fragrance.jpg',
	BODYCARE: '/img/korvera/bodycare.jpg',
};

const MOCK_EVENTS = [
	{
		_id: 'mock-1',
		eventTitle: 'Spring Glow Collection',
		eventDescription: 'Brighten your skin this spring with our curated glow essentials',
		eventCategory: 'SKINCARE',
		eventImage: '/img/korvera/spring.jpg',
	},
	{
		_id: 'mock-2',
		eventTitle: 'K-Beauty Edit',
		eventDescription: 'Discover the latest trends in Korean beauty — from glass skin to bold lips',
		eventCategory: 'MAKEUP',
		eventImage: '/img/korvera/k-beauty.jpg',
	},
	{
		_id: 'mock-3',
		eventTitle: 'Vegan Beauty',
		eventDescription: 'Clean, cruelty-free formulas that are kind to your skin and the planet',
		eventCategory: 'SKINCARE',
		eventImage: '/img/korvera/vegan.jpg',
	},
	{
		_id: 'mock-4',
		eventTitle: 'Limited Edition',
		eventDescription: 'Exclusive drops from your favourite brands — before they sell out',
		eventCategory: 'FRAGRANCE',
		eventImage: '/img/korvera/limited.jpg',
	},
];

const EventCard = ({ event }: { event: any }) => {
	const device = useDeviceDetect();
	const imageSrc = event.eventImage || CATEGORY_FALLBACK[event.eventCategory] || '/img/korvera/skincare.jpg';

	if (device === 'mobile') {
		return (
			<Stack
				className={'mob-event-card'}
				style={{ backgroundImage: `url(${imageSrc})` }}
			>
				<Box component={'div'} className={'mob-event-info'}>
					<strong className={'mob-event-category'}>
						{event.eventCategory.charAt(0) + event.eventCategory.slice(1).toLowerCase()}
					</strong>
					<span className={'mob-event-title'}>{event.eventTitle}</span>
					{event.eventDescription && (
						<span className={'mob-event-desc'}>{event.eventDescription}</span>
					)}
				</Box>
			</Stack>
		);
	} else {
		return (
			<Stack
				className="event-card"
				style={{
					backgroundImage: `url(${imageSrc})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat',
				}}
			>
				<Box component={'div'} className={'info'}>
					<strong>{event.eventCategory.charAt(0) + event.eventCategory.slice(1).toLowerCase()}</strong>
					<span>{event.eventTitle}</span>
				</Box>
				<Box component={'div'} className={'more'}>
					<span>{event.eventDescription}</span>
				</Box>
			</Stack>
		);
	}
};

const Events = () => {
	const device = useDeviceDetect();

	const { data } = useQuery(GET_EVENTS, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: {
				page: 1,
				limit: 4,
				search: {},
			},
		},
	});

	const events = data?.getEvents?.list?.length ? data.getEvents.list : MOCK_EVENTS;

	if (device === 'mobile') {
		return (
			<Stack className={'mob-events'}>
				<Stack className={'container'}>
					<Typography className={'mob-section-title'}>Collections</Typography>
					<Swiper
						className={'mob-events-swiper'}
						slidesPerView={1.2}
						spaceBetween={12}
						modules={[Autoplay]}
					>
						{events.map((event: any) => (
							<SwiperSlide key={event._id} className={'mob-event-slide'}>
								<EventCard event={event} />
							</SwiperSlide>
						))}
					</Swiper>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'events'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span className={'white'}>Collections</span>
							<p className={'white'}>Beauty collections waiting for you!</p>
						</Box>
					</Stack>
					<Stack className={'card-wrapper'}>
						{events.map((event: any) => (
							<EventCard event={event} key={event._id} />
						))}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default Events;
