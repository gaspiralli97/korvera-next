import React, { useCallback, useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, Divider, InputAdornment, List, ListItem, OutlinedInput, Stack, TablePagination } from '@mui/material';
import Typography from '@mui/material/Typography';
import { TabContext } from '@mui/lab';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { ReturnList, MockReturn } from '../../../libs/components/admin/returns/ReturnList';

const MOCK_RETURNS: MockReturn[] = [
	{ id: 'RET-001', orderId: 'ORD-2026003', customer: 'Mia Romano', email: 'mia.romano@mail.com', product: 'Night Repair Cream 50ml', reason: 'Wrong shade received', amount: '$45.00', date: '28 Mar 2026', status: 'PENDING' },
	{ id: 'RET-002', orderId: 'ORD-2026007', customer: 'Zoe Martin', email: 'zoe.martin@mail.com', product: 'Lip Tint Berry Bliss', reason: 'Item damaged on arrival', amount: '$28.00', date: '27 Mar 2026', status: 'PENDING' },
	{ id: 'RET-003', orderId: 'ORD-2025998', customer: 'Chloe Park', email: 'chloe.park@mail.com', product: 'SPF 50 Daily Shield', reason: 'Allergic reaction', amount: '$52.00', date: '25 Mar 2026', status: 'PENDING' },
	{ id: 'RET-004', orderId: 'ORD-2025881', customer: 'Lily Chen', email: 'lily.chen@mail.com', product: 'Perfume Set (3pc)', reason: 'Not as described', amount: '$120.00', date: '24 Mar 2026', status: 'PENDING' },
	{ id: 'RET-005', orderId: 'ORD-2025743', customer: 'Ana Bloom', email: 'ana.bloom@mail.com', product: 'Velvet Foundation SPF30', reason: 'Shade mismatch', amount: '$65.00', date: '22 Mar 2026', status: 'APPROVED' },
	{ id: 'RET-006', orderId: 'ORD-2025601', customer: 'Nora Walsh', email: 'nora.walsh@mail.com', product: 'Glow Serum 30ml', reason: 'Expired product', amount: '$89.90', date: '20 Mar 2026', status: 'APPROVED' },
	{ id: 'RET-007', orderId: 'ORD-2025490', customer: 'Julia Stone', email: 'julia.stone@mail.com', product: 'Rose Petal Toner 200ml', reason: 'Changed mind', amount: '$35.00', date: '18 Mar 2026', status: 'REJECTED' },
	{ id: 'RET-008', orderId: 'ORD-2025312', customer: 'Isla Torres', email: 'isla.torres@mail.com', product: 'Brow Pomade Dark Brown', reason: 'Product dried out', amount: '$22.00', date: '15 Mar 2026', status: 'REJECTED' },
	{ id: 'RET-009', orderId: 'ORD-2025204', customer: 'Sarah Kim', email: 'sarah.kim@mail.com', product: 'Vitamin C Brightening Mask', reason: 'Broken seal', amount: '$48.00', date: '12 Mar 2026', status: 'REFUNDED' },
	{ id: 'RET-010', orderId: 'ORD-2025099', customer: 'Emma Liu', email: 'emma.liu@mail.com', product: 'Hydra Boost Eye Serum', reason: 'Wrong item sent', amount: '$72.00', date: '10 Mar 2026', status: 'REFUNDED' },
];

const STATUS_TABS = ['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'REFUNDED'];

const AdminReturns: NextPage = (props: any) => {
	const [returns, setReturns] = useState<MockReturn[]>(MOCK_RETURNS);
	const [anchorEl, setAnchorEl] = useState<Record<string, HTMLElement | null>>({});
	const [tabValue, setTabValue] = useState('ALL');
	const [searchText, setSearchText] = useState('');
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	const menuIconClickHandler = (e: any, id: string) => {
		setAnchorEl((prev) => ({ ...prev, [id]: e.currentTarget }));
	};

	const menuIconCloseHandler = () => setAnchorEl({});

	const updateReturnHandler = (id: string, status: string) => {
		setReturns((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
		menuIconCloseHandler();
	};

	const textHandler = useCallback((value: string) => setSearchText(value), []);

	const filteredReturns = returns.filter((r) => {
		const matchesTab = tabValue === 'ALL' || r.status === tabValue;
		const matchesSearch = !searchText || r.id.toLowerCase().includes(searchText.toLowerCase()) || r.customer.toLowerCase().includes(searchText.toLowerCase()) || r.orderId.toLowerCase().includes(searchText.toLowerCase());
		return matchesTab && matchesSearch;
	});

	const paginatedReturns = filteredReturns.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

	return (
		<Box component={'div'} className={'content'}>
			<Typography variant={'h2'} className={'tit'} sx={{ mb: '24px' }}>
				Returns &amp; Refunds
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
									placeholder={'Search by return ID, order ID or customer name'}
									endAdornment={
										<>
											{searchText && <CancelRoundedIcon style={{ cursor: 'pointer' }} onClick={() => setSearchText('')} />}
											<InputAdornment position={'end'}>
												<img src={'/img/icons/search_icon.png'} alt={'search'} />
											</InputAdornment>
										</>
									}
								/>
							</Stack>
							<Divider />
						</Box>

						<ReturnList
							returns={paginatedReturns}
							anchorEl={anchorEl}
							menuIconClickHandler={menuIconClickHandler}
							menuIconCloseHandler={menuIconCloseHandler}
							updateReturnHandler={updateReturnHandler}
						/>

						<TablePagination
							rowsPerPageOptions={[10, 20, 40]}
							component={'div'}
							count={filteredReturns.length}
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

export default withAdminLayout(AdminReturns);
