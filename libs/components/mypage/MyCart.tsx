import React, { MouseEvent, useState } from 'react';
import { useReactiveVar } from '@apollo/client';
import { Stack, Box, Typography, Button, Divider, Menu, MenuItem } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { cartVar, saveCart, CartItem } from '../../../apollo/store';
import { REACT_APP_API_URL } from '../../config';
import { sweetConfirmAlert, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';

interface MyCartProps {}
type ShippingCountry = 'UZB' | 'Russia' | 'Korea' | 'USA';

type CartUIState = {
	shippingCountry: ShippingCountry;
	isRemovingAll: boolean;
};

type CartItemWithOptionalOldPrice = CartItem & {
	oldPrice?: number;
	productOldPrice?: number;
};

const SHIPPING_COUNTRIES: ShippingCountry[] = ['UZB', 'Russia', 'Korea', 'USA'];

const getOptionalOldPrice = (item: CartItem): number | null => {
	const typedItem = item as CartItemWithOptionalOldPrice;
	const candidate = typedItem.oldPrice ?? typedItem.productOldPrice;
	return typeof candidate === 'number' && Number.isFinite(candidate) ? candidate : null;
};

const MyCart: React.FC<MyCartProps> = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const cartItems = useReactiveVar(cartVar);
	const [cartUIState, setCartUIState] = useState<CartUIState>({ shippingCountry: 'USA', isRemovingAll: false });
	const [countryAnchorEl, setCountryAnchorEl] = useState<null | HTMLElement>(null);
	const total = cartItems.reduce((acc: number, item: CartItem) => acc + item.productPrice * (item.qty ?? 1), 0);
	const shipping = total >= 50 ? 0 : 5.99;
	const grandTotal = total + shipping;
	const isCountryMenuOpen = Boolean(countryAnchorEl);

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

	const handleOpenCountrySelector = (event: MouseEvent<HTMLButtonElement>) => {
		setCountryAnchorEl(event.currentTarget);
	};

	const handleCloseCountrySelector = () => {
		setCountryAnchorEl(null);
	};

	const handleCountryChange = (country: ShippingCountry) => {
		setCartUIState((prev) => ({ ...prev, shippingCountry: country }));
		handleCloseCountrySelector();
	};

	const handleRemoveAll = async () => {
		if (cartUIState.isRemovingAll) return;
		if (cartItems.length === 0) {
			await sweetMixinErrorAlert('Your cart is already empty.');
			return;
		}

		const confirmed = Boolean(await sweetConfirmAlert('Remove all products from cart?'));
		if (!confirmed) return;

		const previousItems = cartVar();
		setCartUIState((prev) => ({ ...prev, isRemovingAll: true }));
		cartVar([]);
		saveCart([]);

		try {
			await sweetTopSmallSuccessAlert('All products removed.', 900);
		} catch (err: unknown) {
			cartVar(previousItems);
			saveCart(previousItems);
			const errorMessage = err instanceof Error ? err.message : 'Failed to remove all products.';
			await sweetMixinErrorAlert(errorMessage);
		} finally {
			setCartUIState((prev) => ({ ...prev, isRemovingAll: false }));
		}
	};

	const handleCheckout = async () => {
		if (cartItems.length === 0) {
			await sweetMixinErrorAlert('Your cart is empty.');
			return;
		}
		await router.push('/checkout');
	};

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
									<Typography className={'oy-ship-text'}>Shipping to {cartUIState.shippingCountry}</Typography>
									<Button className={'oy-change-btn'} onClick={handleOpenCountrySelector}>
										<Typography>Change</Typography>
									</Button>
									<Menu
										anchorEl={countryAnchorEl}
										open={isCountryMenuOpen}
										onClose={handleCloseCountrySelector}
									>
										{SHIPPING_COUNTRIES.map((country: ShippingCountry) => (
											<MenuItem key={country} onClick={() => handleCountryChange(country)}>
												{country}
											</MenuItem>
										))}
									</Menu>
								</Stack>

								<Stack className={'oy-progress-card'}>
									<Typography className={'oy-progress-text'}>
										{shipping === 0
											? 'You unlocked free shipping'
											: `Add $${(50 - total).toFixed(2)} more for free shipping`}
									</Typography>
									<Box component={'div'} className={'oy-progress-track'}>
										<Box
											component={'div'}
											className={'oy-progress-fill'}
											sx={{ width: `${Math.min((total / 50) * 100, 100)}%` }}
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
											<Button className={'oy-remove-all'} onClick={handleRemoveAll} disabled={cartUIState.isRemovingAll}>
												<Typography>{cartUIState.isRemovingAll ? 'Removing...' : 'Remove all'}</Typography>
											</Button>
										</Stack>

										<Stack className={'my-cart-list'}>
											{cartItems.map((item: CartItem) => (
												(() => {
													const oldPrice = getOptionalOldPrice(item);
													return (
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
																			{item.productBrand || 'OLIVE YOUNG'}
																		</Typography>
																		<Typography className={'item-title'}>{item.productTitle}</Typography>
																	</Stack>
																	<Stack className={'oy-item-price-col'}>
																		{oldPrice !== null && (
																			<Typography className={'oy-item-old-price'}>
																				${oldPrice.toFixed(2)}
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
													);
												})()
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
										<Typography>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</Typography>
									</Stack>

									<Divider />

									<Stack className={'summary-row total'}>
										<Typography>Estimated Total</Typography>
										<Typography>${grandTotal.toFixed(2)}</Typography>
									</Stack>

									<Button className={'checkout-btn'} onClick={handleCheckout}>
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
