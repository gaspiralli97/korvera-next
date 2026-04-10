import React from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Box, Typography, Button } from '@mui/material';
import Link from 'next/link';
import { REACT_APP_API_URL } from '../../config';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface AgentCardProps {
	agent: any;
	likeMemberHandler: any;
}

const AgentCard = (props: AgentCardProps) => {
	const { agent, likeMemberHandler } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const imagePath: string = agent?.memberImage
		? `${REACT_APP_API_URL}/${agent?.memberImage}`
		: '/img/profile/defaultUser.svg';

	if (device === 'mobile') {
		return (
			<Stack className={'mob-agent-card'}>
				<Link href={{ pathname: '/seller/detail', query: { agentId: agent?._id } }}>
					<Box className={'mob-agent-cover'}>
						<img src={imagePath} alt={agent?.memberNick} className={'mob-agent-avatar'} />
					</Box>
				</Link>
				<Stack className={'mob-agent-body'}>
					<Stack className={'mob-agent-name-row'}>
						<Link href={{ pathname: '/seller/detail', query: { agentId: agent?._id } }}>
							<Typography className={'mob-agent-name'}>{agent?.memberFullName ?? agent?.memberNick}</Typography>
						</Link>
						<Box component={'span'} className={'mob-agent-badge'}>
							<StorefrontIcon sx={{ fontSize: 10 }} />
							Seller
						</Box>
					</Stack>
					<Stack className={'mob-agent-stats'}>
						<Stack className={'mob-agent-stat'}>
							<Typography className={'mob-agent-stat-value'}>{agent?.memberProducts ?? 0}</Typography>
							<Typography className={'mob-agent-stat-label'}>Products</Typography>
						</Stack>
						<Box component={'div'} className={'mob-agent-stat-divider'} />
						<Stack className={'mob-agent-stat'}>
							<Typography className={'mob-agent-stat-value'}>{agent?.memberFollowers ?? 0}</Typography>
							<Typography className={'mob-agent-stat-label'}>Followers</Typography>
						</Stack>
					</Stack>
					<Stack className={'mob-agent-actions'}>
						<Stack className={'mob-agent-meta'}>
							<RemoveRedEyeIcon sx={{ fontSize: 14, color: '#aaa' }} />
							<Typography className={'mob-agent-meta-count'}>{agent?.memberViews}</Typography>
							<IconButton size={'small'} onClick={() => likeMemberHandler(user, String(agent?._id ?? ''))}>
								{agent?.meLiked && agent?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon sx={{ fontSize: 14, color: '#e91e63' }} />
								) : (
									<FavoriteBorderIcon sx={{ fontSize: 14, color: '#aaa' }} />
								)}
							</IconButton>
							<Typography className={'mob-agent-meta-count'}>{agent?.memberLikes}</Typography>
						</Stack>
						<Link href={{ pathname: '/seller/detail', query: { agentId: agent?._id } }}>
							<Button variant={'outlined'} className={'mob-agent-view-btn'}>View Brand</Button>
						</Link>
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className="brand-card">
				{/* Top: cover background + avatar */}
				<Link href={{ pathname: '/seller/detail', query: { agentId: agent?._id } }}>
					<Box component={'div'} className={'brand-cover'}>
						<Box component={'div'} className={'brand-avatar-wrap'}>
							<img src={imagePath} alt={agent?.memberNick} className={'brand-avatar'} />
						</Box>
					</Box>
				</Link>

				{/* Body */}
				<Stack className={'brand-body'}>
					<Stack className={'brand-name-row'}>
						<Link href={{ pathname: '/seller/detail', query: { agentId: agent?._id } }}>
							<Typography className={'brand-name'}>{agent?.memberFullName ?? agent?.memberNick}</Typography>
						</Link>
						<Box component={'span'} className={'brand-badge'}>
							<StorefrontIcon sx={{ fontSize: 11 }} />
							Seller
						</Box>
					</Stack>

					{/* Stats */}
					<Stack className={'brand-stats'}>
						<Stack className={'stat'}>
							<Typography className={'stat-value'}>{agent?.memberProducts ?? 0}</Typography>
							<Typography className={'stat-label'}>Products</Typography>
						</Stack>
						<Box component={'div'} className={'stat-divider'} />
						<Stack className={'stat'}>
							<Typography className={'stat-value'}>{agent?.memberFollowers ?? 0}</Typography>
							<Typography className={'stat-label'}>Followers</Typography>
						</Stack>
					</Stack>

					{/* Actions */}
					<Stack className={'brand-actions'}>
						<Stack className={'brand-meta'}>
							<IconButton size="small" disableRipple>
								<RemoveRedEyeIcon sx={{ fontSize: 16, color: '#aaa' }} />
							</IconButton>
							<Typography className={'meta-count'}>{agent?.memberViews}</Typography>
							<IconButton size="small" onClick={() => likeMemberHandler(user, agent?._id)}>
								{agent?.meLiked && agent?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon sx={{ fontSize: 16, color: '#e91e63' }} />
								) : (
									<FavoriteBorderIcon sx={{ fontSize: 16, color: '#aaa' }} />
								)}
							</IconButton>
							<Typography className={'meta-count'}>{agent?.memberLikes}</Typography>
						</Stack>
						<Link href={{ pathname: '/seller/detail', query: { agentId: agent?._id } }}>
							<Button variant="outlined" className={'view-btn'}>
								View Brand
							</Button>
						</Link>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default AgentCard;
