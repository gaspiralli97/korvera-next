import React, { useEffect, useState } from 'react';
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
	const [mounted, setMounted] = useState(false);
	useEffect(() => { setMounted(true); }, []);

	const total = cartItems.reduce((acc: number, item: CartItem) => acc + item.productPrice * (item.qty ?? 1), 0);
	const shipping = total >= 50 ? 0 : 5.99;
	const grandTotal = total + shipping;
	const displayTotal = total;
	const displayShipping = shipping;
	const displayGrandTotal = grandTotal;

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

	if (!mounted) return null;

	if (device === 'mobile') {
		return <div>MY CART</div>;
	} else {
		return (
			<Box component={'div'} id={'my-cart-page'}>
				<Box component={'div'} className={'container'}>
					<Stack className={'my-cart-wrap'}>
						<Stack className={'oy-cart-layout'}>
							<Stack className={'oy-cart-left'}>
								<Stack className={'oy-shipping-top'}>
									<Typography className={'oy-ship-text'}>Shipping to USA</Typography>
									<Button className={'oy-change-btn'}>
										<Typography>Change</Typography>
									</Button>
								</Stack>

								<Stack className={'oy-progress-card'}>
									<Typography className={'oy-progress-text'}>
										{displayShipping === 0
											? 'You unlocked free shipping'
											: `Add $${(50 - displayTotal).toFixed(2)} more for free shipping`}
									</Typography>
									<Box component={'div'} className={'oy-progress-track'}>
										<Box
											component={'div'}
											className={'oy-progress-fill'}
											sx={{ width: `${Math.min((displayTotal / 50) * 100, 100)}%` }}
										/>
									</Box>
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
									<Stack className={'oy-items-area'}>
										<Stack className={'oy-items-head'}>
											<Typography className={'oy-items-count'}>{cartItems.length} item(s)</Typography>
											<Button className={'oy-remove-all'}>
												<Typography>Remove all</Typography>
											</Button>
										</Stack>

										<Stack className={'my-cart-list'}>
											{cartItems.map((item: CartItem) => (
												<Stack className={'cart-item'} key={`${item.productId}-${item.size}`}>
													<Button className={'oy-heart-btn'}>
														<Typography>♡</Typography>
													</Button>

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
														<Stack className={'oy-item-top'}>
															<Stack className={'oy-item-name-col'}>
																<Typography className={'oy-item-brand'}>
																	{(item as any).productBrand ?? 'OLIVE YOUNG'}
																</Typography>
																<Typography className={'item-title'}>{item.productTitle}</Typography>
															</Stack>
															<Stack className={'oy-item-price-col'}>
																{Boolean((item as any).oldPrice ?? (item as any).productOldPrice) && (
																	<Typography className={'oy-item-old-price'}>
																		$
																		{Number((item as any).oldPrice ?? (item as any).productOldPrice).toFixed(2)}
																	</Typography>
																)}
																<Typography className={'item-price'}>${item.productPrice.toFixed(2)}</Typography>
															</Stack>
														</Stack>

														<Typography className={'item-meta'}>Size: {item.size}</Typography>

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
									</Stack>
								)}
							</Stack>

							<Stack className={'oy-cart-right'}>
								<Stack className={'my-cart-summary'}>
									<Stack className={'oy-promo-row'}>
										<Box component={'div'} className={'oy-promo-input-wrap'}>
											<input className={'oy-promo-input'} placeholder={'Promo code'} />
										</Box>
										<Button className={'oy-apply-btn'}>
											<Typography>Apply</Typography>
										</Button>
									</Stack>

									<Stack className={'oy-coupon-sale'}>
										<Typography className={'oy-coupon-label'}>Coupon / Sale</Typography>
										<Typography className={'oy-coupon-value'}>-$0.00</Typography>
									</Stack>

									<Divider />

									<Typography className={'summary-title'}>Order Summary</Typography>
									<Stack className={'summary-row'}>
										<Typography>Subtotal</Typography>
										<Typography>${total.toFixed(2)}</Typography>
									</Stack>
									<Stack className={'summary-row'}>
										<Typography>Discount</Typography>
										<Typography>-$0.00</Typography>
									</Stack>
									<Stack className={'summary-row'}>
										<Typography>Shipping</Typography>
										<Typography>{displayShipping === 0 ? 'FREE' : `$${displayShipping.toFixed(2)}`}</Typography>
									</Stack>

									<Divider />

									<Stack className={'summary-row total'}>
										<Typography>Estimated Total</Typography>
										<Typography>${displayGrandTotal.toFixed(2)}</Typography>
									</Stack>

									<Button className={'checkout-btn'}>
										<Typography>Proceed to Checkout</Typography>
									</Button>

									<Stack className={'oy-payments-row'}>
										<Typography className={'oy-pay-icon'}>VISA</Typography>
										<Typography className={'oy-pay-icon'}>Mastercard</Typography>
										<Typography className={'oy-pay-icon'}>PayPal</Typography>
										<Typography className={'oy-pay-icon'}>Apple Pay</Typography>
									</Stack>
								</Stack>
							</Stack>
						</Stack>
					</Stack>
				</Box>
			</Box>
		);
	}
};

export default MyCart;
