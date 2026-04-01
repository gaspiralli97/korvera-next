import React, { useCallback, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Box, Button, Checkbox, FormControlLabel, FormGroup, Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { useMutation, useReactiveVar } from '@apollo/client';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import { getJwtToken, updateStorage, updateUserInfo } from '../../libs/auth';
import { userVar } from '../../apollo/store';
import { LOGIN, SETUP_ADMIN } from '../../apollo/user/mutation';
import { sweetMixinErrorAlert } from '../../libs/sweetAlert';

const AdminLogin: NextPage = () => {
	const router = useRouter();
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const [isSetupView, setIsSetupView] = useState<boolean>(false);
	const [loginInput, setLoginInput] = useState({ memberNick: '', memberPassword: '' });
	const [setupInput, setSetupInput] = useState({
		memberNick: '',
		memberPassword: '',
		memberPhone: '',
		adminSecret: '',
	});

	/** APOLLO REQUESTS **/
	const [login] = useMutation(LOGIN);
	const [setupAdmin] = useMutation(SETUP_ADMIN);

	/** LIFECYCLES **/
	useEffect(() => {
		const jwt = getJwtToken();
		if (jwt) updateUserInfo(jwt);
	}, []);

	useEffect(() => {
		if (user?.memberType === 'ADMIN') {
			router.push('/_admin').then();
		}
	}, [user, router]);

	/** HANDLERS **/
	const loginInputHandler = useCallback((name: string, value: string) => {
		setLoginInput((prev) => ({ ...prev, [name]: value }));
	}, []);

	const setupInputHandler = useCallback((name: string, value: string) => {
		setSetupInput((prev) => ({ ...prev, [name]: value }));
	}, []);

	const doLogin = useCallback(async () => {
		try {
			const result = await login({
				variables: {
					input: {
						memberNick: loginInput.memberNick,
						memberPassword: loginInput.memberPassword,
					},
				},
				fetchPolicy: 'network-only',
			});
			const jwtToken = result?.data?.login?.accessToken;
			if (!jwtToken) throw new Error('Login failed');
			await updateStorage({ jwtToken });
			updateUserInfo(jwtToken);
			await router.push('/_admin');
		} catch (err: any) {
			await sweetMixinErrorAlert(err?.message ?? 'Login failed');
		}
	}, [loginInput, login, router]);

	const doSetupAdmin = useCallback(async () => {
		try {
			const result = await setupAdmin({
				variables: {
					input: {
						memberNick: setupInput.memberNick,
						memberPassword: setupInput.memberPassword,
						memberPhone: setupInput.memberPhone,
						adminSecret: setupInput.adminSecret,
					},
				},
				fetchPolicy: 'network-only',
			});
			const jwtToken = result?.data?.setupAdmin?.accessToken;
			if (!jwtToken) throw new Error('Admin setup failed');
			await updateStorage({ jwtToken });
			updateUserInfo(jwtToken);
			await router.push('/_admin');
		} catch (err: any) {
			await sweetMixinErrorAlert(err?.message ?? 'Admin setup failed');
		}
	}, [setupInput, setupAdmin, router]);

	if (device === 'mobile') {
		return <div>ADMIN LOGIN MOBILE</div>;
	}

	return (
		<Stack className={'join-page'}>
			<Stack className={'container'}>
				<Stack className={'main'}>
					<Stack className={'left'}>
						{/* @ts-ignore */}
						<Box className={'logo'}>
							<img src="/img/logo/logoText.svg" alt="" />
							<span>Korvera Admin</span>
						</Box>

						<Box className={'info'}>
							<span>{isSetupView ? 'setup admin' : 'login'}</span>
							<p>{isSetupView ? 'Create the first admin account.' : 'Login with your admin account.'}</p>
						</Box>

						<Box className={'input-wrap'}>
							<div className={'input-box'}>
								<span>Nickname</span>
								<input
									type="text"
									placeholder={'Enter Nickname'}
									value={isSetupView ? setupInput.memberNick : loginInput.memberNick}
									onChange={(e) =>
										isSetupView
											? setupInputHandler('memberNick', e.target.value)
											: loginInputHandler('memberNick', e.target.value)
									}
									onKeyDown={(e) => {
										if (e.key === 'Enter' && !isSetupView) doLogin();
									}}
								/>
							</div>
							<div className={'input-box'}>
								<span>Password</span>
								<input
									type="password"
									placeholder={'Enter Password'}
									value={isSetupView ? setupInput.memberPassword : loginInput.memberPassword}
									onChange={(e) =>
										isSetupView
											? setupInputHandler('memberPassword', e.target.value)
											: loginInputHandler('memberPassword', e.target.value)
									}
									onKeyDown={(e) => {
										if (e.key === 'Enter' && !isSetupView) doLogin();
									}}
								/>
							</div>
							{isSetupView && (
								<>
									<div className={'input-box'}>
										<span>Phone</span>
										<input
											type="text"
											placeholder={'Enter Phone'}
											value={setupInput.memberPhone}
											onChange={(e) => setupInputHandler('memberPhone', e.target.value)}
										/>
									</div>
									<div className={'input-box'}>
										<span>Admin Secret</span>
										<input
											type="password"
											placeholder={'Enter Admin Secret'}
											value={setupInput.adminSecret}
											onChange={(e) => setupInputHandler('adminSecret', e.target.value)}
										/>
									</div>
								</>
							)}
						</Box>

						<Box className={'register'}>
							{!isSetupView ? (
								<Button
									className={'auth-submit-btn'}
									variant="contained"
									endIcon={<img src="/img/icons/rightup.svg" alt="" />}
									disabled={loginInput.memberNick === '' || loginInput.memberPassword === ''}
									onClick={doLogin}
									sx={{ background: '#2C1654', '&:hover': { background: '#3d1f7a' } }}
								>
									ADMIN LOGIN
								</Button>
							) : (
								<Button
									className={'auth-submit-btn'}
									variant="contained"
									endIcon={<img src="/img/icons/rightup.svg" alt="" />}
									disabled={
										setupInput.memberNick === '' ||
										setupInput.memberPassword === '' ||
										setupInput.memberPhone === '' ||
										setupInput.adminSecret === ''
									}
									onClick={doSetupAdmin}
									sx={{ background: '#2C1654', '&:hover': { background: '#3d1f7a' } }}
								>
									SETUP ADMIN
								</Button>
							)}
						</Box>

						<Box className={'ask-info'}>
							{!isSetupView ? (
								<p>
									First time setup?
									<b onClick={() => setIsSetupView(true)}>SETUP ADMIN</b>
								</p>
							) : (
								<p>
									Have account?
									<b onClick={() => setIsSetupView(false)}>LOGIN</b>
								</p>
							)}
						</Box>
					</Stack>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default withLayoutBasic(AdminLogin);
