import React from 'react';
import { useRouter } from 'next/router';
import { Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Member } from '../../types/member/member';
import { REACT_APP_API_URL } from '../../config';

interface TopAgentProps {
	agent: Member;
}

const TopAgentCard = (props: TopAgentProps) => {
	const { agent } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const agentImage = agent?.memberImage
		? `${REACT_APP_API_URL}/${agent?.memberImage}`
		: '/img/profile/defaultUser.svg';

	const handleClick = () => {
		router.push({ pathname: '/agent/detail', query: { agentId: agent?._id } });
	};

	return (
		<Stack className="top-brand-card" onClick={handleClick}>
			<Stack className={'brand-avatar-wrap'}>
				<img src={agentImage} alt={agent?.memberNick} className={'brand-avatar'} />
			</Stack>
			<Stack className={'brand-info'}>
				<Typography className={'brand-name'}>{agent?.memberNick}</Typography>
				<Typography className={'brand-products'}>
					{agent?.memberProducts ?? 0} products
				</Typography>
			</Stack>
		</Stack>
	);
};

export default TopAgentCard;
