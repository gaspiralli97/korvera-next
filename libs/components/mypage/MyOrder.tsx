import React, { useState, useEffect } from 'react';
import { Stack, Box, Typography, Button, Divider, Radio, RadioGroup, FormControlLabel, Checkbox } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useReactiveVar, useMutation } from '@apollo/client';
import { cartVar, saveCart, CartItem, userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import { sweetMixinErrorAlert } from '../../sweetAlert';
import { CREATE_ORDER } from '../../../apollo/user/mutation';

const MyOrder = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const cartItems = useReactiveVar(cartVar);
	const user = useReactiveVar(userVar);
	const [createOrder] = useMutation(CREATE_ORDER);

	const COUNTRY_CONFIG: Record<string, { flag: string; company: string }> = {
		USA:    { flag: '🇺🇸', company: 'FedEx' },
		Korea:  { flag: '🇰🇷', company: 'CJ Logistics' },
		Russia: { flag: '🇷🇺', company: 'CDEK' },
		UZB:    { flag: '🇺🇿', company: 'Uzbekistan Post' },
	};
	const [countryConfig, setCountryConfig] = useState(COUNTRY_CONFIG['USA']);

	useEffect(() => {
		const savedCountry = localStorage.getItem('shippingCountry') ?? 'USA';
		setCountryConfig(COUNTRY_CONFIG[savedCountry] ?? COUNTRY_CONFIG['USA']);
	}, []);

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

	// Load saved checkout info from localStorage, fallback to user profile
	useEffect(() => {
		if (!user?._id) return;
		try {
			const raw = localStorage.getItem(`korvera_checkout_${user._id}`);
			if (raw) {
				const saved = JSON.parse(raw);
				if (saved.firstName) setFirstName(saved.firstName);
				if (saved.lastName) setLastName(saved.lastName);
				if (saved.address) setAddress(saved.address);
				if (saved.apt) setApt(saved.apt);
				if (saved.city) setCity(saved.city);
				if (saved.stateVal) setStateVal(saved.stateVal);
				if (saved.zip) setZip(saved.zip);
				if (saved.mobile) setMobile(saved.mobile);
				if (saved.email) setEmail(saved.email);
				return;
			}
		} catch {}
		// No saved data — fall back to user profile fields
		if (user.memberPhone) setMobile(user.memberPhone);
		if (user.memberAddress) setAddress(user.memberAddress);
	}, [user?._id]);

	// Persist checkout fields to localStorage whenever they change
	useEffect(() => {
		if (!user?._id) return;
		const data = { firstName, lastName, address, apt, city, stateVal, zip, mobile, email };
		localStorage.setItem(`korvera_checkout_${user._id}`, JSON.stringify(data));
	}, [firstName, lastName, address, apt, city, stateVal, zip, mobile, email, user?._id]);

	// Order summary
	const pointsBalance = user?.memberPoints ?? 0;
	const subtotal = cartItems.reduce((acc: number, item: CartItem) => acc + item.productPrice * item.qty, 0);
	const pointsDiscount = Math.min(Number(points) || 0, subtotal);
	const shipping = subtotal >= 50 ? 0 : 5.99;
	const grandTotal = subtotal + shipping - pointsDiscount;

	/** HANDLERS **/
	const handleCardNumber = (val: string) => {
		const digits = val.replace(/\D/g, '').slice(0, 16);
		const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
		setCardNumber(formatted);
	};

	const handleExpiry = (val: string) => {
		const digits = val.replace(/\D/g, '').slice(0, 4);
		const formatted = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
		setExpiry(formatted);
	};

	const handleCvv = (val: string) => {
		setCvv(val.replace(/\D/g, '').slice(0, 3));
	};

	const placeOrderHandler = async () => {
		if (cartItems.length === 0) { await sweetMixinErrorAlert('Your cart is empty.'); return; }
		if (!firstName.trim()) { await sweetMixinErrorAlert('Please enter your first name.'); return; }
		if (!lastName.trim()) { await sweetMixinErrorAlert('Please enter your last name.'); return; }
		if (!address.trim()) { await sweetMixinErrorAlert('Please enter your address.'); return; }
		if (!city.trim()) { await sweetMixinErrorAlert('Please enter your city.'); return; }
		if (!stateVal.trim()) { await sweetMixinErrorAlert('Please enter your state / province.'); return; }
		if (!zip.trim()) { await sweetMixinErrorAlert('Please enter your zip / postal code.'); return; }
		if (!mobile.trim()) { await sweetMixinErrorAlert('Please enter your mobile number.'); return; }
		if (!email.trim()) { await sweetMixinErrorAlert('Please enter your email.'); return; }
		if (paymentMethod === 'card') {
			const rawCard = cardNumber.replace(/\s/g, '');
			if (rawCard.length !== 16) { await sweetMixinErrorAlert('Card number must be exactly 16 digits.'); return; }
			const rawExpiry = expiry.replace('/', '');
			if (rawExpiry.length !== 4) { await sweetMixinErrorAlert('Expiry must be 4 digits (MM/YY).'); return; }
			if (cvv.length !== 3) { await sweetMixinErrorAlert('CVV must be exactly 3 digits.'); return; }
		}

		try {
			const orderItems = cartItems.map((item: CartItem) => ({
				productId: item.productId,
				productTitle: item.productTitle,
				productPrice: item.productPrice,
				quantity: item.qty,
			}));

			const result = await createOrder({
				variables: {
					input: { orderItems, totalAmount: grandTotal },
				},
			});

			const savedOrder = result?.data?.createOrder;
			const today = new Date();
			const delivery = new Date(today);
			delivery.setDate(today.getDate() + 7);
			const deliveryStr = delivery.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
			const createdAt = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

			const lastOrder = {
				orderId: savedOrder?._id ?? `KRV-${Date.now()}`,
				createdAt,
				items: cartItems,
				subtotal,
				shipping,
				grandTotal,
				estimatedDelivery: deliveryStr,
			};

			localStorage.setItem('korvera_last_order', JSON.stringify(lastOrder));
			cartVar([]);
			saveCart([], user?._id ?? '');
			router.push('/order/success');
		} catch (err: any) {
			await sweetMixinErrorAlert(err?.message ?? 'Failed to place order. Please try again.');
		}
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
											<span className={'oo-flag'}>{countryConfig.flag}</span>
											<Typography className={'oo-section-title'}>Shipping Address</Typography>
										</Stack>
										<Typography className={'oo-section-sub'}>Shipping Company: <strong>{countryConfig.company}</strong></Typography>
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
										<Typography className={'oo-points-balance'}>{pointsBalance.toFixed(2)}P</Typography>
										<Stack className={'oo-points-input-row'}>
											<input
												className={'oo-input oo-points-input'}
												placeholder={'0'}
												type={'number'}
												min={0}
												max={pointsBalance}
												value={points}
												onChange={(e) => {
													const val = Math.min(Number(e.target.value) || 0, pointsBalance);
													setPoints(String(val));
												}}
											/>
											<Button className={'oo-use-all-btn'} disableRipple onClick={() => setPoints(String(pointsBalance))}>Use All</Button>
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
														placeholder={'XXXX XXXX XXXX XXXX'}
														value={cardNumber}
														maxLength={19}
														onChange={(e) => handleCardNumber(e.target.value)}
													/>
													<Stack className={'oo-form-row'}>
														<input
															className={'oo-input'}
															placeholder={'MM/YY'}
															value={expiry}
															maxLength={5}
															onChange={(e) => handleExpiry(e.target.value)}
														/>
														<input
															className={'oo-input'}
															placeholder={'CVV'}
															value={cvv}
															maxLength={3}
															onChange={(e) => handleCvv(e.target.value)}
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
										<Typography className={'oo-summary-value oo-discount'}>-${pointsDiscount.toFixed(2)}</Typography>
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
										disabled={!agreeAll || cartItems.length === 0}
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
