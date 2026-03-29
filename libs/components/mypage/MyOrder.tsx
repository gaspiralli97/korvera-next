import React, { useState } from 'react';
import { Stack, Box, Typography, Button, Divider, Radio, RadioGroup, FormControlLabel, Checkbox } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useReactiveVar } from '@apollo/client';
import { cartVar, saveCart, CartItem, userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';

const MyOrder = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const cartItems = useReactiveVar(cartVar);
	const user = useReactiveVar(userVar);

	// Shipping address
	const [firstName, setFirstName] = useState<string>('');
	const [lastName, setLastName] = useState<string>('');
	const [address, setAddress] = useState<string>('');
	const [apt, setApt] = useState<string>('');
	const [city, setCity] = useState<string>('');
	const [stateVal, setStateVal] = useState<string>('');
	const [zip, setZip] = useState<string>('');
	const [defaultAddress, setDefaultAddress] = useState<boolean>(false);

	// Contact
	const [mobile, setMobile] = useState<string>('');
	const [email, setEmail] = useState<string>('');

	// Points
	const [points, setPoints] = useState<string>('');

	// Payment
	const [paymentMethod, setPaymentMethod] = useState<string>('paypal');
	const [cardNumber, setCardNumber] = useState<string>('');
	const [expiry, setExpiry] = useState<string>('');
	const [cvv, setCvv] = useState<string>('');
	const [savePayment, setSavePayment] = useState<boolean>(false);

	// Agree
	const [agreeAll, setAgreeAll] = useState<boolean>(false);

	// Order summary
	const subtotal = cartItems.reduce((acc: number, item: CartItem) => acc + item.productPrice * item.qty, 0);
	const shipping = subtotal >= 50 ? 0 : 5.99;
	const grandTotal = subtotal + shipping;

	/** HANDLERS **/
	const placeOrderHandler = () => {
		const orderId = `KRV-${Date.now()}`;
		const today = new Date();
		const delivery = new Date(today);
		delivery.setDate(today.getDate() + 7);
		const deliveryStr = delivery.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
		const createdAt = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
		const fullAddress = [address, apt, city, stateVal, zip].filter(Boolean).join(', ');

		const lastOrder = {
			orderId,
			createdAt,
			items: cartItems,
			subtotal,
			shipping,
			grandTotal,
			estimatedDelivery: deliveryStr,
		};

		const historyRecord = {
			orderId,
			createdAt,
			status: 'Processing',
			items: cartItems,
			total: grandTotal,
			address: fullAddress || 'N/A',
		};

		const historyKey = `korvera_orders_${user?._id ?? 'guest'}`;
		let history: any[] = [];
		try {
			const raw = localStorage.getItem(historyKey);
			if (raw) history = JSON.parse(raw);
		} catch {}
		history.unshift(historyRecord);
		localStorage.setItem(historyKey, JSON.stringify(history));

		localStorage.setItem('korvera_last_order', JSON.stringify(lastOrder));
		cartVar([]);
		saveCart([], user?._id ?? '');
		router.push('/order/success');
	};

	if (device === 'mobile') {
		return <div>ORDER PAGE</div>;
	} else {
		return (
			<Box component={'div'} id={'my-order-page'}>
				<Box component={'div'} className={'container'}>
					<Stack className={'oo-order-wrap'}>

						{/* Page title */}
						<Typography className={'oo-order-title'}>Place Order</Typography>

						<Stack className={'oo-order-layout'}>

							{/* ════════════════════════════════
							    LEFT — Form
							════════════════════════════════ */}
							<Stack className={'oo-order-left'}>

								{/* ── Shipping Address ── */}
								<Stack className={'oo-section-card'}>
									<Stack className={'oo-section-header'}>
										<Stack className={'oo-section-header-left'}>
											<span className={'oo-flag'}>🇺🇸</span>
											<Typography className={'oo-section-title'}>Shipping Address</Typography>
										</Stack>
										<Typography className={'oo-section-sub'}>Shipping Company: <strong>FedEx</strong></Typography>
									</Stack>

									<Stack className={'oo-form-row'}>
										<Stack className={'oo-input-wrap'}>
											<label className={'oo-label'}>First Name</label>
											<input
												className={'oo-input'}
												placeholder={'First Name'}
												value={firstName}
												onChange={(e) => setFirstName(e.target.value)}
											/>
										</Stack>
										<Stack className={'oo-input-wrap'}>
											<label className={'oo-label'}>Last Name</label>
											<input
												className={'oo-input'}
												placeholder={'Last Name'}
												value={lastName}
												onChange={(e) => setLastName(e.target.value)}
											/>
										</Stack>
									</Stack>

									<Stack className={'oo-input-wrap'}>
										<label className={'oo-label'}>Address</label>
										<input
											className={'oo-input'}
											placeholder={'Search address'}
											value={address}
											onChange={(e) => setAddress(e.target.value)}
										/>
									</Stack>

									<Stack className={'oo-input-wrap'}>
										<label className={'oo-label'}>Apt / Suite (optional)</label>
										<input
											className={'oo-input'}
											placeholder={'Apt, suite, unit, building, floor, etc.'}
											value={apt}
											onChange={(e) => setApt(e.target.value)}
										/>
									</Stack>

									<Stack className={'oo-form-row'}>
										<Stack className={'oo-input-wrap'}>
											<label className={'oo-label'}>City</label>
											<input
												className={'oo-input'}
												placeholder={'City'}
												value={city}
												onChange={(e) => setCity(e.target.value)}
											/>
										</Stack>
										<Stack className={'oo-input-wrap'}>
											<label className={'oo-label'}>State / Province</label>
											<input
												className={'oo-input'}
												placeholder={'State'}
												value={stateVal}
												onChange={(e) => setStateVal(e.target.value)}
											/>
										</Stack>
										<Stack className={'oo-input-wrap oo-input-wrap--sm'}>
											<label className={'oo-label'}>Zip / Postal Code</label>
											<input
												className={'oo-input'}
												placeholder={'Zip'}
												value={zip}
												onChange={(e) => setZip(e.target.value)}
											/>
										</Stack>
									</Stack>

									<Stack className={'oo-checkbox-row'}>
										<Checkbox
											className={'oo-checkbox'}
											checked={defaultAddress}
											onChange={(e) => setDefaultAddress(e.target.checked)}
											size={'small'}
										/>
										<Typography className={'oo-checkbox-label'}>Make this my default address</Typography>
									</Stack>

									<Button className={'oo-save-btn'} disableRipple>
										Save &amp; Continue
									</Button>
								</Stack>

								{/* ── Contact Information ── */}
								<Stack className={'oo-section-card'}>
									<Typography className={'oo-section-title'}>Contact Information</Typography>

									<Stack className={'oo-form-row'}>
										<Stack className={'oo-input-wrap'}>
											<label className={'oo-label'}>Mobile Number</label>
											<input
												className={'oo-input'}
												placeholder={'+1 (___) ___-____'}
												value={mobile}
												onChange={(e) => setMobile(e.target.value)}
											/>
										</Stack>
										<Stack className={'oo-input-wrap'}>
											<label className={'oo-label'}>Email</label>
											<input
												className={'oo-input'}
												placeholder={'email@example.com'}
												value={email}
												onChange={(e) => setEmail(e.target.value)}
											/>
										</Stack>
									</Stack>
								</Stack>

								{/* ── Used Points ── */}
								<Stack className={'oo-section-card'}>
									<Typography className={'oo-section-title'}>Used Points</Typography>

									<Stack className={'oo-points-row'}>
										<Typography className={'oo-points-balance'}>0.00P</Typography>
										<Stack className={'oo-points-input-row'}>
											<input
												className={'oo-input oo-points-input'}
												placeholder={'0'}
												value={points}
												onChange={(e) => setPoints(e.target.value)}
											/>
											<Button className={'oo-use-all-btn'} disableRipple>Use All</Button>
										</Stack>
									</Stack>
									<Typography className={'oo-points-note'}>1P = US$1</Typography>
								</Stack>

								{/* ── Payment Method ── */}
								<Stack className={'oo-section-card'}>
									<Typography className={'oo-section-title'}>Payment Method</Typography>

									<RadioGroup
										value={paymentMethod}
										onChange={(e) => setPaymentMethod(e.target.value)}
									>
										{/* PayPal */}
										<Stack className={`oo-pay-option ${paymentMethod === 'paypal' ? 'oo-pay-option--active' : ''}`}>
											<FormControlLabel
												value={'paypal'}
												control={<Radio size={'small'} className={'oo-radio'} />}
												label={
													<Stack className={'oo-pay-label-row'}>
														<Typography className={'oo-pay-name'}>PayPal</Typography>
														<img src={'/img/icons/payment/paypal.svg'} alt={'PayPal'} className={'oo-pay-icon'} />
													</Stack>
												}
												className={'oo-form-control-label'}
											/>
										</Stack>

										{/* Credit / Debit Card */}
										<Stack className={`oo-pay-option ${paymentMethod === 'card' ? 'oo-pay-option--active' : ''}`}>
											<FormControlLabel
												value={'card'}
												control={<Radio size={'small'} className={'oo-radio'} />}
												label={
													<Stack className={'oo-pay-label-row'}>
														<Typography className={'oo-pay-name'}>Credit / Debit Card</Typography>
														<Stack className={'oo-pay-icons-row'}>
															<img src={'/img/icons/payment/visa.svg'} alt={'VISA'} className={'oo-pay-icon'} />
															<img src={'/img/icons/payment/mastercard.svg'} alt={'Mastercard'} className={'oo-pay-icon'} />
															<img src={'/img/icons/payment/amex.svg'} alt={'AMEX'} className={'oo-pay-icon'} />
														</Stack>
													</Stack>
												}
												className={'oo-form-control-label'}
											/>
											{paymentMethod === 'card' && (
												<Stack className={'oo-card-fields'}>
													<input
														className={'oo-input'}
														placeholder={'Card Number'}
														value={cardNumber}
														onChange={(e) => setCardNumber(e.target.value)}
													/>
													<Stack className={'oo-form-row'}>
														<input
															className={'oo-input'}
															placeholder={'MM / YY'}
															value={expiry}
															onChange={(e) => setExpiry(e.target.value)}
														/>
														<input
															className={'oo-input'}
															placeholder={'CVV'}
															value={cvv}
															onChange={(e) => setCvv(e.target.value)}
														/>
													</Stack>
													<Stack className={'oo-checkbox-row'}>
														<Checkbox
															className={'oo-checkbox'}
															checked={savePayment}
															onChange={(e) => setSavePayment(e.target.checked)}
															size={'small'}
														/>
														<Typography className={'oo-checkbox-label'}>Save payment preference</Typography>
													</Stack>
												</Stack>
											)}
										</Stack>

										{/* UnionPay */}
										<Stack className={`oo-pay-option ${paymentMethod === 'unionpay' ? 'oo-pay-option--active' : ''}`}>
											<FormControlLabel
												value={'unionpay'}
												control={<Radio size={'small'} className={'oo-radio'} />}
												label={
													<Stack className={'oo-pay-label-row'}>
														<Typography className={'oo-pay-name'}>UnionPay</Typography>
													</Stack>
												}
												className={'oo-form-control-label'}
											/>
										</Stack>
									</RadioGroup>
								</Stack>

							</Stack>

							{/* ════════════════════════════════
							    RIGHT — Order Summary
							════════════════════════════════ */}
							<Stack className={'oo-order-right'}>

								{/* Order Summary card */}
								<Stack className={'oo-summary-card'}>
									<Typography className={'oo-summary-title'}>Order Summary</Typography>

									<Stack className={'oo-summary-row'}>
										<Typography className={'oo-summary-label'}>Subtotal</Typography>
										<Typography className={'oo-summary-value'}>${subtotal.toFixed(2)}</Typography>
									</Stack>
									<Stack className={'oo-summary-row'}>
										<Typography className={'oo-summary-label'}>Total Items Value</Typography>
										<Typography className={'oo-summary-value'}>${subtotal.toFixed(2)}</Typography>
									</Stack>
									<Stack className={'oo-summary-row'}>
										<Typography className={'oo-summary-label'}>Total Discount</Typography>
										<Typography className={'oo-summary-value oo-discount'}>-$0.00</Typography>
									</Stack>

									<Divider sx={{ my: '10px', borderColor: '#eee' }} />

									<Stack className={'oo-summary-row'}>
										<Typography className={'oo-summary-label'}>Shipping</Typography>
										<Typography className={'oo-summary-value'}>
											{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
										</Typography>
									</Stack>

									<Divider sx={{ my: '10px', borderColor: '#eee' }} />

									<Stack className={'oo-summary-row oo-total-row'}>
										<Typography className={'oo-total-label'}>Order Total</Typography>
										<Typography className={'oo-total-value'}>${grandTotal.toFixed(2)}</Typography>
									</Stack>
								</Stack>

								{/* Agree + Place Order */}
								<Stack className={'oo-agree-section'}>
									<Stack className={'oo-checkbox-row'}>
										<Checkbox
											className={'oo-checkbox'}
											checked={agreeAll}
											onChange={(e) => setAgreeAll(e.target.checked)}
											size={'small'}
										/>
										<Typography className={'oo-agree-label'}>Agree to All</Typography>
									</Stack>

									<Typography className={'oo-terms-text'}>
										I have read and agree to the{' '}
										<span className={'oo-terms-link'}>Terms of Service</span>,{' '}
										<span className={'oo-terms-link'}>Privacy Policy</span>, and{' '}
										<span className={'oo-terms-link'}>Cancellation &amp; Return Policy</span>.
										I also agree to the collection and transfer of payment information for payment processing.
									</Typography>

									<Button
										className={`oo-place-order-btn ${!agreeAll ? 'oo-place-order-btn--disabled' : ''}`}
										disableRipple
										disabled={!agreeAll}
										onClick={placeOrderHandler}
									>
										Place Order
									</Button>

									<Button
										className={'oo-back-btn'}
										disableRipple
										onClick={() => router.push('/cart')}
									>
										← Back to Cart
									</Button>
								</Stack>

							</Stack>
						</Stack>
					</Stack>
				</Box>
			</Box>
		);
	}
};

export default MyOrder;
