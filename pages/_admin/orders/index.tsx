import React, { useCallback, useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, Divider, InputAdornment, List, ListItem, OutlinedInput, Stack, TablePagination } from '@mui/material';
import Typography from '@mui/material/Typography';
import { TabContext } from '@mui/lab';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { OrderList, MockOrder } from '../../../libs/components/admin/orders/OrderList';

/** HARDCODED MOCK DATA **/
const MOCK_ORDERS: MockOrder[] = [
	{ id: 'ORD-2026001', customer: 'Sarah Kim', email: 'sarah.kim@mail.com', items: 3, products: 'Glow Serum, Lip Tint, Rose Toner', total: '$128.50', date: '27 Mar 2026', status: 'PENDING' },
	{ id: 'ORD-2026002', customer: 'Emma Liu', email: 'emma.liu@mail.com', items: 1, products: 'Velvet Foundation', total: '$45.00', date: '27 Mar 2026', status: 'CONFIRMED' },
	{ id: 'ORD-2026003', customer: 'Mia Romano', email: 'mia.romano@mail.com', items: 5, products: 'Night Cream, Eye Serum +3', total: '$289.90', date: '26 Mar 2026', status: 'DELIVERED' },
	{ id: 'ORD-2026004', customer: 'Julia Stone', email: 'julia.stone@mail.com', items: 2, products: 'Blush Palette, Setting Spray', total: '$76.20', date: '26 Mar 2026', status: 'CONFIRMED' },
	{ id: 'ORD-2026005', customer: 'Ana Bloom', email: 'ana.bloom@mail.com', items: 4, products: 'Perfume Set, Body Lotion +2', total: '$195.00', date: '25 Mar 2026', status: 'CANCELLED' },
	{ id: 'ORD-2026006', customer: 'Chloe Park', email: 'chloe.park@mail.com', items: 2, products: 'Vitamin C Serum, SPF 50', total: '$92.40', date: '25 Mar 2026', status: 'SHIPPED' },
	{ id: 'ORD-2026007', customer: 'Zoe Martin', email: 'zoe.martin@mail.com', items: 1, products: 'Brow Pomade', total: '$28.00', date: '24 Mar 2026', status: 'PENDING' },
	{ id: 'ORD-2026008', customer: 'Lily Chen', email: 'lily.chen@mail.com', items: 6, products: 'Skincare Bundle x6', total: '$340.00', date: '24 Mar 2026', status: 'SHIPPED' },
	{ id: 'ORD-2026009', customer: 'Nora Walsh', email: 'nora.walsh@mail.com', items: 2, products: 'Micellar Water, Face Mist', total: '$54.80', date: '23 Mar 2026', status: 'DELIVERED' },
	{ id: 'ORD-2026010', customer: 'Isla Torres', email: 'isla.torres@mail.com', items: 3, products: 'Concealer, Primer, Brush Set', total: '$115.60', date: '23 Mar 2026', status: 'CONFIRMED' },
];

const STATUS_TABS = ['ALL', 'PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const AdminOrders: NextPage = (props: any) => {
	const [orders, setOrders] = useState<MockOrder[]>(MOCK_ORDERS);
	const [anchorEl, setAnchorEl] = useState<Record<string, HTMLElement | null>>({});
	const [tabValue, setTabValue] = useState('ALL');
	const [searchText, setSearchText] = useState('');
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	/** HANDLERS **/
	const tabChangeHandler = (newValue: string) => {
		setTabValue(newValue);
		setPage(0);
	};

	const menuIconClickHandler = (e: any, id: string) => {
		setAnchorEl((prev) => ({ ...prev, [id]: e.currentTarget }));
	};

	const menuIconCloseHandler = () => {
		setAnchorEl({});
	};

	const updateOrderStatusHandler = (id: string, status: string) => {
		setOrders((prev) =>
			prev.map((order) => (order.id === id ? { ...order, status } : order)),
		);
		menuIconCloseHandler();
	};

	const textHandler = useCallback((value: string) => {
		setSearchText(value);
	}, []);

	const clearSearchHandler = () => {
		setSearchText('');
	};

	/** FILTERED DATA **/
	const filteredOrders = orders.filter((order) => {
		const matchesTab = tabValue === 'ALL' || order.status === tabValue;
		const matchesSearch =
			!searchText ||
			order.id.toLowerCase().includes(searchText.toLowerCase()) ||
			order.customer.toLowerCase().includes(searchText.toLowerCase());
		return matchesTab && matchesSearch;
	});

	const paginatedOrders = filteredOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

	return (
		<Box component={'div'} className={'content'}>
			<Typography variant={'h2'} className={'tit'} sx={{ mb: '24px' }}>
				Order Management
			</Typography>

			<Box component={'div'} className={'table-wrap'}>
				<Box component={'div'} sx={{ width: '100%', typography: 'body1' }}>
					<TabContext value={tabValue}>
						<Box component={'div'}>
							<List className={'tab-menu'}>
								{STATUS_TABS.map((tab) => (
									<ListItem
										key={tab}
										onClick={() => tabChangeHandler(tab)}
										value={tab}
										className={tabValue === tab ? 'li on' : 'li'}
									>
										{tab.charAt(0) + tab.slice(1).toLowerCase()}
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
									placeholder={'Search by order ID or customer name'}
									endAdornment={
										<>
											{searchText && (
												<CancelRoundedIcon
													style={{ cursor: 'pointer' }}
													onClick={clearSearchHandler}
												/>
											)}
											<InputAdornment position={'end'}>
												<img src={'/img/icons/search_icon.png'} alt={'search'} />
											</InputAdornment>
										</>
									}
								/>
							</Stack>
							<Divider />
						</Box>

						<OrderList
							orders={paginatedOrders}
							anchorEl={anchorEl}
							menuIconClickHandler={menuIconClickHandler}
							menuIconCloseHandler={menuIconCloseHandler}
							updateOrderStatusHandler={updateOrderStatusHandler}
						/>

						<TablePagination
							rowsPerPageOptions={[10, 20, 40, 60]}
							component={'div'}
							count={filteredOrders.length}
							rowsPerPage={rowsPerPage}
							page={page}
							onPageChange={(_, newPage) => setPage(newPage)}
							onRowsPerPageChange={(e) => {
								setRowsPerPage(parseInt(e.target.value, 10));
								setPage(0);
							}}
						/>
					</TabContext>
				</Box>
			</Box>
		</Box>
	);
};

export default withAdminLayout(AdminOrders);
