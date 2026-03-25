import React from 'react';
import { useReactiveVar } from '@apollo/client';
import { Stack, Box, Typography, Button, Divider } from '@mui/material';
import Link from 'next/link';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { cartVar, saveCart, CartItem } from '../../../apollo/store';
import { REACT_APP_API_URL } from '../../config';

interface MyCartProps {}

const MyCart: React.FC<MyCartProps> = () => {
	const device = useDeviceDetect();
	const cartItems = useReactiveVar(cartVar);
	const total = cartItems.reduce((acc: number, item: CartItem) => acc + item.productPrice * (item.qty ?? 1), 0);
	const shipping = total >= 50 ? 0 : 5.99;
	const grandTotal = total + shipping;

	/** HANDLERS **/
	const updateQty = (productId: string, size: string, delta: number) => {
		const updatedItems = cartVar().map((item: CartItem) => {
			if (item.productId === productId && item.size === size) {
				const nextQty = (item.qty ?? 1) + delta;
				return { ...item, qty: nextQty < 1 ? 1 : nextQty };
			}
			return item;
		});

		cartVar(updatedItems);
		saveCart(updatedItems);
	};

	const removeItem = (productId: string, size: string) => {
		const updatedItems = cartVar().filter((item: CartItem) => !(item.productId === productId && item.size === size));
		cartVar(updatedItems);
		saveCart(updatedItems);
	};

	if (device === 'mobile') {
		return <div>MY CART</div>;
	} else {
		return (
			<Box component={'div'} id={'my-cart-page'}>
				<Box component={'div'} className={'container'}>
					<Stack className={'my-cart-wrap'}>
						<Stack className={'my-cart-head'}>
							<Typography className={'my-cart-title'}>My Cart</Typography>
							<Typography className={'my-cart-sub'}>Luxury essentials, ready for checkout.</Typography>
						</Stack>

						{cartItems.length === 0 ? (
							<Stack className={'my-cart-empty'}>
								<Typography className={'empty-title'}>Your cart is empty</Typography>
								<Typography className={'empty-sub'}>Discover curated formulas designed for your routine.</Typography>
								<Link href={'/product'}>
									<Button className={'shop-btn'}>
										<Typography>Shop Now</Typography>
									</Button>
								</Link>
							</Stack>
						) : (
							<Stack className={'my-cart-body'}>
								<Stack className={'my-cart-list'}>
									{cartItems.map((item: CartItem) => (
										<Stack className={'cart-item'} key={`${item.productId}-${item.size}`}>
											<Box component={'div'} className={'thumb-wrap'}>
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
											<Stack className={'item-info'}>
												<Typography className={'item-title'}>{item.productTitle}</Typography>
												<Typography className={'item-meta'}>Size: {item.size}</Typography>
												<Typography className={'item-price'}>${item.productPrice.toFixed(2)}</Typography>
												<Stack className={'item-controls'}>
													<Stack className={'qty-box'}>
														<Button className={'qty-btn'} onClick={() => updateQty(item.productId, item.size, -1)}>
															-
														</Button>
														<Typography className={'qty-value'}>{item.qty ?? 1}</Typography>
														<Button className={'qty-btn'} onClick={() => updateQty(item.productId, item.size, 1)}>
															+
														</Button>
													</Stack>
													<Button className={'remove-btn'} onClick={() => removeItem(item.productId, item.size)}>
														<Typography>Remove</Typography>
													</Button>
												</Stack>
											</Stack>
										</Stack>
									))}
								</Stack>

								<Stack className={'my-cart-summary'}>
									<Typography className={'summary-title'}>Order Summary</Typography>
									<Stack className={'summary-row'}>
										<Typography>Subtotal</Typography>
										<Typography>${total.toFixed(2)}</Typography>
									</Stack>
									<Stack className={'summary-row'}>
										<Typography>Shipping</Typography>
										<Typography>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</Typography>
									</Stack>
									<Divider />
									<Stack className={'summary-row total'}>
										<Typography>Total</Typography>
										<Typography>${grandTotal.toFixed(2)}</Typography>
									</Stack>
									<Button className={'checkout-btn'}>
										<Typography>Proceed to Checkout</Typography>
									</Button>
								</Stack>
							</Stack>
						)}
					</Stack>
				</Box>
			</Box>
		);
	}
};

export default MyCart;
