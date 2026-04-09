import React from 'react';
import { Avatar, Badge, Box, Stack, Tooltip, Typography } from '@mui/material';
import { useReactiveVar } from '@apollo/client';
import { onlineUsersVar } from '../../apollo/store';
import { Member } from '../types/member/member';
import { REACT_APP_API_URL } from '../config';

const OnlineUsers = () => {
	const onlineMembers = useReactiveVar(onlineUsersVar);

	if (onlineMembers.length === 0) return null;

	return (
		<Stack className="online-users">
			<Box className="online-users-title">
				<Badge
					badgeContent={onlineMembers.length}
					color="success"
					sx={{ '& .MuiBadge-badge': { fontSize: '10px', minWidth: '16px', height: '16px' } }}
				>
					<Typography variant="caption" fontWeight={600}>
						Online
					</Typography>
				</Badge>
			</Box>

			<Stack className="online-users-list" direction="row" flexWrap="wrap" gap={1}>
				{onlineMembers.map((member: Member) => {
					const memberImage = member.memberImage
						? `${REACT_APP_API_URL}/${member.memberImage}`
						: '/img/profile/defaultUser.svg';

					return (
						<Tooltip key={member._id} title={member.memberNick} placement="top" arrow>
							<Box sx={{ position: 'relative', display: 'inline-flex' }}>
								<Avatar
									alt={member.memberNick}
									src={memberImage}
									sx={{ width: 32, height: 32, cursor: 'pointer' }}
								/>
								{/* Online indicator dot */}
								<Box
									sx={{
										position: 'absolute',
										bottom: 0,
										right: 0,
										width: 10,
										height: 10,
										borderRadius: '50%',
										backgroundColor: '#44b700',
										border: '2px solid #fff',
									}}
								/>
							</Box>
						</Tooltip>
					);
				})}
			</Stack>
		</Stack>
	);
};

export default OnlineUsers;
