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
import { Order } from '../../../libs/types/order/order';

const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const getStatusClass = (status: string) => {
	switch (status) {
		case 'PENDING': return 'warning';
		case 'CONFIRMED': return 'success';
		case 'SHIPPED': return 'shipped';
		case 'DELIVERED': return 'delivered';
		case 'CANCELLED': return 'error';
		default: return 'success';
	}
};

interface HeadCell {
	id: string;
	label: string;
	align: 'left' | 'center' | 'right';
}

const headCells: readonly HeadCell[] = [
	{ id: 'id', label: 'ORDER ID', align: 'left' },
	{ id: 'customer', label: 'CUSTOMER', align: 'left' },
	{ id: 'products', label: 'PRODUCTS', align: 'left' },
	{ id: 'items', label: 'ITEMS', align: 'center' },
	{ id: 'total', label: 'TOTAL', align: 'center' },
	{ id: 'date', label: 'DATE', align: 'center' },
	{ id: 'status', label: 'STATUS', align: 'center' },
];

interface OrderListProps {
	orders: Order[];
	anchorEl: any;
	menuIconClickHandler: (e: any, id: string) => void;
	menuIconCloseHandler: () => void;
	updateOrderStatusHandler: (id: string, status: string) => void;
}

export const OrderList = (props: OrderListProps) => {
	const { orders, anchorEl, menuIconClickHandler, menuIconCloseHandler, updateOrderStatusHandler } = props;

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
						{orders.length === 0 && (
							<TableRow>
								<TableCell align="center" colSpan={7}>
									<span className={'no-data'}>No orders found</span>
								</TableCell>
							</TableRow>
						)}

						{orders.length !== 0 &&
							orders.map((order: Order) => {
								const productSummary = order.orderItems
									.map((item) => item.productTitle)
									.join(', ');
								const totalItems = order.orderItems.reduce((sum, item) => sum + item.quantity, 0);

								return (
									<TableRow hover key={order._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
										<TableCell align="left">
											<Typography
												variant={'subtitle1'}
												sx={{ fontWeight: 600, color: '#1A1A2E', fontSize: '13px' }}
											>
												{order._id}
											</Typography>
										</TableCell>

										<TableCell align="left" className={'name'}>
											<Stack direction={'row'} alignItems={'center'} spacing={1.2}>
												<Avatar
													src={order.memberData?.memberImage || '/img/profile/defaultUser.svg'}
													sx={{ width: 32, height: 32 }}
												/>
												<Stack>
													<Typography
														variant={'subtitle1'}
														sx={{ fontWeight: 600, fontSize: '13px', color: '#1A1A2E' }}
													>
														{order.memberData?.memberNick ?? '—'}
													</Typography>
													<Typography
														variant={'body2'}
														sx={{ color: '#8A8A9A', fontSize: '11px' }}
													>
														{order.memberData?.memberPhone ?? ''}
													</Typography>
												</Stack>
											</Stack>
										</TableCell>

										<TableCell align="left">
											<Typography
												variant={'subtitle1'}
												sx={{ color: '#4A4A5A', fontSize: '12px' }}
												noWrap
											>
												{productSummary.length > 50 ? productSummary.substring(0, 50) + '...' : productSummary}
											</Typography>
										</TableCell>

										<TableCell align="center">
											<Typography variant={'subtitle1'} sx={{ color: '#4A4A5A', fontSize: '13px' }}>
												{totalItems}
											</Typography>
										</TableCell>

										<TableCell align="center">
											<Typography
												variant={'subtitle1'}
												sx={{ fontWeight: 700, color: '#1A1A2E', fontSize: '13px' }}
											>
												${order.totalAmount.toLocaleString()}
											</Typography>
										</TableCell>

										<TableCell align="center">
											<Typography variant={'subtitle1'} sx={{ color: '#8A8A9A', fontSize: '12px' }}>
												{new Date(order.createdAt).toLocaleDateString('en-GB', {
													day: '2-digit',
													month: 'short',
													year: 'numeric',
												})}
											</Typography>
										</TableCell>

										<TableCell align="center">
											{order.orderStatus === 'DELIVERED' || order.orderStatus === 'CANCELLED' ? (
												<Button className={`badge ${getStatusClass(order.orderStatus)}`} disabled>
													{order.orderStatus}
												</Button>
											) : (
												<>
													<Button
														onClick={(e: any) => menuIconClickHandler(e, order._id)}
														className={`badge ${getStatusClass(order.orderStatus)}`}
													>
														{order.orderStatus}
													</Button>

													<Menu
														className={'menu-modal'}
														MenuListProps={{ 'aria-labelledby': 'fade-button' }}
														anchorEl={anchorEl[order._id]}
														open={Boolean(anchorEl[order._id])}
														onClose={menuIconCloseHandler}
														TransitionComponent={Fade}
														sx={{ p: 1 }}
													>
														{ORDER_STATUSES.filter((s) => s !== order.orderStatus).map((status) => (
															<MenuItem
																key={status}
																onClick={() => updateOrderStatusHandler(order._id, status)}
															>
																<Typography variant={'subtitle1'} component={'span'}>
																	{status}
																</Typography>
															</MenuItem>
														))}
													</Menu>
												</>
											)}
										</TableCell>
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</TableContainer>
		</Stack>
	);
};
