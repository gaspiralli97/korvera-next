import React from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useQuery } from '@apollo/client';
import { GET_EVENTS } from '../../../apollo/user/query';

const CATEGORY_FALLBACK: Record<string, string> = {
	SKINCARE: '/img/events/skincare.jpg',
	MAKEUP: '/img/fiber/img2.jpg',
	HAIRCARE: '/img/fiber/img4.jpg',
	WELLNESS: '/img/fiber/img5.jpg',
	FRAGRANCE: '/img/fiber/img3.jpg',
	BODYCARE: '/img/fiber/img7.jpg',
};

const EventCard = ({ event }: { event: any }) => {
	const device = useDeviceDetect();
	const imageSrc = event.eventImage || CATEGORY_FALLBACK[event.eventCategory] || '/img/fiber/img1.jpg';

	if (device === 'mobile') {
		return <div>EVENT CARD</div>;
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

	const events = data?.getEvents?.list ?? [];

	if (device === 'mobile') {
		return <div>EVENT CARD</div>;
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
