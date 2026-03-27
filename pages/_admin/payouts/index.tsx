import React, { useCallback, useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, Divider, InputAdornment, List, ListItem, OutlinedInput, Stack, TablePagination } from '@mui/material';
import Typography from '@mui/material/Typography';
import { TabContext } from '@mui/lab';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { PayoutList, MockPayout } from '../../../libs/components/admin/payouts/PayoutList';

const MOCK_PAYOUTS: MockPayout[] = [
	{ id: 'PAY-001', seller: 'Luna Beauty Studio', sellerNick: 'luna_beauty', amount: '$3,240.00', method: 'Bank Transfer', requestedDate: '27 Mar 2026', status: 'PENDING' },
	{ id: 'PAY-002', seller: 'Pure Glow Co.', sellerNick: 'pureglow', amount: '$2,180.00', method: 'PayPal', requestedDate: '26 Mar 2026', status: 'PENDING' },
	{ id: 'PAY-003', seller: 'Velvet Cosmetics', sellerNick: 'velvet_co', amount: '$1,890.00', method: 'Stripe', requestedDate: '25 Mar 2026', status: 'PENDING' },
	{ id: 'PAY-004', seller: 'Bloom Skincare', sellerNick: 'bloomskin', amount: '$560.00', method: 'Bank Transfer', requestedDate: '24 Mar 2026', status: 'PENDING' },
	{ id: 'PAY-005', seller: 'Rose & Pearl', sellerNick: 'rosepearl', amount: '$980.00', method: 'Bank Transfer', requestedDate: '22 Mar 2026', status: 'PROCESSING' },
	{ id: 'PAY-006', seller: 'Aura Naturals', sellerNick: 'aura_nat', amount: '$340.00', method: 'PayPal', requestedDate: '20 Mar 2026', status: 'PROCESSING' },
	{ id: 'PAY-007', seller: 'Luna Beauty Studio', sellerNick: 'luna_beauty', amount: '$2,890.00', method: 'Bank Transfer', requestedDate: '15 Mar 2026', status: 'COMPLETED' },
	{ id: 'PAY-008', seller: 'Pure Glow Co.', sellerNick: 'pureglow', amount: '$1,640.00', method: 'PayPal', requestedDate: '12 Mar 2026', status: 'COMPLETED' },
	{ id: 'PAY-009', seller: 'Velvet Cosmetics', sellerNick: 'velvet_co', amount: '$1,200.00', method: 'Stripe', requestedDate: '10 Mar 2026', status: 'COMPLETED' },
	{ id: 'PAY-010', seller: 'Matte & More', sellerNick: 'mattemore', amount: '$450.00', method: 'Bank Transfer', requestedDate: '08 Mar 2026', status: 'REJECTED' },
];

const STATUS_TABS = ['ALL', 'PENDING', 'PROCESSING', 'COMPLETED', 'REJECTED'];

const AdminPayouts: NextPage = (props: any) => {
	const [payouts, setPayouts] = useState<MockPayout[]>(MOCK_PAYOUTS);
	const [anchorEl, setAnchorEl] = useState<Record<string, HTMLElement | null>>({});
	const [tabValue, setTabValue] = useState('ALL');
	const [searchText, setSearchText] = useState('');
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	const menuIconClickHandler = (e: any, id: string) => {
		setAnchorEl((prev) => ({ ...prev, [id]: e.currentTarget }));
	};

	const menuIconCloseHandler = () => setAnchorEl({});

	const updatePayoutHandler = (id: string, status: string) => {
		setPayouts((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
		menuIconCloseHandler();
	};

	const textHandler = useCallback((value: string) => setSearchText(value), []);

	const filteredPayouts = payouts.filter((p) => {
		const matchesTab = tabValue === 'ALL' || p.status === tabValue;
		const matchesSearch = !searchText || p.seller.toLowerCase().includes(searchText.toLowerCase()) || p.sellerNick.toLowerCase().includes(searchText.toLowerCase());
		return matchesTab && matchesSearch;
	});

	const paginatedPayouts = filteredPayouts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

	const totalPending = payouts
		.filter((p) => p.status === 'PENDING')
		.reduce((sum, p) => sum + parseFloat(p.amount.replace(/[$,]/g, '')), 0);

	return (
		<Box component={'div'} className={'content'}>
			<Typography variant={'h2'} className={'tit'} sx={{ mb: '24px' }}>
				Seller Payouts
			</Typography>

			{/* KPI Cards */}
			<Box component={'div'} className={'kpi-grid'} sx={{ mb: '24px', gridTemplateColumns: 'repeat(3, 1fr)' }}>
				<Box component={'div'} className={'kpi-card'}>
					<Box component={'div'} className={'kpi-icon-wrap'} sx={{ background: 'rgba(232,168,74,0.12)' }}>
						<span className={'kpi-emoji'}>⏳</span>
					</Box>
					<Box component={'div'} className={'kpi-info'}>
						<Typography className={'kpi-label'}>Total Pending Payouts</Typography>
						<Typography className={'kpi-value'}>${totalPending.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Typography>
						<Typography className={'kpi-trend warn-txt'}>{payouts.filter((p) => p.status === 'PENDING').length} requests waiting</Typography>
					</Box>
				</Box>
				<Box component={'div'} className={'kpi-card'}>
					<Box component={'div'} className={'kpi-icon-wrap'} sx={{ background: 'rgba(74,155,111,0.12)' }}>
						<span className={'kpi-emoji'}>✅</span>
					</Box>
					<Box component={'div'} className={'kpi-info'}>
						<Typography className={'kpi-label'}>Completed This Month</Typography>
						<Typography className={'kpi-value'}>$5,730.00</Typography>
						<Typography className={'kpi-trend up-txt'}>3 payouts processed</Typography>
					</Box>
				</Box>
				<Box component={'div'} className={'kpi-card'}>
					<Box component={'div'} className={'kpi-icon-wrap'} sx={{ background: 'rgba(44,22,84,0.08)' }}>
						<span className={'kpi-emoji'}>🏦</span>
					</Box>
					<Box component={'div'} className={'kpi-info'}>
						<Typography className={'kpi-label'}>Active Sellers</Typography>
						<Typography className={'kpi-value'}>143</Typography>
						<Typography className={'kpi-trend up-txt'}>+5% this month</Typography>
					</Box>
				</Box>
			</Box>

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
									placeholder={'Search by seller name or username'}
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

						<PayoutList
							payouts={paginatedPayouts}
							anchorEl={anchorEl}
							menuIconClickHandler={menuIconClickHandler}
							menuIconCloseHandler={menuIconCloseHandler}
							updatePayoutHandler={updatePayoutHandler}
						/>

						<TablePagination
							rowsPerPageOptions={[10, 20, 40]}
							component={'div'}
							count={filteredPayouts.length}
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

export default withAdminLayout(AdminPayouts);
