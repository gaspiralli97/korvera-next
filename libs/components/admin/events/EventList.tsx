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

export interface MockEvent {
	id: string;
	title: string;
	category: string;
	description: string;
	image?: string;
	status: string;
	createdAt: string;
}

interface EventListProps {
	events: MockEvent[];
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
	if (status === 'INACTIVE') return 'badge warning';
	return 'badge warning';
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
							events.map((event: MockEvent) => (
								<TableRow hover key={event.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
									<TableCell align={'left'}>
										<Typography variant={'body2'} sx={{ color: '#8A8A9A', fontSize: '12px' }}>
											{event.id}
										</Typography>
									</TableCell>
									<TableCell align={'left'}>
										<span className={getCategoryBadgeClass(event.category)}>{event.category}</span>
									</TableCell>
									<TableCell align={'left'}>{event.title}</TableCell>
									<TableCell align={'left'}>
										{event.description.length > 60 ? event.description.substring(0, 60) + '...' : event.description}
									</TableCell>
									<TableCell align={'left'}>
										<span className={getStatusBadgeClass(event.status)}>{event.status}</span>
									</TableCell>
									<TableCell align={'left'}>{event.createdAt}</TableCell>
									<TableCell align={'center'}>
										<IconButton size={'small'} onClick={(e) => handleMenuOpen(e, event.id)}>
											<MoreVertIcon fontSize={'small'} />
										</IconButton>
										<Menu
											className={'menu-modal'}
											MenuListProps={{ 'aria-labelledby': 'event-action-button' }}
											anchorEl={anchorEl[event.id] ?? null}
											open={Boolean(anchorEl[event.id])}
											onClose={() => handleMenuClose(event.id)}
											sx={{ p: 1 }}
										>
											<MenuItem
												onClick={() => {
													onStatusChange(event.id, 'ACTIVE');
													handleMenuClose(event.id);
												}}
											>
												<Typography variant={'subtitle1'} component={'span'} sx={{ color: '#2e7d32' }}>
													Set Active
												</Typography>
											</MenuItem>
											<MenuItem
												onClick={() => {
													onStatusChange(event.id, 'INACTIVE');
													handleMenuClose(event.id);
												}}
											>
												<Typography variant={'subtitle1'} component={'span'} sx={{ color: '#ed6c02' }}>
													Set Inactive
												</Typography>
											</MenuItem>
											<MenuItem
												onClick={() => {
													onDelete(event.id);
													handleMenuClose(event.id);
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
