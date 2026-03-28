import React from 'react';
import { useRouter } from 'next/router';
import { Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Link from 'next/link';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { REACT_APP_API_URL } from '../../config';
import { logOut } from '../../auth';
import { sweetConfirmAlert } from '../../sweetAlert';

const MyMenu = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const category: any = router.query?.category ?? 'myProfile';
	const user = useReactiveVar(userVar);

	const isSeller = user?.memberType === 'SELLER';
	const isAdmin = user?.memberType === 'ADMIN';
	const isUser = user?.memberType === 'USER';
	const memberFollowersCount = user?.memberFollowers ?? 0;
	const memberFollowingsCount = user?.memberFollowings ?? 0;

	const logoutHandler = async () => {
		try {
			if (await sweetConfirmAlert('Do you want to logout?')) logOut();
		} catch (err: any) {
			console.log('ERROR, logoutHandler:', err.message);
		}
	};

	const navLink = (cat: string, label: string, badge?: string) => (
		<Link href={{ pathname: '/mypage', query: { category: cat } }} scroll={false}>
			<Typography className={`menu-item ${category === cat ? 'active' : ''}`}>
				{label}
				{badge && <span className="menu-badge">{badge}</span>}
			</Typography>
		</Link>
	);

	if (device === 'mobile') {
		return <div>MY MENU MOBILE</div>;
	}

	return (
		<Stack className={'my-menu'}>
			{/* ── Account Header ── */}
			<Stack className={'menu-header'}>
				<Stack className={'menu-header-inner'}>
					<img
						src={user?.memberImage ? `${REACT_APP_API_URL}/${user?.memberImage}` : '/img/profile/defaultUser.svg'}
						alt="avatar"
						className={'menu-avatar'}
					/>
					<Stack className={'menu-header-info'}>
						<Typography className={'menu-username'}>{user?.memberNick ?? 'My Account'}</Typography>
						<Typography className={'menu-userbadge'}>
							{isAdmin ? '👑 Admin' : isSeller ? '🛍️ Seller' : '✨ Member'}
						</Typography>
					</Stack>
				</Stack>
				<Typography className={'menu-header-title'}>My Account</Typography>
			</Stack>

			{/* ── My Shopping ── */}
			<Stack className={'menu-section'}>
				<Typography className={'menu-section-title'}>My Shopping</Typography>
				{navLink('myOrders', 'Track Orders')}
				{navLink('myFavorites', 'Wish List')}
				<div className={'menu-divider'} />
				{navLink('recentlyVisited', 'Recently Visited')}
			</Stack>

			{/* ── My Activities ── */}
			<Stack className={'menu-section'}>
				<Typography className={'menu-section-title'}>My Activities</Typography>
				{navLink('followers', `My Followers (${memberFollowersCount})`)}
				{navLink('followings', `My Followings (${memberFollowingsCount})`)}
				<div className={'menu-divider'} />
				{(!isUser && (isSeller || isAdmin)) && (
					<>
						{navLink('myArticles', 'My Articles')}
						{navLink('writeArticle', 'Write Article')}
					</>
				)}
			</Stack>

			{/* ── My Store (SELLER only) ── */}
			{isSeller && (
				<Stack className={'menu-section'}>
					<Typography className={'menu-section-title'}>My Store</Typography>
					{navLink('myProducts', 'My Products')}
					{navLink('addProduct', 'Add Product', 'NEW')}
				</Stack>
			)}

			{/* ── My Profile ── */}
			<Stack className={'menu-section'}>
				<Typography className={'menu-section-title'}>My Profile</Typography>
				{navLink('myProfile', 'Account Information')}
				{isAdmin && (
					<a href="/_admin/users" target="_blank" rel="noreferrer">
						<Typography className={'menu-item menu-admin'}>Admin Panel</Typography>
					</a>
				)}
				<Typography className={'menu-item menu-logout'} onClick={logoutHandler}>
					Logout
				</Typography>
			</Stack>
		</Stack>
	);
};

export default MyMenu;
