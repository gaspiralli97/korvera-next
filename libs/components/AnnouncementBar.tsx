import React from 'react';
import { Box } from '@mui/material';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CardGiftcardOutlinedIcon from '@mui/icons-material/CardGiftcardOutlined';
import SpaOutlinedIcon from '@mui/icons-material/SpaOutlined';

const MESSAGES = [
	{ icon: <LocalShippingOutlinedIcon sx={{ fontSize: 13 }} />, text: 'Free shipping on orders over $50' },
	{ icon: <AutoAwesomeIcon sx={{ fontSize: 13 }} />, text: 'New K-Beauty arrivals every week' },
	{ icon: <CardGiftcardOutlinedIcon sx={{ fontSize: 13 }} />, text: 'Use code KORVERA15 for 15% off your first order' },
	{ icon: <SpaOutlinedIcon sx={{ fontSize: 13 }} />, text: 'Cruelty-free & clean beauty — always' },
	{ icon: <LocalShippingOutlinedIcon sx={{ fontSize: 13 }} />, text: 'Free returns within 30 days' },
	{ icon: <AutoAwesomeIcon sx={{ fontSize: 13 }} />, text: 'Earn points with every purchase' },
];

const AnnouncementBar = () => {
	return (
		<Box className={'announcement-bar'}>
			<Box className={'announcement-track'}>
				{[...MESSAGES, ...MESSAGES].map((msg, i) => (
					<Box key={i} className={'announcement-item'}>
						{msg.icon}
						<span>{msg.text}</span>
					</Box>
				))}
			</Box>
		</Box>
	);
};

export default AnnouncementBar;
