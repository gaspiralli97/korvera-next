import React, { useState } from 'react';
import {
	Box,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	IconButton,
	Menu,
	MenuItem,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	TextField,
} from '@mui/material';
import { Stack } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export interface MockInquiry {
	id: string;
	userNick: string;
	userEmail: string;
	title: string;
	content: string;
	reply: string;
	status: string;
	createdAt: string;
}

const headCells = [
	{ id: 'id', label: 'ID', align: 'left' as const },
	{ id: 'user', label: 'USER', align: 'left' as const },
	{ id: 'title', label: 'TITLE', align: 'left' as const },
	{ id: 'content', label: 'CONTENT', align: 'left' as const },
	{ id: 'status', label: 'STATUS', align: 'center' as const },
	{ id: 'replied', label: 'REPLIED', align: 'center' as const },
	{ id: 'created', label: 'CREATED', align: 'left' as const },
	{ id: 'actions', label: 'ACTIONS', align: 'center' as const },
];

const getStatusBadge = (status: string): string => {
	switch (status) {
		case 'PENDING':
			return 'badge warning';
		case 'ANSWERED':
			return 'badge success';
		case 'CLOSED':
			return 'badge delete';
		default:
			return 'badge warning';
	}
};

interface InquiryListProps {
	inquiries: MockInquiry[];
	onReply: (id: string, reply: string) => void;
	onStatusChange: (id: string, status: string) => void;
	onDelete: (id: string) => void;
}

export const InquiryList = (props: InquiryListProps) => {
	const { inquiries, onReply, onStatusChange, onDelete } = props;

	const [menuAnchor, setMenuAnchor] = useState<{ [key: string]: HTMLElement | null }>({});
	const [dialogOpen, setDialogOpen] = useState(false);
	const [currentId, setCurrentId] = useState('');
	const [replyText, setReplyText] = useState('');

	const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
		setMenuAnchor((prev) => ({ ...prev, [id]: event.currentTarget }));
	};

	const handleMenuClose = (id: string) => {
		setMenuAnchor((prev) => ({ ...prev, [id]: null }));
	};

	const handleOpenReplyDialog = (inquiry: MockInquiry) => {
		setCurrentId(inquiry.id);
		setReplyText(inquiry.reply || '');
		setDialogOpen(true);
		handleMenuClose(inquiry.id);
	};

	const handleCloseDialog = () => {
		setDialogOpen(false);
		setCurrentId('');
		setReplyText('');
	};

	const handleSaveReply = () => {
		if (currentId) {
			onReply(currentId, replyText);
		}
		handleCloseDialog();
	};

	const handleCloseInquiry = (id: string) => {
		onStatusChange(id, 'CLOSED');
		handleMenuClose(id);
	};

	const handleDelete = (id: string) => {
		onDelete(id);
		handleMenuClose(id);
	};

	return (
		<Stack>
			<TableContainer>
				<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
					<TableHead>
						<TableRow>
							{headCells.map((cell) => (
								<TableCell key={cell.id} align={cell.align} padding={'normal'}>
									{cell.label}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{inquiries.length === 0 && (
							<TableRow>
								<TableCell align="center" colSpan={8}>
									<span className={'no-data'}>No inquiries found</span>
								</TableCell>
							</TableRow>
						)}

						{inquiries.length !== 0 &&
							inquiries.map((inquiry: MockInquiry) => (
								<TableRow hover key={inquiry.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
									<TableCell align="left">
										<Typography variant={'subtitle1'} sx={{ fontWeight: 600, color: '#1A1A2E', fontSize: '12px' }}>
											{inquiry.id}
										</Typography>
									</TableCell>

									<TableCell align="left">
										<Box component={'div'}>
											<Typography variant={'subtitle1'} sx={{ fontWeight: 600, fontSize: '13px', color: '#1A1A2E' }}>
												{inquiry.userNick}
											</Typography>
											<Typography variant={'subtitle2'} sx={{ fontSize: '11px', color: '#888' }}>
												{inquiry.userEmail}
											</Typography>
										</Box>
									</TableCell>

									<TableCell align="left">
										<Typography
											variant={'subtitle1'}
											sx={{ fontWeight: 600, fontSize: '13px', color: '#1A1A2E', maxWidth: '180px' }}
											noWrap
										>
											{inquiry.title}
										</Typography>
									</TableCell>

									<TableCell align="left">
										<Typography variant={'subtitle1'} sx={{ fontSize: '12px', color: '#555', maxWidth: '200px' }} noWrap>
											{inquiry.content.length > 50 ? inquiry.content.slice(0, 50) + '...' : inquiry.content}
										</Typography>
									</TableCell>

									<TableCell align="center">
										<span className={getStatusBadge(inquiry.status)}>{inquiry.status}</span>
									</TableCell>

									<TableCell align="center">
										{inquiry.reply ? (
											<Typography variant={'subtitle1'} sx={{ color: '#4CAF50', fontWeight: 700, fontSize: '16px' }}>
												✓
											</Typography>
										) : (
											<Typography variant={'subtitle1'} sx={{ color: '#bbb', fontWeight: 700, fontSize: '16px' }}>
												—
											</Typography>
										)}
									</TableCell>

									<TableCell align="left">
										<Typography variant={'subtitle1'} sx={{ fontSize: '12px', color: '#555' }}>
											{inquiry.createdAt}
										</Typography>
									</TableCell>

									<TableCell align="center">
										<IconButton
											size={'small'}
											onClick={(e) => handleMenuOpen(e, inquiry.id)}
											sx={{ color: '#2C1654' }}
										>
											<MoreVertIcon fontSize={'small'} />
										</IconButton>

										<Menu
											anchorEl={menuAnchor[inquiry.id] || null}
											open={Boolean(menuAnchor[inquiry.id])}
											onClose={() => handleMenuClose(inquiry.id)}
											sx={{ p: 1 }}
										>
											<MenuItem onClick={() => handleOpenReplyDialog(inquiry)}>
												<Typography variant={'subtitle1'} component={'span'}>
													{inquiry.reply ? 'Edit Reply' : 'Reply'}
												</Typography>
											</MenuItem>
											<MenuItem onClick={() => handleCloseInquiry(inquiry.id)} disabled={inquiry.status === 'CLOSED'}>
												<Typography variant={'subtitle1'} component={'span'}>
													Close Inquiry
												</Typography>
											</MenuItem>
											<MenuItem onClick={() => handleDelete(inquiry.id)} sx={{ color: '#C0504A' }}>
												<Typography variant={'subtitle1'} component={'span'} sx={{ color: '#C0504A' }}>
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

			<Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth={'sm'}>
				<DialogTitle>
					<Typography variant={'h6'} component={'span'} sx={{ fontWeight: 700, color: '#1A1A2E' }}>
						{replyText ? 'Edit Reply' : 'Reply to Inquiry'}
					</Typography>
				</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						multiline
						rows={5}
						fullWidth
						label={'Reply Message'}
						value={replyText}
						onChange={(e) => setReplyText(e.target.value)}
						sx={{ mt: '8px' }}
						placeholder={'Write your reply to the customer...'}
					/>
				</DialogContent>
				<DialogActions sx={{ px: '24px', pb: '16px' }}>
					<Button onClick={handleCloseDialog} sx={{ color: '#888' }}>
						Cancel
					</Button>
					<Button
						onClick={handleSaveReply}
						variant={'contained'}
						disabled={!replyText.trim()}
						sx={{ background: '#2C1654', '&:hover': { background: '#3d2070' } }}
					>
						Save Reply
					</Button>
				</DialogActions>
			</Dialog>
		</Stack>
	);
};
