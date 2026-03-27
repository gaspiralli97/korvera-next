import React, { useCallback, useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, Divider, InputAdornment, List, ListItem, OutlinedInput, Stack, TablePagination } from '@mui/material';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { TabContext } from '@mui/lab';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { ReviewList, MockReview } from '../../../libs/components/admin/reviews/ReviewList';

const MOCK_REVIEWS: MockReview[] = [
	{ id: 'REV-001', product: 'Glow Serum 30ml', reviewer: 'Emma Liu', reviewerEmail: 'emma.liu@mail.com', rating: 5, text: 'Amazing results! My skin is glowing after just one week. Will definitely buy again!', date: '27 Mar 2026', status: 'ACTIVE' },
	{ id: 'REV-002', product: 'Velvet Foundation SPF30', reviewer: 'Sarah Kim', reviewerEmail: 'sarah.kim@mail.com', rating: 4, text: 'Great coverage, love the finish. The shade range could be wider though.', date: '26 Mar 2026', status: 'ACTIVE' },
	{ id: 'REV-003', product: 'Rose Petal Toner', reviewer: 'Mia Romano', reviewerEmail: 'mia.romano@mail.com', rating: 5, text: 'Smells divine and my skin feels incredible. Best toner I have ever used!', date: '25 Mar 2026', status: 'ACTIVE' },
	{ id: 'REV-004', product: 'Night Repair Cream', reviewer: 'Julia Stone', reviewerEmail: 'julia.stone@mail.com', rating: 4, text: 'Good moisturizer, works well overnight. Packaging could be improved.', date: '24 Mar 2026', status: 'ACTIVE' },
	{ id: 'REV-005', product: 'Vitamin C Brightening Mask', reviewer: 'Chloe Park', reviewerEmail: 'chloe.park@mail.com', rating: 5, text: 'Absolutely love this mask! Skin looks so much brighter after each use.', date: '23 Mar 2026', status: 'ACTIVE' },
	{ id: 'REV-006', product: 'Lip Tint Berry Bliss', reviewer: 'Zoe Martin', reviewerEmail: 'zoe.martin@mail.com', rating: 3, text: 'Color is pretty but does not last long. Expected better staying power.', date: '22 Mar 2026', status: 'PENDING' },
	{ id: 'REV-007', product: 'Hydra Boost Eye Serum', reviewer: 'Lily Chen', reviewerEmail: 'lily.chen@mail.com', rating: 4, text: 'Noticed reduction in dark circles after 2 weeks. Good product overall.', date: '21 Mar 2026', status: 'PENDING' },
	{ id: 'REV-008', product: 'SPF 50 Daily Shield', reviewer: 'Nora Walsh', reviewerEmail: 'nora.walsh@mail.com', rating: 3, text: 'Decent sun protection but leaves a white cast. Not ideal for darker skin tones.', date: '20 Mar 2026', status: 'PENDING' },
	{ id: 'REV-009', product: 'Matte Setting Spray', reviewer: 'Ana Bloom', reviewerEmail: 'ana.bloom@mail.com', rating: 2, text: 'Does not set makeup at all. Very disappointing. Returned the product.', date: '18 Mar 2026', status: 'DELETE' },
	{ id: 'REV-010', product: 'Brow Pomade Dark Brown', reviewer: 'Isla Torres', reviewerEmail: 'isla.torres@mail.com', rating: 1, text: 'Arrived completely dried out. Terrible packaging. Will not order again.', date: '15 Mar 2026', status: 'DELETE' },
];

const STATUS_TABS = ['ALL', 'ACTIVE', 'PENDING', 'DELETE'];

const AdminReviews: NextPage = (props: any) => {
	const [reviews, setReviews] = useState<MockReview[]>(MOCK_REVIEWS);
	const [anchorEl, setAnchorEl] = useState<Record<string, HTMLElement | null>>({});
	const [tabValue, setTabValue] = useState('ALL');
	const [searchText, setSearchText] = useState('');
	const [ratingFilter, setRatingFilter] = useState('ALL');
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	const menuIconClickHandler = (e: any, id: string) => {
		setAnchorEl((prev) => ({ ...prev, [id]: e.currentTarget }));
	};

	const menuIconCloseHandler = () => setAnchorEl({});

	const updateReviewHandler = (id: string, status: string) => {
		setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
		menuIconCloseHandler();
	};

	const removeReviewHandler = (id: string) => {
		setReviews((prev) => prev.filter((r) => r.id !== id));
	};

	const textHandler = useCallback((value: string) => setSearchText(value), []);

	const filteredReviews = reviews.filter((r) => {
		const matchesTab = tabValue === 'ALL' || r.status === tabValue;
		const matchesRating = ratingFilter === 'ALL' || r.rating === Number(ratingFilter);
		const matchesSearch = !searchText || r.product.toLowerCase().includes(searchText.toLowerCase()) || r.reviewer.toLowerCase().includes(searchText.toLowerCase());
		return matchesTab && matchesRating && matchesSearch;
	});

	const paginatedReviews = filteredReviews.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

	return (
		<Box component={'div'} className={'content'}>
			<Typography variant={'h2'} className={'tit'} sx={{ mb: '24px' }}>
				Reviews &amp; Ratings
			</Typography>

			<Box component={'div'} className={'table-wrap'}>
				<Box component={'div'} sx={{ width: '100%', typography: 'body1' }}>
					<TabContext value={tabValue}>
						<Box component={'div'}>
							<List className={'tab-menu'}>
								{STATUS_TABS.map((tab) => (
									<ListItem
										key={tab}
										onClick={() => { setTabValue(tab); setPage(0); }}
										value={tab}
										className={tabValue === tab ? 'li on' : 'li'}
									>
										{tab === 'ALL' ? 'All' : tab.charAt(0) + tab.slice(1).toLowerCase()}
									</ListItem>
								))}
							</List>
							<Divider />
							<Stack className={'search-area'} sx={{ m: '24px' }}>
								<OutlinedInput
									value={searchText}
									onChange={(e: any) => textHandler(e.target.value)}
									sx={{ width: '100%' }}
									className={'search'}
									placeholder={'Search by product or reviewer name'}
									endAdornment={
										<>
											{searchText && <CancelRoundedIcon style={{ cursor: 'pointer' }} onClick={() => setSearchText('')} />}
											<InputAdornment position={'end'}>
												<img src={'/img/icons/search_icon.png'} alt={'search'} />
											</InputAdornment>
										</>
									}
								/>
								<Select sx={{ width: '160px', ml: '20px' }} value={ratingFilter} onChange={(e: any) => setRatingFilter(e.target.value)}>
									<MenuItem value={'ALL'}>All Ratings</MenuItem>
									<MenuItem value={'5'}>★★★★★ (5)</MenuItem>
									<MenuItem value={'4'}>★★★★☆ (4)</MenuItem>
									<MenuItem value={'3'}>★★★☆☆ (3)</MenuItem>
									<MenuItem value={'2'}>★★☆☆☆ (2)</MenuItem>
									<MenuItem value={'1'}>★☆☆☆☆ (1)</MenuItem>
								</Select>
							</Stack>
							<Divider />
						</Box>

						<ReviewList
							reviews={paginatedReviews}
							anchorEl={anchorEl}
							menuIconClickHandler={menuIconClickHandler}
							menuIconCloseHandler={menuIconCloseHandler}
							updateReviewHandler={updateReviewHandler}
							removeReviewHandler={removeReviewHandler}
						/>

						<TablePagination
							rowsPerPageOptions={[10, 20, 40]}
							component={'div'}
							count={filteredReviews.length}
							rowsPerPage={rowsPerPage}
							page={page}
							onPageChange={(_, newPage) => setPage(newPage)}
							onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
						/>
					</TabContext>
				</Box>
			</Box>
		</Box>
	);
};

export default withAdminLayout(AdminReviews);
