import React from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';

const Notice = () => {
	const device = useDeviceDetect();

	/** APOLLO REQUESTS **/
	/** LIFECYCLES **/
	/** HANDLERS **/

	const data = [
		{
			no: 1,
			event: true,
			title: 'Spring Beauty Sale — Up to 40% off selected skincare & makeup',
			date: '01.03.2024',
		},
		{
			no: 2,
			title: 'New seller registration is now open — list your beauty products for free',
			date: '31.03.2024',
		},
		{
			no: 3,
			title: 'Korvera Beauty Points program launched — earn rewards on every purchase',
			date: '15.04.2024',
		},
		{
			no: 4,
			title: 'New arrivals: K-Beauty skincare collection now available',
			date: '20.04.2024',
		},
		{
			no: 5,
			title: 'Platform update: ingredient search and allergen filter now available',
			date: '01.05.2024',
		},
	];

	if (device === 'mobile') {
		return (
			<Stack className={'mob-notice-content'}>
				<span className={'mob-notice-heading'}>Notice</span>
				<Stack className={'mob-notice-list'}>
					{data.map((ele: any) => (
						<Stack className={`mob-notice-item${ele?.event ? ' event' : ''}`} key={ele.title}>
							<Box className={'mob-notice-left'}>
								{ele?.event ? (
									<span className={'mob-notice-badge'}>Event</span>
								) : (
									<span className={'mob-notice-no'}>{ele.no}</span>
								)}
							</Box>
							<Stack className={'mob-notice-body'}>
								<span className={'mob-notice-title'}>{ele.title}</span>
								<span className={'mob-notice-date'}>{ele.date}</span>
							</Stack>
						</Stack>
					))}
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'notice-content'}>
				<span className={'title'}>Notice</span>
				<Stack className={'main'}>
					<Box component={'div'} className={'top'}>
						<span>number</span>
						<span>title</span>
						<span>date</span>
					</Box>
					<Stack className={'bottom'}>
						{data.map((ele: any) => (
							<div className={`notice-card ${ele?.event && 'event'}`} key={ele.title}>
								{ele?.event ? <div>event</div> : <span className={'notice-number'}>{ele.no}</span>}
								<span className={'notice-title'}>{ele.title}</span>
								<span className={'notice-date'}>{ele.date}</span>
							</div>
						))}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default Notice;
