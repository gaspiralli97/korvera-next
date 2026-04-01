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

export interface MockFaq {
	id: string;
	title: string;
	category: string;
	content: string;
	status: string;
	createdAt: string;
}

interface FaqArticlesPanelListProps {
	faqs: MockFaq[];
	onStatusChange: (id: string, status: string) => void;
	onDelete: (id: string) => void;
}

export const FaqArticlesPanelList = (props: FaqArticlesPanelListProps) => {
	const { faqs, onStatusChange, onDelete } = props;

	const [anchorEl, setAnchorEl] = useState<{ [key: string]: HTMLElement | null }>({});

	const handleMenuOpen = (e: React.MouseEvent<HTMLElement>, id: string) => {
		setAnchorEl((prev) => ({ ...prev, [id]: e.currentTarget }));
	};

	const handleMenuClose = (id: string) => {
		setAnchorEl((prev) => ({ ...prev, [id]: null }));
	};

	const getStatusBadgeClass = (status: string): string => {
		if (status === 'ACTIVE') return 'badge success';
		if (status === 'INACTIVE') return 'badge inactive';
		if (status === 'DELETE') return 'badge delete';
		return 'badge inactive';
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
							<TableCell align={'left'}>CONTENT</TableCell>
							<TableCell align={'left'}>STATUS</TableCell>
							<TableCell align={'left'}>CREATED</TableCell>
							<TableCell align={'center'}>ACTIONS</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{faqs.length === 0 && (
							<TableRow>
								<TableCell align={'center'} colSpan={7}>
									<span className={'no-data'}>No FAQs found</span>
								</TableCell>
							</TableRow>
						)}

						{faqs.length !== 0 &&
							faqs.map((faq: MockFaq) => (
								<TableRow hover key={faq.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
									<TableCell align={'left'}>
										<Typography variant={'body2'} sx={{ color: '#8A8A9A', fontSize: '12px' }}>
											{faq.id}
										</Typography>
									</TableCell>
									<TableCell align={'left'}>{faq.category}</TableCell>
									<TableCell align={'left'}>{faq.title}</TableCell>
									<TableCell align={'left'}>
										{faq.content.length > 60 ? faq.content.substring(0, 60) + '...' : faq.content}
									</TableCell>
									<TableCell align={'left'}>
										<span className={getStatusBadgeClass(faq.status)}>{faq.status}</span>
									</TableCell>
									<TableCell align={'left'}>{faq.createdAt}</TableCell>
									<TableCell align={'center'}>
										<IconButton size={'small'} onClick={(e) => handleMenuOpen(e, faq.id)}>
											<MoreVertIcon fontSize={'small'} />
										</IconButton>
										<Menu
											className={'menu-modal'}
											MenuListProps={{ 'aria-labelledby': 'faq-action-button' }}
											anchorEl={anchorEl[faq.id] ?? null}
											open={Boolean(anchorEl[faq.id])}
											onClose={() => handleMenuClose(faq.id)}
											sx={{ p: 1 }}
										>
											<MenuItem
												onClick={() => {
													onStatusChange(faq.id, 'ACTIVE');
													handleMenuClose(faq.id);
												}}
											>
												<Typography variant={'subtitle1'} component={'span'} sx={{ color: '#2e7d32' }}>
													Set Active
												</Typography>
											</MenuItem>
											<MenuItem
												onClick={() => {
													onStatusChange(faq.id, 'INACTIVE');
													handleMenuClose(faq.id);
												}}
											>
												<Typography variant={'subtitle1'} component={'span'} sx={{ color: '#ed6c02' }}>
													Set Inactive
												</Typography>
											</MenuItem>
											<MenuItem
												onClick={() => {
													onDelete(faq.id);
													handleMenuClose(faq.id);
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
