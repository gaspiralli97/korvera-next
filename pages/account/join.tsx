import React, { useCallback, useEffect, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Box, Button, Checkbox, FormControlLabel, FormGroup, Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { logIn, signUp } from '../../libs/auth';
import { sweetMixinErrorAlert } from '../../libs/sweetAlert';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Join: NextPage = () => {
	const router = useRouter();
	const device = useDeviceDetect();
	const [input, setInput] = useState({ nick: '', password: '', phone: '', type: 'USER' });
	const [loginView, setLoginView] = useState<boolean>(true);
	const [rememberMe, setRememberMe] = useState<boolean>(true);

	/** LIFECYCLE **/
	useEffect(() => {
		const savedNick = localStorage.getItem('korvera_remember_nick');
		if (savedNick) {
			setInput((prev) => ({ ...prev, nick: savedNick }));
		}
	}, []);

	/** HANDLERS **/
	const viewChangeHandler = (state: boolean) => {
		setLoginView(state);
	};

	const checkUserTypeHandler = (e: any) => {
		const checked = e.target.checked;
		if (checked) {
			const value = e.target.name;
			handleInput('type', value);
		} else {
			handleInput('type', 'USER');
		}
	};

	const handleInput = useCallback((name: any, value: any) => {
		setInput((prev) => {
			return { ...prev, [name]: value };
		});
	}, []);

	const doLogin = useCallback(async () => {
		try {
			await logIn(input.nick, input.password);
			if (rememberMe) {
				localStorage.setItem('korvera_remember_nick', input.nick);
			} else {
				localStorage.removeItem('korvera_remember_nick');
			}
			await router.push(`${router.query.referrer ?? '/'}`);
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	}, [input, rememberMe]);

	const doSignUp = useCallback(async () => {
		try {
			await signUp(input.nick, input.password, input.phone, input.type);
			await router.push(`${router.query.referrer ?? '/'}`);
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	}, [input]);

	const handleSocialLogin = async (provider: string) => {
		await sweetMixinErrorAlert(`${provider} login is coming soon.`);
	};

	const handleForgotPassword = async () => {
		await sweetMixinErrorAlert('Password recovery is coming soon.');
	};

	if (device === 'mobile') {
		return (
			<div className={'mob-auth-page'}>
				<div className={'mob-auth-logo-wrap'}>
					<img src="/img/logo/logoText.svg" alt="" className={'mob-auth-logo'} />
					<span className={'mob-auth-logo-text'}>Korvera</span>
				</div>
				<div className={'mob-auth-card'}>
					<div className={'mob-auth-tabs'}>
						<button className={`mob-auth-tab-btn${loginView ? ' active' : ''}`} onClick={() => viewChangeHandler(true)}>Login</button>
						<button className={`mob-auth-tab-btn${!loginView ? ' active' : ''}`} onClick={() => viewChangeHandler(false)}>Sign Up</button>
					</div>
					<div className={'mob-auth-inputs'}>
						<div className={'mob-auth-field'}>
							<label>Nickname</label>
							<input
								type="text"
								placeholder="Enter Nickname"
								value={input.nick}
								onChange={(e) => handleInput('nick', e.target.value)}
								onKeyDown={(e) => { if (e.key === 'Enter' && loginView) doLogin(); if (e.key === 'Enter' && !loginView) doSignUp(); }}
							/>
						</div>
						<div className={'mob-auth-field'}>
							<label>Password</label>
							<input
								type="password"
								placeholder="Enter Password"
								onChange={(e) => handleInput('password', e.target.value)}
								onKeyDown={(e) => { if (e.key === 'Enter' && loginView) doLogin(); if (e.key === 'Enter' && !loginView) doSignUp(); }}
							/>
						</div>
						{!loginView && (
							<div className={'mob-auth-field'}>
								<label>Phone</label>
								<input
									type="text"
									placeholder="Enter Phone"
									onChange={(e) => handleInput('phone', e.target.value)}
									onKeyDown={(e) => { if (e.key === 'Enter') doSignUp(); }}
								/>
							</div>
						)}
					</div>
					{!loginView && (
						<div className={'mob-auth-type'}>
							<span>Register as:</span>
							<div className={'mob-auth-type-options'}>
								<label className={'mob-auth-type-opt'}>
									<input type="checkbox" name="USER" checked={input.type === 'USER'} onChange={checkUserTypeHandler} />
									User
								</label>
								<label className={'mob-auth-type-opt'}>
									<input type="checkbox" name="SELLER" checked={input.type === 'SELLER'} onChange={checkUserTypeHandler} />
									Seller
								</label>
							</div>
						</div>
					)}
					{loginView && (
						<div className={'mob-auth-remember'}>
							<label>
								<input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
								Remember me
							</label>
							<a onClick={handleForgotPassword} style={{ cursor: 'pointer' }}>Lost password?</a>
						</div>
					)}
					<button
						className={'mob-auth-submit-btn'}
						disabled={loginView ? input.nick === '' || input.password === '' : input.nick === '' || input.password === '' || input.phone === '' || input.type === ''}
						onClick={loginView ? doLogin : doSignUp}
					>
						{loginView ? 'LOGIN' : 'SIGNUP'}
					</button>
					<div className={'mob-auth-divider'}><span>or {loginView ? 'login' : 'sign up'} with</span></div>
					<div className={'mob-auth-social'}>
						<button className={'mob-social-btn'} onClick={() => handleSocialLogin('Google')}>G</button>
						<button className={'mob-social-btn'} onClick={() => handleSocialLogin('Kakao')}>K</button>
						<button className={'mob-social-btn'} onClick={() => handleSocialLogin('Facebook')}>F</button>
						<button className={'mob-social-btn'} onClick={() => handleSocialLogin('Apple')}>A</button>
					</div>
					<p className={'mob-auth-switch'}>
						{loginView ? (
							<>Not registered? <b onClick={() => viewChangeHandler(false)}>SIGNUP</b></>
						) : (
							<>Have account? <b onClick={() => viewChangeHandler(true)}>LOGIN</b></>
						)}
					</p>
				</div>
			</div>
		);
	} else {
		return (
			<Stack className={'join-page'}>
				<Stack className={'container'}>
					<Stack className={'main'}>
						<Stack className={'left'}>
							{/* @ts-ignore */}
							<Box className={'logo'}>
								<img src="/img/logo/logoText.svg" alt="" />
								<span>Korvera</span>
							</Box>
							<Box className={'info'}>
								<span>{loginView ? 'login' : 'signup'}</span>
								<p>{loginView ? 'Login' : 'Sign'} in with this account across the following sites.</p>
							</Box>
							<Box className={'input-wrap'}>
								<div className={'input-box'}>
									<span>Nickname</span>
									<input
										type="text"
										placeholder={'Enter Nickname'}
										value={input.nick}
										onChange={(e) => handleInput('nick', e.target.value)}
										required={true}
										onKeyDown={(event) => {
											if (event.key == 'Enter' && loginView) doLogin();
											if (event.key == 'Enter' && !loginView) doSignUp();
										}}
									/>
								</div>
								<div className={'input-box'}>
									<span>Password</span>
									<input
										type="password"
										placeholder={'Enter Password'}
										onChange={(e) => handleInput('password', e.target.value)}
										required={true}
										onKeyDown={(event) => {
											if (event.key == 'Enter' && loginView) doLogin();
											if (event.key == 'Enter' && !loginView) doSignUp();
										}}
									/>
								</div>
								{!loginView && (
									<div className={'input-box'}>
										<span>Phone</span>
										<input
											type="text"
											placeholder={'Enter Phone'}
											onChange={(e) => handleInput('phone', e.target.value)}
											required={true}
											onKeyDown={(event) => {
												if (event.key == 'Enter') doSignUp();
											}}
										/>
									</div>
								)}
							</Box>
							<Box className={'register'}>
								{!loginView && (
									<div className={'type-option'}>
										<span className={'text'}>I want to be registered as:</span>
										<div>
											<FormGroup>
												<FormControlLabel
													control={
														<Checkbox
															size="small"
															name={'USER'}
															onChange={checkUserTypeHandler}
															checked={input?.type == 'USER'}
														/>
													}
													label="User"
												/>
											</FormGroup>
											<FormGroup>
												<FormControlLabel
													control={
														<Checkbox
															size="small"
															name={'SELLER'}
															onChange={checkUserTypeHandler}
															checked={input?.type == 'SELLER'}
														/>
													}
													label="Seller"
												/>
											</FormGroup>
										</div>
									</div>
								)}

								{loginView && (
									<div className={'remember-info'}>
										<FormGroup>
											<FormControlLabel
												control={
													<Checkbox
														size="small"
														checked={rememberMe}
														onChange={(e) => setRememberMe(e.target.checked)}
													/>
												}
												label="Remember me"
											/>
										</FormGroup>
										<a onClick={handleForgotPassword} style={{ cursor: 'pointer' }}>
											Lost your password?
										</a>
									</div>
								)}

								{loginView ? (
									<Button
										className={'auth-submit-btn'}
										variant="contained"
										endIcon={<img src="/img/icons/rightup.svg" alt="" />}
										disabled={input.nick == '' || input.password == ''}
										onClick={doLogin}
									>
										LOGIN
									</Button>
								) : (
									<Button
										className={'auth-submit-btn'}
										variant="contained"
										disabled={input.nick == '' || input.password == '' || input.phone == '' || input.type == ''}
										onClick={doSignUp}
										endIcon={<img src="/img/icons/rightup.svg" alt="" />}
									>
										SIGNUP
									</Button>
								)}

								<Box className={'social-auth'}>
									<span className={'social-auth-title'}>{loginView ? 'Or login with' : 'Or sign up with'}</span>
									<Stack className={'social-auth-buttons'}>
										<Button className={'social-btn google'} onClick={() => handleSocialLogin('Google')}>
											<span className={'icon'}>
												<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
													<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
													<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
													<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
													<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
												</svg>
											</span>
											Google
										</Button>
										<Button className={'social-btn kakao'} onClick={() => handleSocialLogin('Kakao')}>
											<span className={'icon'}>
												<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
													<path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.61 5.07 4.05 6.48L5.1 21l4.35-2.88c.83.14 1.67.21 2.55.21 5.523 0 10-3.477 10-7.8S17.523 3 12 3z" fill="#3C1E1E"/>
												</svg>
											</span>
											Kakao
										</Button>
										<Button className={'social-btn facebook'} onClick={() => handleSocialLogin('Facebook')}>
											<span className={'icon'}>
												<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
													<path d="M24 12.073C24 5.406 18.627 0 12 0S0 5.406 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.514c-1.491 0-1.956.93-1.956 1.887v2.264h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" fill="#fff"/>
												</svg>
											</span>
											Facebook
										</Button>
										<Button className={'social-btn apple'} onClick={() => handleSocialLogin('Apple')}>
											<span className={'icon'}>
												<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
													<path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.28.07 2.17.73 2.92.75 1.11-.22 2.18-.91 3.39-.82 1.44.12 2.53.69 3.23 1.76-2.97 1.78-2.27 5.74.42 6.85-.52 1.53-1.19 3.04-1.96 4.34zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" fill="#fff"/>
												</svg>
											</span>
											Apple
										</Button>
									</Stack>
								</Box>
							</Box>
							<Box className={'ask-info'}>
								{loginView ? (
									<p>
										Not registered yet?
										<b
											onClick={() => {
												viewChangeHandler(false);
											}}
										>
											SIGNUP
										</b>
									</p>
								) : (
									<p>
										Have account?
										<b onClick={() => viewChangeHandler(true)}> LOGIN</b>
									</p>
								)}
							</Box>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(Join);
