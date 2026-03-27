import React, { useState } from 'react';
import { Stack, Box, Typography, Button, Divider } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useReactiveVar } from '@apollo/client';
import { cartVar, saveCart, CartItem } from '../../../apollo/store';
import { REACT_APP_API_URL } from '../../config';
import Link from 'next/link';
import { useRouter } from 'next/router';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const MyCart = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const cartItems = useReactiveVar(cartVar);
	const [promoCode, setPromoCode] = useState<string>('');

	const subtotal = cartItems.reduce((acc: number, item: CartItem) => acc + item.productPrice * item.qty, 0);
	const shipping = subtotal >= 50 ? 0 : 5.99;
	const grandTotal = subtotal + shipping;
	const freeShippingProgress = Math.min((subtotal / 50) * 100, 100);

	/** HANDLERS **/
	const updateQty = (productId: string, size: string, delta: number) => {
		const updated = cartVar()
			.map((item: CartItem) =>
				item.productId === productId && item.size === size ? { ...item, qty: item.qty + delta } : item,
			)
			.filter((item: CartItem) => item.qty > 0);
		cartVar(updated);
		saveCart(updated);
	};

	const removeItem = (productId: string, size: string) => {
		const updated = cartVar().filter(
			(item: CartItem) => !(item.productId === productId && item.size === size),
		);
		cartVar(updated);
		saveCart(updated);
	};

	const removeAllHandler = () => {
		cartVar([]);
		saveCart([]);
	};

	if (device === 'mobile') {
		return <div>MY CART</div>;
	} else {
		return (
			<Box component={'div'} id={'my-cart-page'}>
				<Box component={'div'} className={'container'}>
					<Stack className={'oy-cart-wrap'}>

						{/* ── Page title ── */}
						<Typography className={'oy-cart-title'}>Cart</Typography>

						<Stack className={'oy-cart-layout'}>

							{/* ════════════════════════════════
							    LEFT — Items
							════════════════════════════════ */}
							<Stack className={'oy-cart-left'}>

								{/* Shipping destination */}
								<Stack className={'oy-ship-bar'}>
									<Stack className={'oy-ship-left'}>
										<span className={'oy-flag'}>🇺🇸</span>
										<Typography className={'oy-ship-text'}>Shipping to U.S.A</Typography>
									</Stack>
									<Button className={'oy-change-btn'} disableRipple>
										Change
									</Button>
								</Stack>

								{/* Free shipping progress */}
								<Stack className={'oy-progress-wrap'}>
									<Typography className={'oy-progress-label'}>
										{shipping === 0
											? 'Qualifies for Free Shipping!'
											: `Add $${(50 - subtotal).toFixed(2)} more to qualify for Free Shipping`}
									</Typography>
									<Box component={'div'} className={'oy-progress-track'}>
										<Box
											component={'div'}
											className={'oy-progress-fill'}
											sx={{ width: `${freeShippingProgress}%` }}
										/>
									</Box>
								</Stack>

								{/* Items header */}
								{cartItems.length === 0 ? (
									<Stack className={'oy-empty-box'}>
										<Typography className={'oy-empty-title'}>Your cart is empty</Typography>
										<Typography className={'oy-empty-sub'}>
											Discover curated formulas designed for your routine.
										</Typography>
										<Link href={'/product'}>
											<Button className={'oy-shop-btn'} disableRipple>
												Shop Now
											</Button>
										</Link>
									</Stack>
								) : (
									<Stack className={'oy-items-section'}>
										<Stack className={'oy-items-header'}>
											<Typography className={'oy-items-count'}>
												{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
											</Typography>
											<Button className={'oy-remove-all-btn'} disableRipple onClick={removeAllHandler}>
												Remove all
											</Button>
										</Stack>

										<Stack className={'oy-items-list'}>
											{cartItems.map((item: CartItem) => (
												<Stack key={`${item.productId}-${item.size}`} className={'oy-item'}>

													{/* Heart */}
													<button className={'oy-wish-btn'}>
														<FavoriteBorderIcon sx={{ fontSize: 18, color: '#bbb' }} />
													</button>

													{/* Image */}
													<Box component={'div'} className={'oy-item-thumb'}>
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

													{/* Info */}
													<Stack className={'oy-item-info'}>
														<Stack className={'oy-item-top-row'}>
															<Stack className={'oy-item-name-col'}>
																<Typography className={'oy-item-brand'}>{item.productBrand}</Typography>
																<Typography className={'oy-item-title'}>{item.productTitle}</Typography>
																<Typography className={'oy-item-size'}>Size: {item.size}</Typography>
															</Stack>
															<Typography className={'oy-item-price'}>${item.productPrice.toFixed(2)}</Typography>
														</Stack>

														<Stack className={'oy-item-bottom-row'}>
															<Stack className={'oy-qty-box'}>
																<button
																	className={'oy-qty-btn'}
																	onClick={() => updateQty(item.productId, item.size, -1)}
																>
																	−
																</button>
																<Typography className={'oy-qty-val'}>{item.qty}</Typography>
																<button
																	className={'oy-qty-btn'}
																	onClick={() => updateQty(item.productId, item.size, 1)}
																>
																	+
																</button>
															</Stack>
															<button
																className={'oy-remove-btn'}
																onClick={() => removeItem(item.productId, item.size)}
															>
																Remove
															</button>
														</Stack>
													</Stack>

												</Stack>
											))}
										</Stack>
									</Stack>
								)}
							</Stack>

							{/* ════════════════════════════════
							    RIGHT — Summary
							════════════════════════════════ */}
							<Stack className={'oy-cart-right'}>

								{/* Promos & Offers */}
								<Stack className={'oy-promo-card'}>
									<Stack className={'oy-promo-card-header'}>
										<Typography className={'oy-promo-card-title'}>Promos & Offers</Typography>
										<Button className={'oy-more-btn'} disableRipple>
											More &gt;
										</Button>
									</Stack>

									<Stack className={'oy-promo-row-item'}>
										<Typography className={'oy-promo-row-label'}>Promo Code</Typography>
										<Typography className={'oy-promo-row-value'}>-US$0.00</Typography>
									</Stack>
									<Stack className={'oy-promo-input-row'}>
										<input
											className={'oy-promo-input'}
											placeholder={'Enter Promo Code'}
											value={promoCode}
											onChange={(e) => setPromoCode(e.target.value)}
										/>
										<Button className={'oy-apply-btn'} disableRipple>
											Apply
										</Button>
									</Stack>

									<Stack className={'oy-promo-row-item'}>
										<Typography className={'oy-promo-row-label'}>Coupon</Typography>
										<Typography className={'oy-sign-in-link'}>
											Sign in to check available coupons
										</Typography>
									</Stack>

									<Stack className={'oy-promo-row-item'}>
										<Typography className={'oy-promo-row-label'}>Sale</Typography>
										<Typography className={'oy-promo-row-value'}>-US$0.00</Typography>
									</Stack>
								</Stack>

								{/* Order Preview */}
								<Stack className={'oy-order-card'}>
									<Typography className={'oy-order-title'}>Order Preview</Typography>

									<Stack className={'oy-order-row'}>
										<Typography className={'oy-order-label'}>Subtotal</Typography>
										<Typography className={'oy-order-value'}>${subtotal.toFixed(2)}</Typography>
									</Stack>
									<Stack className={'oy-order-row'}>
										<Typography className={'oy-order-label'}>Total Items Value</Typography>
										<Typography className={'oy-order-value'}>${subtotal.toFixed(2)}</Typography>
									</Stack>
									<Stack className={'oy-order-row'}>
										<Typography className={'oy-order-label'}>Total Discount</Typography>
										<Typography className={'oy-order-value oy-discount'}>-$0.00</Typography>
									</Stack>

									<Divider sx={{ my: '10px', borderColor: '#eee' }} />

									<Stack className={'oy-order-row'}>
										<Typography className={'oy-order-label'}>Shipping</Typography>
										<Typography className={'oy-order-value'}>
											{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
										</Typography>
									</Stack>
									<Stack className={'oy-order-row'}>
										<Typography className={'oy-order-label oy-underline'}>Estimated Duties</Typography>
										<Typography className={'oy-order-value oy-orange'}>Charged at customs</Typography>
									</Stack>
									<Stack className={'oy-order-row'}>
										<Typography className={'oy-order-label oy-underline'}>Estimated Taxes</Typography>
										<Typography className={'oy-order-value oy-orange'}>To be calculated</Typography>
									</Stack>

									<Divider sx={{ my: '10px', borderColor: '#eee' }} />

									<Stack className={'oy-order-row oy-total-row'}>
										<Stack>
											<Typography className={'oy-total-label'}>Estimated Total</Typography>
											<Typography className={'oy-total-items'}>({cartItems.length} items)</Typography>
										</Stack>
										<Typography className={'oy-total-value'}>${grandTotal.toFixed(2)}</Typography>
									</Stack>
								</Stack>

								{/* Checkout */}
								<Button className={'oy-checkout-btn'} disableRipple onClick={() => router.push('/order')}>
									Proceed to Checkout
								</Button>

								{/* Currency note */}
								<Typography className={'oy-currency-note'}>
									- The final payment amount is calculated based on US$ or ¥, and the payment amount and the
									charge amount may differ depending on the currency exchange rate and the time of the
									transaction.
								</Typography>

								{/* Payment methods */}
								<Stack className={'oy-payments-wrap'}>
									<Typography className={'oy-payments-title'}>Supported payment methods</Typography>
									<Stack className={'oy-payments-icons'}>
										{[
											{ name: 'PayPal', src: '/img/icons/payment/paypal.svg' },
											{ name: 'Apple Pay', src: '/img/icons/payment/applepay.svg' },
											{ name: 'VISA', src: '/img/icons/payment/visa.svg' },
											{ name: 'Mastercard', src: '/img/icons/payment/mastercard.svg' },
											{ name: 'AMEX', src: '/img/icons/payment/amex.svg' },
											{ name: 'Discover', src: '/img/icons/payment/discover.svg' },
											{ name: 'JCB', src: '/img/icons/payment/jcb.svg' },
											{ name: 'Alipay+', src: '/img/icons/payment/alipay.svg' },
										].map((method) => (
											<Box key={method.name} component={'div'} className={'oy-pay-badge'}>
												<img src={method.src} alt={method.name} />
											</Box>
										))}
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
