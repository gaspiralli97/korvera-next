import React from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';

interface EventData {
	eventTitle: string;
	city: string;
	description: string;
	imageSrc: string;
}
const eventsData: EventData[] = [
	{
		eventTitle: 'Glow Skincare Collection',
		city: 'Skincare',
		description:
			'Discover our premium skincare collection designed to nourish, hydrate, and protect your skin every day.',
		imageSrc: '/img/events/skincare.jpg',
	},
	{
		eventTitle: 'Glamour Makeup Line',
		city: 'Makeup',
		description: 'Explore our bold and elegant makeup line crafted for every skin tone and occasion.',
		imageSrc: '/img/events/makeup.jpeg',
	},
	{
		eventTitle: 'Hair & Body Essentials',
		city: 'Haircare',
		description: 'From scalp care to body butters — our hair and body essentials keep you feeling fresh and radiant.',
		imageSrc: '/img/events/haircare.jpeg',
	},
	{
		eventTitle: 'Wellness & Fragrance',
		city: 'Wellness',
		description:
			'Indulge in our curated wellness and fragrance collection — crafted to elevate your self-care routine.',
		imageSrc: '/img/events/wellness.jpeg',
	},
];

const EventCard = ({ event }: { event: EventData }) => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return <div>EVENT CARD</div>;
	} else {
		return (
			<Stack
				className="event-card"
				style={{
					backgroundImage: `url(${event?.imageSrc})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat',
				}}
			>
				<Box component={'div'} className={'info'}>
					<strong>{event?.city}</strong>
					<span>{event?.eventTitle}</span>
				</Box>
				<Box component={'div'} className={'more'}>
					<span>{event?.description}</span>
				</Box>
			</Stack>
		);
	}
};

const Events = () => {
	const device = useDeviceDetect();

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
						{eventsData.map((event: EventData) => {
							return <EventCard event={event} key={event?.eventTitle} />;
						})}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default Events;
