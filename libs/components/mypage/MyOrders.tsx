import React, { useState } from 'react';
import { Stack, Box, Typography, Button, Chip } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { REACT_APP_API_URL } from '../../config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

interface MockOrderItem {
	productTitle: string;
	productBrand: string;
	productImage: string;
	productPrice: number;
	qty: number;
	size: string;
}

interface MockOrder {
	orderId: string;
	createdAt: string;
	status: OrderStatus;
	items: MockOrderItem[];
	total: number;
	address: string;
}

const MOCK_ORDERS: MockOrder[] = [
	{
		orderId: 'KRV-20260301-0012',
		createdAt: 'Mar 1, 2026',
		status: 'Delivered',
		total: 89.97,
		address: '123 Main St, New York, NY 10001',
		items: [
			{ productBrand: 'LANEIGE', productTitle: 'Lip Sleeping Mask Intense Hydration', productImage: '/img/product/bigImage.png', productPrice: 24.0, qty: 2, size: '20g' },
			{ productBrand: 'COSRX', productTitle: 'Advanced Snail 96 Mucin Power Essence', productImage: '/img/product/bigImage.png', productPrice: 25.0, qty: 1, size: '100ml' },
			{ productBrand: 'SOME BY MI', productTitle: 'AHA BHA PHA 30 Days Miracle Toner', productImage: '/img/product/bigImage.png', productPrice: 16.97, qty: 1, size: '150ml' },
		],
	},
	{
		orderId: 'KRV-20260215-0008',
		createdAt: 'Feb 15, 2026',
		status: 'Shipped',
		total: 54.0,
		address: '456 Oak Ave, Los Angeles, CA 90001',
		items: [
			{ productBrand: 'INNISFREE', productTitle: 'Green Tea Seed Serum', productImage: '/img/product/bigImage.png', productPrice: 29.0, qty: 1, size: '80ml' },
			{ productBrand: 'MISSHA', productTitle: 'Time Revolution Night Repair Cream', productImage: '/img/product/bigImage.png', productPrice: 25.0, qty: 1, size: '50ml' },
		],
	},
	{
		orderId: 'KRV-20260110-0003',
		createdAt: 'Jan 10, 2026',
		status: 'Processing',
		total: 38.5,
		address: '789 Pine Rd, Chicago, IL 60601',
		items: [
			{ productBrand: 'ETUDE', productTitle: 'Soon Jung 2x Barrier Intensive Cream', productImage: '/img/product/bigImage.png', productPrice: 38.5, qty: 1, size: '60ml' },
		],
	},
	{
		orderId: 'KRV-20251220-0001',
		createdAt: 'Dec 20, 2025',
		status: 'Cancelled',
		total: 22.0,
		address: '321 Elm St, Houston, TX 77001',
		items: [
			{ productBrand: 'TORRIDEN', productTitle: 'DIVE-IN Low Molecule Hyaluronic Acid Serum', productImage: '/img/product/bigImage.png', productPrice: 22.0, qty: 1, size: '50ml' },
		],
	},
];

const STATUS_COLORS: Record<OrderStatus, { bg: string; color: string }> = {
	Processing: { bg: '#fff3e0', color: '#e08020' },
	Shipped:    { bg: '#e3f2fd', color: '#1565c0' },
	Delivered:  { bg: '#e8f5e9', color: '#2e7d32' },
	Cancelled:  { bg: '#fce4ec', color: '#c62828' },
};

const MyOrders = () => {
	const device = useDeviceDetect();
	const [expandedId, setExpandedId] = useState<string | null>(null);
	const user = useReactiveVar(userVar);
	const isSeller = user?.memberType === 'SELLER';

	const toggleExpand = (orderId: string) => {
		setExpandedId(expandedId === orderId ? null : orderId);
	};

	const getOrderActions = (status: OrderStatus, isSellerRole: boolean) => {
		if (isSellerRole) {
			if (status === 'Processing') {
				return (
					<Stack className={'mo-actions'} direction={'row'} gap={1}>
						<Button variant={'contained'} size={'small'} onClick={() => console.log('Confirm Order')}>
							Confirm Order
						</Button>
						<Button variant={'outlined'} size={'small'} onClick={() => console.log('Cancel Order')}>
							Cancel Order
						</Button>
					</Stack>
				);
			}
			if (status === 'Shipped') {
				return (
					<Stack className={'mo-actions'} direction={'row'} gap={1}>
						<Button variant={'contained'} size={'small'} onClick={() => console.log('Mark as Delivered')}>
							Mark as Delivered
						</Button>
					</Stack>
				);
			}
			if (status === 'Delivered') {
				return (
					<Stack className={'mo-actions'} direction={'row'} gap={1}>
						<Chip label={'Completed'} color={'success'} size={'small'} />
					</Stack>
				);
			}
			return null;
		}

		if (status === 'Processing') {
			return (
				<Stack className={'mo-actions'} direction={'row'} gap={1}>
					<Button variant={'outlined'} size={'small'} onClick={() => console.log('Cancel Order')}>
						Cancel Order
					</Button>
				</Stack>
			);
		}
		if (status === 'Shipped') {
			return (
				<Stack className={'mo-actions'} direction={'row'} gap={1}>
					<Button variant={'contained'} size={'small'} onClick={() => console.log('Track Shipment')}>
						Track Shipment
					</Button>
				</Stack>
			);
		}
		if (status === 'Delivered') {
			return (
				<Stack className={'mo-actions'} direction={'row'} gap={1}>
					<Button variant={'contained'} size={'small'} onClick={() => console.log('Write Review')}>
						Write Review
					</Button>
				</Stack>
			);
		}
		return null;
	};

	if (device === 'mobile') {
		return <div>MY ORDERS</div>;
	} else {
		return (
			<Stack className={'mo-orders-wrap'}>
				<Typography className={'mo-orders-title'}>Order History</Typography>

				{MOCK_ORDERS.length === 0 ? (
					<Stack className={'mo-empty'}>
						<Typography className={'mo-empty-text'}>You have no orders yet.</Typography>
					</Stack>
				) : (
					<Stack className={'mo-orders-list'}>
						{MOCK_ORDERS.map((order) => {
							const statusStyle = STATUS_COLORS[order.status];
							const isExpanded = expandedId === order.orderId;

							return (
								<Stack key={order.orderId} className={'mo-order-card'}>
									{/* Order header row */}
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

									{/* Address row */}
									<Typography className={'mo-order-address'}>📦 {order.address}</Typography>

									{/* Items count summary */}
									<Typography className={'mo-order-items-count'}>
										{order.items.length} {order.items.length === 1 ? 'item' : 'items'}
									</Typography>

									{getOrderActions(order.status, isSeller)}

									{/* Expanded items list */}
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
