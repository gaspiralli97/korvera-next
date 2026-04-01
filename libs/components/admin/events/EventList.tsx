import React, { useState } from 'react';
import {
	TableCell,
	TableHead,
	TableBody,
	TableRow,
	Table,
	TableContainer,
	Menu,
	MenuItem,
	IconButton,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Event } from '../../../libs/types/event/event';

interface EventListProps {
	events: Event[];
	onStatusChange: (id: string, status: string) => void;
	onDelete: (id: string) => void;
}

const getCategoryBadgeClass = (category: string): string => {
	switch (category) {
		case 'SKINCARE':
			return 'badge success';
		case 'MAKEUP':
			return 'badge up';
		case 'HAIRCARE':
			return 'badge warning';
		case 'WELLNESS':
			return 'badge block';
		case 'FRAGRANCE':
			return 'badge error';
		case 'BODYCARE':
			return 'badge warning';
		default:
			return 'badge success';
	}
};

const getStatusBadgeClass = (status: string): string => {
	if (status === 'ACTIVE') return 'badge success';
	if (status === 'INACTIVE') return 'badge inactive';
	return 'badge inactive';
};

export const EventList = (props: EventListProps) => {
	const { events, onStatusChange, onDelete } = props;

	const [anchorEl, setAnchorEl] = useState<{ [key: string]: HTMLElement | null }>({});

	const handleMenuOpen = (e: React.MouseEvent<HTMLElement>, id: string) => {
		setAnchorEl((prev) => ({ ...prev, [id]: e.currentTarget }));
	};

	const handleMenuClose = (id: string) => {
		setAnchorEl((prev) => ({ ...prev, [id]: null }));
	};

	return (
		<Stack>
			<TableContainer>
				<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
					<TableHead>
						<TableRow>
							<TableCell align={'left'}>ID</TableCell>
							<TableCell align={'left'}>CATEGORY</TableCell>
							<TableCell align={'left'}>TITLE</TableCell>
							<TableCell align={'left'}>DESCRIPTION</TableCell>
							<TableCell align={'left'}>STATUS</TableCell>
							<TableCell align={'left'}>CREATED</TableCell>
							<TableCell align={'center'}>ACTIONS</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{events.length === 0 && (
							<TableRow>
								<TableCell align={'center'} colSpan={7}>
									<span className={'no-data'}>No events found</span>
								</TableCell>
							</TableRow>
						)}

						{events.length !== 0 &&
							events.map((event: Event) => (
								<TableRow hover key={event._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
									<TableCell align={'left'}>
										<Typography variant={'body2'} sx={{ color: '#8A8A9A', fontSize: '12px' }}>
											{event._id}
										</Typography>
									</TableCell>
									<TableCell align={'left'}>
										<span className={getCategoryBadgeClass(event.eventCategory)}>{event.eventCategory}</span>
									</TableCell>
									<TableCell align={'left'}>{event.eventTitle}</TableCell>
									<TableCell align={'left'}>
										{event.eventDescription.length > 60
											? event.eventDescription.substring(0, 60) + '...'
											: event.eventDescription}
									</TableCell>
									<TableCell align={'left'}>
										<span className={getStatusBadgeClass(event.eventStatus)}>{event.eventStatus}</span>
									</TableCell>
									<TableCell align={'left'}>
										{new Date(event.createdAt).toLocaleDateString('en-GB', {
											day: '2-digit',
											month: 'short',
											year: 'numeric',
										})}
									</TableCell>
									<TableCell align={'center'}>
										<IconButton size={'small'} onClick={(e) => handleMenuOpen(e, event._id)}>
											<MoreVertIcon fontSize={'small'} />
										</IconButton>
										<Menu
											className={'menu-modal'}
											MenuListProps={{ 'aria-labelledby': 'event-action-button' }}
											anchorEl={anchorEl[event._id] ?? null}
											open={Boolean(anchorEl[event._id])}
											onClose={() => handleMenuClose(event._id)}
											sx={{ p: 1 }}
										>
											<MenuItem
												onClick={() => {
													onStatusChange(event._id, 'ACTIVE');
													handleMenuClose(event._id);
												}}
											>
												<Typography variant={'subtitle1'} component={'span'} sx={{ color: '#2e7d32' }}>
													Set Active
												</Typography>
											</MenuItem>
											<MenuItem
												onClick={() => {
													onStatusChange(event._id, 'INACTIVE');
													handleMenuClose(event._id);
												}}
											>
												<Typography variant={'subtitle1'} component={'span'} sx={{ color: '#ed6c02' }}>
													Set Inactive
												</Typography>
											</MenuItem>
											<MenuItem
												onClick={() => {
													onDelete(event._id);
													handleMenuClose(event._id);
												}}
											>
												<Typography variant={'subtitle1'} component={'span'} sx={{ color: '#d32f2f' }}>
													Delete
												</Typography>
											</MenuItem>
										</Menu>
									</TableCell>
								</TableRow>
							))}
					</TableBody>
				</Table>
			</TableContainer>
		</Stack>
	);
};
