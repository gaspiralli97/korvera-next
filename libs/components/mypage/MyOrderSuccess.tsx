import React, { useEffect, useState } from 'react';
import { Stack, Box, Typography, Button, Divider } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useRouter } from 'next/router';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { REACT_APP_API_URL } from '../../config';

interface LastOrderItem {
	productId: string;
	productTitle: string;
	productBrand: string;
	productImage: string;
	productPrice: number;
	qty: number;
	size: string;
}

interface LastOrder {
	orderId: string;
	createdAt: string;
	items: LastOrderItem[];
	subtotal: number;
	shipping: number;
	grandTotal: number;
	estimatedDelivery: string;
}

const MyOrderSuccess = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [order, setOrder] = useState<LastOrder | null>(null);

	useEffect(() => {
		try {
			const raw = localStorage.getItem('korvera_last_order');
			if (raw) setOrder(JSON.parse(raw));
		} catch {
			setOrder(null);
		}
	}, []);

	if (device === 'mobile') {
		return <div>ORDER SUCCESS</div>;
	} else {
		return (
			<Box component={'div'} id={'my-order-success-page'}>
				<Box component={'div'} className={'container'}>
					<Stack className={'os-wrap'}>

						{/* Success header */}
						<Stack className={'os-header'}>
							<CheckCircleOutlineIcon className={'os-check-icon'} />
							<Typography className={'os-title'}>Order Placed Successfully!</Typography>
							{order && (
								<Typography className={'os-order-num'}>Order #{order.orderId}</Typography>
							)}
							<Typography className={'os-sub'}>
								Thank you for your purchase. We'll send you a confirmation email shortly.
							</Typography>
						</Stack>

						{order && (
							<Stack className={'os-layout'}>

								{/* Items summary */}
								<Stack className={'os-items-card'}>
									<Typography className={'os-card-title'}>Order Summary</Typography>

									<Stack className={'os-items-list'}>
										{order.items.map((item, idx) => (
											<Stack key={idx} className={'os-item'}>
												<Box component={'div'} className={'os-item-thumb'}>
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
												<Stack className={'os-item-info'}>
													<Typography className={'os-item-brand'}>{item.productBrand}</Typography>
													<Typography className={'os-item-title'}>{item.productTitle}</Typography>
													<Typography className={'os-item-meta'}>Size: {item.size} · Qty: {item.qty}</Typography>
												</Stack>
												<Typography className={'os-item-price'}>${(item.productPrice * item.qty).toFixed(2)}</Typography>
											</Stack>
										))}
									</Stack>

									<Divider sx={{ my: '12px', borderColor: '#f0f0f0' }} />

									<Stack className={'os-totals'}>
										<Stack className={'os-total-row'}>
											<Typography className={'os-total-label'}>Subtotal</Typography>
											<Typography className={'os-total-value'}>${order.subtotal.toFixed(2)}</Typography>
										</Stack>
										<Stack className={'os-total-row'}>
											<Typography className={'os-total-label'}>Shipping</Typography>
											<Typography className={'os-total-value'}>{order.shipping === 0 ? 'FREE' : `$${order.shipping.toFixed(2)}`}</Typography>
										</Stack>
										<Divider sx={{ my: '8px', borderColor: '#f0f0f0' }} />
										<Stack className={'os-total-row os-grand'}>
											<Typography className={'os-grand-label'}>Order Total</Typography>
											<Typography className={'os-grand-value'}>${order.grandTotal.toFixed(2)}</Typography>
										</Stack>
									</Stack>
								</Stack>

								{/* Delivery & actions */}
								<Stack className={'os-right'}>
									<Stack className={'os-delivery-card'}>
										<Typography className={'os-card-title'}>Estimated Delivery</Typography>
										<Typography className={'os-delivery-date'}>{order.estimatedDelivery}</Typography>
										<Typography className={'os-delivery-note'}>
											You'll receive a tracking number once your order ships.
										</Typography>
									</Stack>

									<Stack className={'os-actions'}>
										<Button
											className={'os-orders-btn'}
											disableRipple
											onClick={() => router.push('/mypage?category=myOrders')}
										>
											View Order History
										</Button>
										<Button
											className={'os-shop-btn'}
											disableRipple
											onClick={() => router.push('/product')}
										>
											Continue Shopping
										</Button>
									</Stack>
								</Stack>

							</Stack>
						)}

						{!order && (
							<Stack className={'os-no-order'}>
								<Typography className={'os-no-order-text'}>No order data found.</Typography>
								<Button className={'os-shop-btn'} disableRipple onClick={() => router.push('/product')}>
									Continue Shopping
								</Button>
							</Stack>
						)}

					</Stack>
				</Box>
			</Box>
		);
	}
};

export default MyOrderSuccess;
