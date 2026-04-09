import React, { MouseEvent, useEffect, useState } from 'react';
import { useReactiveVar, useMutation } from '@apollo/client';
import { Stack, Box, Typography, Button, Divider, Menu, MenuItem } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { cartVar, saveCart, CartItem } from '../../../apollo/store';
import { userVar } from '../../../apollo/store';
import { REACT_APP_API_URL } from '../../config';
import { sweetConfirmAlert, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { LIKE_TARGET_PRODUCT } from '../../../apollo/user/mutation';
import { Message } from '../../enums/common.enum';

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
	const user = useReactiveVar(userVar);
	const userId = user?._id ?? '';
	const [mounted, setMounted] = useState(false);
	const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
	const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);

	useEffect(() => { setMounted(true); }, []);

	useEffect(() => {
		if (!mounted || !userId) return;
		try {
			const raw = localStorage.getItem(`korvera_liked_${userId}`);
			if (raw) setLikedIds(new Set(JSON.parse(raw)));
		} catch {}
	}, [mounted, userId]);
	const [cartUIState, setCartUIState] = useState<CartUIState>(() => {
		const saved = typeof window !== 'undefined' ? localStorage.getItem('shippingCountry') : null;
		const country = (saved && (SHIPPING_COUNTRIES as string[]).includes(saved) ? saved : 'USA') as ShippingCountry;
		return { shippingCountry: country, isRemovingAll: false };
	});
	const [countryAnchorEl, setCountryAnchorEl] = useState<null | HTMLElement>(null);
	const total = cartItems.reduce((acc: number, item: CartItem) => acc + item.productPrice * (item.qty ?? 1), 0);
	const savedAmount = cartItems.reduce((acc: number, item: CartItem) => {
		const old = getOptionalOldPrice(item);
		return old !== null ? acc + (old - item.productPrice) * (item.qty ?? 1) : acc;
	}, 0);
	const shipping = total >= 50 ? 0 : 5.99;
	const grandTotal = total + shipping;
	const displayTotal = total;
	const displayShipping = shipping;
	const displayGrandTotal = grandTotal;
	const isCountryMenuOpen = Boolean(countryAnchorEl);

	/** HANDLERS **/
	const updateQty = (productId: string, size: string, delta: number) => {
		const updatedItems = cartVar().map((item: CartItem) => {
			if (item.productId === productId && item.size === size) {
				const nextQty = (item.qty ?? 1) + delta;
				const clamped = Math.max(1, nextQty);
				const max = typeof item.stockCount === 'number' ? item.stockCount : Infinity;
				return { ...item, qty: Math.min(clamped, max) };
			}
			return item;
		});

		cartVar(updatedItems);
		saveCart(updatedItems, userId);
	};

	const removeItem = (productId: string, size: string) => {
		const updatedItems = cartVar().filter((item: CartItem) => !(item.productId === productId && item.size === size));
		cartVar(updatedItems);
		saveCart(updatedItems, userId);
	};

	const handleOpenCountrySelector = (event: MouseEvent<HTMLButtonElement>) => {
		setCountryAnchorEl(event.currentTarget);
	};

	const handleCloseCountrySelector = () => {
		setCountryAnchorEl(null);
	};

	const handleCountryChange = (country: ShippingCountry) => {
		setCartUIState((prev) => ({ ...prev, shippingCountry: country }));
		localStorage.setItem('shippingCountry', country);
		handleCloseCountrySelector();
	};

	const handleLike = async (productId: string) => {
		productId = String(productId ?? '');
		try {
			if (!userId) throw new Error(Message.NOT_AUTHENTICATED);
			if (!productId) return;
			await likeTargetProduct({ variables: { input: productId } });
			setLikedIds((prev) => {
				const next = new Set(prev);
				next.has(productId) ? next.delete(productId) : next.add(productId);
				localStorage.setItem(`korvera_liked_${String(userId)}`, JSON.stringify([...next]));
				return next;
			});
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
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
		saveCart([], userId);

		try {
			await sweetTopSmallSuccessAlert('All products removed.', 900);
		} catch (err: unknown) {
			cartVar(previousItems);
			saveCart(previousItems, userId);
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

	if (!mounted) return null;

	if (device === 'mobile') {
		return (
			<Box component={'div'} id={'mob-cart-page'}>
				<Stack className={'mob-cart-wrap'}>
					<Stack className={'mob-cart-ship-progress'}>
						<Typography className={'mob-cart-ship-text'}>
							{displayShipping === 0 ? 'You unlocked free shipping 🎉' : `Add $${(50 - displayTotal).toFixed(2)} more for free shipping`}
						</Typography>
						<Box component={'div'} className={'mob-cart-progress-track'}>
							<Box
								component={'div'}
								className={'mob-cart-progress-fill'}
								sx={{ width: `${Math.min((displayTotal / 50) * 100, 100)}%` }}
							/>
						</Box>
					</Stack>

					{cartItems.length === 0 ? (
						<Stack className={'mob-cart-empty'}>
							<Typography className={'mob-cart-empty-title'}>Your cart is empty</Typography>
							<Typography className={'mob-cart-empty-sub'}>Discover curated formulas for your routine.</Typography>
							<Link href={'/product'}>
								<Button className={'mob-cart-shop-btn'}>
									<Typography>Shop Now</Typography>
								</Button>
							</Link>
						</Stack>
					) : (
						<Stack className={'mob-cart-list'}>
							<Stack className={'mob-cart-list-head'}>
								<Typography className={'mob-cart-count'}>{cartItems.length} item(s)</Typography>
								<Button className={'mob-cart-remove-all'} onClick={handleRemoveAll} disabled={cartUIState.isRemovingAll}>
									<Typography>{cartUIState.isRemovingAll ? 'Removing...' : 'Remove all'}</Typography>
								</Button>
							</Stack>

							{cartItems.map((item: CartItem) => {
								const oldPrice = getOptionalOldPrice(item);
								return (
									<Stack className={'mob-cart-item'} key={`${item.productId}-${item.size}`}>
										<Box component={'div'} className={'mob-cart-thumb'}>
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
										<Stack className={'mob-cart-item-info'}>
											<Stack className={'mob-cart-item-top'}>
												<Stack className={'mob-cart-item-name-col'}>
													<Typography className={'mob-cart-item-brand'}>{item.productBrand}</Typography>
													<Typography className={'mob-cart-item-title'}>{item.productTitle}</Typography>
													<Typography className={'mob-cart-item-meta'}>Size: {item.size}</Typography>
												</Stack>
												<Stack className={'mob-cart-item-price-col'}>
													{oldPrice !== null && (
														<Typography className={'mob-cart-old-price'}>${oldPrice.toFixed(2)}</Typography>
													)}
													<Typography className={'mob-cart-price'}>${item.productPrice.toFixed(2)}</Typography>
												</Stack>
											</Stack>
											<Stack className={'mob-cart-item-controls'}>
												<Stack className={'mob-cart-qty'}>
													<button className={'mob-cart-qty-btn'} onClick={() => updateQty(item.productId, item.size, -1)}>−</button>
													<Typography className={'mob-cart-qty-val'}>{item.qty ?? 1}</Typography>
													<button className={'mob-cart-qty-btn'} onClick={() => updateQty(item.productId, item.size, 1)}>+</button>
												</Stack>
												<Stack className={'mob-cart-item-actions'}>
													<button className={'mob-cart-like-btn'} onClick={() => handleLike(item.productId)}>
														{likedIds.has(item.productId)
															? <FavoriteIcon sx={{ fontSize: 16, color: '#e75480' }} />
															: <FavoriteBorderIcon sx={{ fontSize: 16, color: '#aaa' }} />}
													</button>
													<button className={'mob-cart-remove-btn'} onClick={() => removeItem(item.productId, item.size)}>
														Remove
													</button>
												</Stack>
											</Stack>
										</Stack>
									</Stack>
								);
							})}
						</Stack>
					)}
				</Stack>

				{cartItems.length > 0 && (
					<Stack className={'mob-cart-checkout-bar'}>
						{savedAmount > 0 && (
							<Typography className={'mob-cart-saved'}>You saved ${savedAmount.toFixed(2)}</Typography>
						)}
						{displayShipping === 0 && (
							<Typography className={'mob-cart-free-ship'}>Free shipping included ✓</Typography>
						)}
						<Stack className={'mob-cart-total-row'}>
							<Typography className={'mob-cart-total-label'}>Estimated Total</Typography>
							<Typography className={'mob-cart-total-val'}>${displayGrandTotal.toFixed(2)}</Typography>
						</Stack>
						<Button className={'mob-cart-checkout-btn'} onClick={handleCheckout}>
							<Typography>Proceed to Checkout</Typography>
						</Button>
					</Stack>
				)}
			</Box>
		);
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
															<Button className={'oy-heart-btn'} onClick={() => handleLike(item.productId)}>
																{likedIds.has(item.productId)
																	? <FavoriteIcon sx={{ fontSize: 18, color: '#e75480' }} />
																	: <FavoriteBorderIcon sx={{ fontSize: 18, color: '#aaa' }} />
																}
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
																			{item.productBrand}
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
										<Typography sx={{ color: savedAmount > 0 ? '#e91e63' : undefined }}>
											{savedAmount > 0 ? `-$${savedAmount.toFixed(2)}` : '-$0.00'}
										</Typography>
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

									<Button className={'checkout-btn'} onClick={handleCheckout}>
										<Typography>Proceed to Checkout</Typography>
									</Button>

									<Stack className={'oy-payments-row'}>
										{['visa', 'mastercard', 'paypal', 'applepay', 'amex'].map((name) => (
											<Box key={name} component={'div'} className={'oy-pay-icon'}>
												<img src={`/img/icons/payment/${name}.svg`} alt={name} />
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
