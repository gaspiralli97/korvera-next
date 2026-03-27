import React from 'react';
import {
	Button,
	Fade,
	Menu,
	MenuItem,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';

export interface MockReview {
	id: string;
	product: string;
	reviewer: string;
	reviewerEmail: string;
	rating: number;
	text: string;
	date: string;
	status: string;
}

const REVIEW_STATUSES = ['ACTIVE', 'PENDING', 'DELETE'];

const getStatusClass = (status: string) => {
	switch (status) {
		case 'ACTIVE': return 'success';
		case 'PENDING': return 'warning';
		case 'DELETE': return 'delete';
		default: return 'success';
	}
};

const renderStars = (rating: number) => {
	return '★'.repeat(rating) + '☆'.repeat(5 - rating);
};

const getRatingColor = (rating: number) => {
	if (rating >= 4) return '#4A9B6F';
	if (rating === 3) return '#E8A84A';
	return '#C0504A';
};

const headCells = [
	{ id: 'id', label: 'REVIEW ID', align: 'left' as const },
	{ id: 'product', label: 'PRODUCT', align: 'left' as const },
	{ id: 'reviewer', label: 'REVIEWER', align: 'left' as const },
	{ id: 'rating', label: 'RATING', align: 'center' as const },
	{ id: 'text', label: 'REVIEW', align: 'left' as const },
	{ id: 'date', label: 'DATE', align: 'center' as const },
	{ id: 'status', label: 'STATUS', align: 'center' as const },
];

interface ReviewListProps {
	reviews: MockReview[];
	anchorEl: Record<string, HTMLElement | null>;
	menuIconClickHandler: (e: any, id: string) => void;
	menuIconCloseHandler: () => void;
	updateReviewHandler: (id: string, status: string) => void;
	removeReviewHandler: (id: string) => void;
}

export const ReviewList = (props: ReviewListProps) => {
	const { reviews, anchorEl, menuIconClickHandler, menuIconCloseHandler, updateReviewHandler, removeReviewHandler } = props;

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
						{reviews.length === 0 && (
							<TableRow>
								<TableCell align="center" colSpan={7}>
									<span className={'no-data'}>No reviews found</span>
								</TableCell>
							</TableRow>
						)}
						{reviews.length !== 0 &&
							reviews.map((review: MockReview) => (
								<TableRow hover key={review.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
									<TableCell align="left">
										<Typography variant={'subtitle1'} sx={{ fontWeight: 600, color: '#1A1A2E', fontSize: '12px' }}>
											{review.id}
										</Typography>
									</TableCell>

									<TableCell align="left">
										<Typography variant={'subtitle1'} sx={{ fontWeight: 500, fontSize: '13px', color: '#1A1A2E', maxWidth: '160px' }} noWrap>
											{review.product}
										</Typography>
									</TableCell>

									<TableCell align="left" className={'name'}>
										<Stack direction={'row'} alignItems={'center'} spacing={1.2}>
											<Avatar src={'/img/profile/defaultUser.svg'} sx={{ width: 30, height: 30 }} />
											<Stack>
												<Typography variant={'subtitle1'} sx={{ fontWeight: 600, fontSize: '13px', color: '#1A1A2E' }}>
													{review.reviewer}
												</Typography>
												<Typography variant={'body2'} sx={{ color: '#8A8A9A', fontSize: '11px' }}>
													{review.reviewerEmail}
												</Typography>
											</Stack>
										</Stack>
									</TableCell>

									<TableCell align="center">
										<Typography sx={{ fontSize: '15px', color: getRatingColor(review.rating), letterSpacing: '1px' }}>
											{renderStars(review.rating)}
										</Typography>
										<Typography variant={'body2'} sx={{ color: '#8A8A9A', fontSize: '11px' }}>
											{review.rating}/5
										</Typography>
									</TableCell>

									<TableCell align="left" sx={{ maxWidth: '220px' }}>
										<Typography variant={'subtitle1'} sx={{ color: '#4A4A5A', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '220px' }}>
											{review.text}
										</Typography>
									</TableCell>

									<TableCell align="center">
										<Typography variant={'subtitle1'} sx={{ color: '#8A8A9A', fontSize: '12px' }}>
											{review.date}
										</Typography>
									</TableCell>

									<TableCell align="center">
										{review.status === 'DELETE' ? (
											<Button
												variant={'outlined'}
												sx={{ p: '3px', border: 'none', ':hover': { border: '1px solid #000' } }}
												onClick={() => removeReviewHandler(review.id)}
											>
												<Typography variant={'body2'} sx={{ fontSize: '11px', color: '#757575' }}>Remove</Typography>
											</Button>
										) : (
											<>
												<Button
													onClick={(e: any) => menuIconClickHandler(e, review.id)}
													className={`badge ${getStatusClass(review.status)}`}
												>
													{review.status}
												</Button>
												<Menu
													className={'menu-modal'}
													MenuListProps={{ 'aria-labelledby': 'fade-button' }}
													anchorEl={anchorEl[review.id]}
													open={Boolean(anchorEl[review.id])}
													onClose={menuIconCloseHandler}
													TransitionComponent={Fade}
													sx={{ p: 1 }}
												>
													{REVIEW_STATUSES.filter((s) => s !== review.status).map((status) => (
														<MenuItem key={status} onClick={() => updateReviewHandler(review.id, status)}>
															<Typography variant={'subtitle1'} component={'span'}>{status}</Typography>
														</MenuItem>
													))}
												</Menu>
											</>
										)}
									</TableCell>
								</TableRow>
							))}
					</TableBody>
				</Table>
			</TableContainer>
		</Stack>
	);
};
