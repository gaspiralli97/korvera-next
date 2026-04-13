import React, { useEffect, useState } from 'react';
import { Stack, Box, Typography, Button, Chip } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { REACT_APP_API_URL } from '../../config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

interface OrderItem {
	productTitle: string;
	productBrand: string;
	productImage: string;
	productPrice: number;
	qty: number;
	size: string;
}

interface OrderRecord {
	orderId: string;
	createdAt: string;
	status: OrderStatus;
	items: OrderItem[];
	total: number;
	address: string;
}

const STATUS_COLORS: Record<OrderStatus, { bg: string; color: string }> = {
	Processing: { bg: 'rgba(26,84,185,0.1)',   color: '#1a54b9' },
	Shipped:    { bg: 'rgba(0,131,143,0.1)',    color: '#00838f' },
	Delivered:  { bg: 'rgba(46,125,50,0.1)',    color: '#2e7d32' },
	Cancelled:  { bg: 'rgba(198,40,40,0.1)',    color: '#c62828' },
};


const MyOrders = () => {
	const device = useDeviceDetect();
	const [expandedId, setExpandedId] = useState<string | null>(null);
	const [orders, setOrders] = useState<OrderRecord[]>([]);
	const user = useReactiveVar(userVar);
	const isSeller = user?.memberType === 'SELLER';

	useEffect(() => {
		const key = `korvera_orders_${user?._id ?? 'guest'}`;
		try {
			const raw = localStorage.getItem(key);
			const localOrders: OrderRecord[] = raw ? JSON.parse(raw) : [];
			setOrders(localOrders);
		} catch {
			setOrders([]);
		}
	}, [user?._id]);

	const toggleExpand = (orderId: string) => {
		setExpandedId(expandedId === orderId ? null : orderId);
	};

	const updateOrderStatus = (orderId: string, status: OrderStatus) => {
		const key = `korvera_orders_${user?._id ?? 'guest'}`;
		const updated = orders.map((o) => o.orderId === orderId ? { ...o, status } : o);
		setOrders(updated);
		// try-catch: localStorage.setItem throws SecurityError when browser blocks storage access
		// (order status yangilanishi saqlanadi, xato bo'lsa UI ishlaydi lekin saqlash o'tib ketadi)
		try {
			localStorage.setItem(key, JSON.stringify(updated));
		} catch {}
	};

	const getOrderActions = (status: OrderStatus, orderId: string, isSellerRole: boolean) => {
		const actions: { label: string; className: string; onClick: () => void }[] = [];

		if (isSellerRole) {
			if (status === 'Processing') {
				actions.push(
					{ label: 'Confirm Order', className: 'mo-action-btn', onClick: () => updateOrderStatus(orderId, 'Delivered') },
					{ label: 'Cancel Order', className: 'mo-cancel-btn', onClick: () => updateOrderStatus(orderId, 'Cancelled') },
				);
			} else if (status === 'Shipped') {
				actions.push({ label: 'Mark as Delivered', className: 'mo-action-btn', onClick: () => updateOrderStatus(orderId, 'Delivered') });
			} else if (status === 'Delivered') {
				return (
					<Stack className={'mo-actions'} direction={'row'} gap={1}>
						<Chip label={'Completed'} color={'success'} size={'small'} />
					</Stack>
				);
			}
		} else {
			if (status === 'Processing') {
				actions.push({ label: 'Cancel Order', className: 'mo-cancel-btn', onClick: () => updateOrderStatus(orderId, 'Cancelled') });
			} else if (status === 'Shipped') {
				actions.push({ label: 'Track Shipment', className: 'mo-action-btn', onClick: () => {} });
			} else if (status === 'Delivered') {
				actions.push({ label: 'Write Review', className: 'mo-action-btn', onClick: () => {} });
			}
		}

		if (actions.length === 0) return null;

		return (
			<Stack className={'mo-actions'} direction={'row'} gap={1}>
				{actions.map(({ label, className, onClick }) => (
					<Button key={label} className={className} size={'small'} onClick={onClick}>{label}</Button>
				))}
			</Stack>
		);
	};

	if (device === 'mobile') {
		return (
			<div className={'mob-mypage-section'}>
				<Typography className={'mob-section-title'}>Order History</Typography>
				{orders.length === 0 ? (
					<div className={'mob-empty-state'}>
						<img src="/img/icons/icoAlert.svg" alt="" />
						<p>No orders yet</p>
					</div>
				) : (
					<Stack className={'mob-orders-list'}>
						{orders.map((order) => {
							const statusStyle = STATUS_COLORS[order.status] ?? STATUS_COLORS['Processing'];
							const isExpanded = expandedId === order.orderId;
							return (
								<Stack key={order.orderId} className={'mob-order-card'}>
									<Stack className={'mob-order-header'} onClick={() => toggleExpand(order.orderId)}>
										<Stack className={'mob-order-header-left'}>
											<Typography className={'mob-order-id'}>#{order.orderId}</Typography>
											<Typography className={'mob-order-date'}>{order.createdAt}</Typography>
										</Stack>
										<Stack className={'mob-order-header-right'}>
											<Box
												component={'div'}
												className={'mob-status-badge'}
												sx={{ background: statusStyle.bg, color: statusStyle.color }}
											>
												{order.status}
											</Box>
											<Typography className={'mob-order-total'}>${order.total.toFixed(2)}</Typography>
											<Box component={'div'} className={'mob-expand-icon'}>
												{isExpanded ? <ExpandLessIcon fontSize={'small'} /> : <ExpandMoreIcon fontSize={'small'} />}
											</Box>
										</Stack>
									</Stack>
									<Typography className={'mob-order-address'}>📦 {order.address}</Typography>
									<Typography className={'mob-order-items-count'}>
										{order.items.length} {order.items.length === 1 ? 'item' : 'items'}
									</Typography>
									{getOrderActions(order.status, order.orderId, isSeller)}
									{isExpanded && (
										<Stack className={'mob-items-list'}>
											{order.items.map((item, idx) => (
												<Stack key={idx} className={'mob-order-item'}>
													<Box component={'div'} className={'mob-order-item-thumb'}>
														<img
															src={
																item.productImage
																	? item.productImage.startsWith('/')
																		? item.productImage
																		: `${REACT_APP_API_URL}/${item.productImage}`
																	: '/img/product/bigImage.png'
															}
															alt={item.productTitle}
														/>
													</Box>
													<Stack className={'mob-order-item-info'}>
														<Typography className={'mob-order-item-brand'}>{item.productBrand}</Typography>
														<Typography className={'mob-order-item-title'}>{item.productTitle}</Typography>
														<Typography className={'mob-order-item-meta'}>Size: {item.size} · Qty: {item.qty}</Typography>
													</Stack>
													<Typography className={'mob-order-item-price'}>${(item.productPrice * item.qty).toFixed(2)}</Typography>
												</Stack>
											))}
										</Stack>
									)}
								</Stack>
							);
						})}
					</Stack>
				)}
			</div>
		);
	} else {
		return (
			<Stack className={'mo-orders-wrap'}>
				<Typography className={'mo-orders-title'}>Order History</Typography>

				{orders.length === 0 ? (
					<Stack className={'mo-empty'}>
						<Typography className={'mo-empty-text'}>You have no orders yet.</Typography>
					</Stack>
				) : (
					<Stack className={'mo-orders-list'}>
						{orders.map((order) => {
							const statusStyle = STATUS_COLORS[order.status] ?? STATUS_COLORS['Processing'];
							const isExpanded = expandedId === order.orderId;

							return (
								<Stack key={order.orderId} className={'mo-order-card'}>
									<Stack className={'mo-order-header'} onClick={() => toggleExpand(order.orderId)}>
										<Stack className={'mo-order-header-left'}>
											<Typography className={'mo-order-id'}>#{order.orderId}</Typography>
											<Typography className={'mo-order-date'}>{order.createdAt}</Typography>
										</Stack>
										<Stack className={'mo-order-header-right'}>
											<Box
												component={'div'}
												className={'mo-status-badge'}
												sx={{ background: statusStyle.bg, color: statusStyle.color }}
											>
												{order.status}
											</Box>
											<Typography className={'mo-order-total'}>${order.total.toFixed(2)}</Typography>
											<Box component={'div'} className={'mo-expand-icon'}>
												{isExpanded ? <ExpandLessIcon fontSize={'small'} /> : <ExpandMoreIcon fontSize={'small'} />}
											</Box>
										</Stack>
									</Stack>

									<Typography className={'mo-order-address'}>📦 {order.address}</Typography>

									<Typography className={'mo-order-items-count'}>
										{order.items.length} {order.items.length === 1 ? 'item' : 'items'}
									</Typography>

									{getOrderActions(order.status, order.orderId, isSeller)}

									{isExpanded && (
										<Stack className={'mo-items-list'}>
											{order.items.map((item, idx) => (
												<Stack key={idx} className={'mo-item'}>
													<Box component={'div'} className={'mo-item-thumb'}>
														<img
															src={
																item.productImage
																	? item.productImage.startsWith('/')
																		? item.productImage
																		: `${REACT_APP_API_URL}/${item.productImage}`
																	: '/img/product/bigImage.png'
															}
															alt={item.productTitle}
														/>
													</Box>
													<Stack className={'mo-item-info'}>
														<Typography className={'mo-item-brand'}>{item.productBrand}</Typography>
														<Typography className={'mo-item-title'}>{item.productTitle}</Typography>
														<Typography className={'mo-item-meta'}>Size: {item.size} · Qty: {item.qty}</Typography>
													</Stack>
													<Typography className={'mo-item-price'}>${(item.productPrice * item.qty).toFixed(2)}</Typography>
												</Stack>
											))}
										</Stack>
									)}
								</Stack>
							);
						})}
					</Stack>
				)}
			</Stack>
		);
	}
};

export default MyOrders;
