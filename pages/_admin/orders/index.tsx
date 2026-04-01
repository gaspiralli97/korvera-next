import React, { useCallback, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, Divider, InputAdornment, List, ListItem, OutlinedInput, Stack, TablePagination } from '@mui/material';
import Typography from '@mui/material/Typography';
import { TabContext } from '@mui/lab';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { OrderList } from '../../../libs/components/admin/orders/OrderList';
import { sweetErrorHandling } from '../../../libs/sweetAlert';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ALL_ORDERS_BY_ADMIN } from '../../../apollo/admin/query';
import { UPDATE_ORDER_BY_ADMIN } from '../../../apollo/admin/mutation';
import { AllOrdersInquiry } from '../../../libs/types/order/order.input';
import { Order } from '../../../libs/types/order/order';
import { OrderStatus } from '../../../libs/enums/order.enum';
import { T } from '../../../libs/types/common';

const STATUS_TABS = ['ALL', 'PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const AdminOrders: NextPage = ({ initialInquiry, ...props }: any) => {
	const [ordersInquiry, setOrdersInquiry] = useState<AllOrdersInquiry>(initialInquiry);
	const [orders, setOrders] = useState<Order[]>([]);
	const [ordersTotal, setOrdersTotal] = useState<number>(0);
	const [anchorEl, setAnchorEl] = useState<Record<string, HTMLElement | null>>({});
	const [tabValue, setTabValue] = useState('ALL');
	const [searchText, setSearchText] = useState('');

	/** APOLLO REQUESTS **/
	const [updateOrderByAdmin] = useMutation(UPDATE_ORDER_BY_ADMIN);

	const {
		loading,
		data,
		error,
		refetch: refetchOrders,
	} = useQuery(GET_ALL_ORDERS_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: ordersInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setOrders(data?.getAllOrdersByAdmin?.list ?? []);
			setOrdersTotal(data?.getAllOrdersByAdmin?.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		refetchOrders({ input: ordersInquiry }).then();
	}, [ordersInquiry]);

	/** HANDLERS **/
	const tabChangeHandler = (newValue: string) => {
		setTabValue(newValue);
		const newInquiry = { ...ordersInquiry, page: 1, search: { ...ordersInquiry.search } };
		if (newValue !== 'ALL') {
			newInquiry.search.orderStatus = newValue as OrderStatus;
		} else {
			delete newInquiry.search.orderStatus;
		}
		setOrdersInquiry(newInquiry);
	};

	const menuIconClickHandler = (e: any, id: string) => {
		setAnchorEl((prev) => ({ ...prev, [id]: e.currentTarget }));
	};

	const menuIconCloseHandler = () => {
		setAnchorEl({});
	};

	const updateOrderStatusHandler = async (id: string, status: string) => {
		try {
			await updateOrderByAdmin({ variables: { input: { _id: id, orderStatus: status as OrderStatus } } });
			menuIconCloseHandler();
			await refetchOrders({ input: ordersInquiry });
		} catch (err: any) {
			menuIconCloseHandler();
			sweetErrorHandling(err).then();
		}
	};

	const textHandler = useCallback((value: string) => {
		setSearchText(value);
	}, []);

	const clearSearchHandler = () => {
		setSearchText('');
	};

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
							orders={orders}
							anchorEl={anchorEl}
							menuIconClickHandler={menuIconClickHandler}
							menuIconCloseHandler={menuIconCloseHandler}
							updateOrderStatusHandler={updateOrderStatusHandler}
						/>

						<TablePagination
							rowsPerPageOptions={[10, 20, 40, 60]}
							component={'div'}
							count={ordersTotal}
							rowsPerPage={ordersInquiry.limit}
							page={ordersInquiry.page - 1}
							onPageChange={(_, newPage) => setOrdersInquiry({ ...ordersInquiry, page: newPage + 1 })}
							onRowsPerPageChange={(e) => {
								setOrdersInquiry({ ...ordersInquiry, limit: parseInt(e.target.value, 10), page: 1 });
							}}
						/>
					</TabContext>
				</Box>
			</Box>
		</Box>
	);
};

AdminOrders.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default withAdminLayout(AdminOrders);
