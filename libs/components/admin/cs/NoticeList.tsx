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

export interface MockNotice {
	id: string;
	title: string;
	priority: string;
	content: string;
	views: number;
	status: string;
	createdAt: string;
}

interface NoticeListProps {
	notices: MockNotice[];
	onStatusChange: (id: string, status: string) => void;
	onDelete: (id: string) => void;
}

export const NoticeList = (props: NoticeListProps) => {
	const { notices, onStatusChange, onDelete } = props;

	const [anchorEl, setAnchorEl] = useState<{ [key: string]: HTMLElement | null }>({});

	const handleMenuOpen = (e: React.MouseEvent<HTMLElement>, id: string) => {
		setAnchorEl((prev) => ({ ...prev, [id]: e.currentTarget }));
	};

	const handleMenuClose = (id: string) => {
		setAnchorEl((prev) => ({ ...prev, [id]: null }));
	};

	const getPriorityBadgeClass = (priority: string): string => {
		if (priority === 'HIGH') return 'badge error';
		if (priority === 'MEDIUM') return 'badge warning';
		if (priority === 'LOW') return 'badge success';
		return 'badge warning';
	};

	const getStatusBadgeClass = (status: string): string => {
		if (status === 'ACTIVE') return 'badge success';
		if (status === 'INACTIVE') return 'badge warning';
		return 'badge warning';
	};

	return (
		<Stack>
			<TableContainer>
				<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
					<TableHead>
						<TableRow>
							<TableCell align={'left'}>ID</TableCell>
							<TableCell align={'left'}>PRIORITY</TableCell>
							<TableCell align={'left'}>TITLE</TableCell>
							<TableCell align={'left'}>CONTENT</TableCell>
							<TableCell align={'left'}>VIEWS</TableCell>
							<TableCell align={'left'}>STATUS</TableCell>
							<TableCell align={'left'}>CREATED</TableCell>
							<TableCell align={'center'}>ACTIONS</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{notices.length === 0 && (
							<TableRow>
								<TableCell align={'center'} colSpan={8}>
									<span className={'no-data'}>No notices found</span>
								</TableCell>
							</TableRow>
						)}

						{notices.length !== 0 &&
							notices.map((notice: MockNotice) => (
								<TableRow hover key={notice.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
									<TableCell align={'left'}>
										<Typography variant={'body2'} sx={{ color: '#8A8A9A', fontSize: '12px' }}>
											{notice.id}
										</Typography>
									</TableCell>
									<TableCell align={'left'}>
										<span className={getPriorityBadgeClass(notice.priority)}>{notice.priority}</span>
									</TableCell>
									<TableCell align={'left'}>{notice.title}</TableCell>
									<TableCell align={'left'}>
										{notice.content.length > 60 ? notice.content.substring(0, 60) + '...' : notice.content}
									</TableCell>
									<TableCell align={'left'}>{notice.views}</TableCell>
									<TableCell align={'left'}>
										<span className={getStatusBadgeClass(notice.status)}>{notice.status}</span>
									</TableCell>
									<TableCell align={'left'}>{notice.createdAt}</TableCell>
									<TableCell align={'center'}>
										<IconButton size={'small'} onClick={(e) => handleMenuOpen(e, notice.id)}>
											<MoreVertIcon fontSize={'small'} />
										</IconButton>
										<Menu
											className={'menu-modal'}
											MenuListProps={{ 'aria-labelledby': 'notice-action-button' }}
											anchorEl={anchorEl[notice.id] ?? null}
											open={Boolean(anchorEl[notice.id])}
											onClose={() => handleMenuClose(notice.id)}
											sx={{ p: 1 }}
										>
											<MenuItem
												onClick={() => {
													onStatusChange(notice.id, 'ACTIVE');
													handleMenuClose(notice.id);
												}}
											>
												<Typography variant={'subtitle1'} component={'span'} sx={{ color: '#2e7d32' }}>
													Set Active
												</Typography>
											</MenuItem>
											<MenuItem
												onClick={() => {
													onStatusChange(notice.id, 'INACTIVE');
													handleMenuClose(notice.id);
												}}
											>
												<Typography variant={'subtitle1'} component={'span'} sx={{ color: '#ed6c02' }}>
													Set Inactive
												</Typography>
											</MenuItem>
											<MenuItem
												onClick={() => {
													onDelete(notice.id);
													handleMenuClose(notice.id);
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
