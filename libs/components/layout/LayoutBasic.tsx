import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Head from 'next/head';
import Top from '../Top';
import Footer from '../Footer';
import { Stack } from '@mui/material';
import { getJwtToken, updateUserInfo } from '../../auth';
import Chat from '../Chat';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useTranslation } from 'next-i18next';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const withLayoutBasic = (Component: any) => {
	return (props: any) => {
		const router = useRouter();
		const { t, i18n } = useTranslation('common');
		const device = useDeviceDetect();
		const [authHeader, setAuthHeader] = useState<boolean>(false);
		const user = useReactiveVar(userVar);

		const memoizedValues = useMemo(() => {
			let title = '',
				desc = '',
				bgImage = '';

			switch (router.pathname) {
				case '/product':
					title = 'Product Search';
					desc = 'Discover your perfect beauty routine';
					bgImage = '/img/banner/products.jpg';
					break;
				case '/agent':
					title = 'Sellers';
					desc = 'Meet our trusted beauty sellers';
					bgImage = '/img/banner/agents.webp';
					break;
				case '/agent/detail':
					title = 'Seller Page';
					desc = 'Explore seller collections';
					bgImage = '/img/banner/community.jpeg';
					break;
				case '/mypage':
					title = 'My Page';
					desc = 'Manage your beauty profile';
					bgImage = '/img/banner/mypage.jpeg';
					break;
				case '/community':
					title = 'Community';
					desc = 'Share your beauty experience';
					bgImage = '/img/banner/community.jpeg';
					break;
				case '/community/detail':
					title = 'Community Detail';
					desc = 'Share your beauty experience';
					bgImage = '/img/banner/community.jpeg';
					break;
				case '/cs':
					title = 'Customer Support';
					desc = 'We are here to help you';
					bgImage = '/img/banner/cs.webp';
					break;
				case '/account/join':
					title = 'Login / Signup';
					desc = 'Authentication Process';
					bgImage = '/img/banner/cs.webp';
					setAuthHeader(true);
					break;
				case '/member':
					title = 'Member Page';
					desc = 'Beauty enthusiast profile';
					bgImage = '/img/banner/mypage.jpeg';
					break;
				case '/cart':
					title = 'My Basket';
					desc = 'Review your selected items';
					bgImage = '/img/banner/mypage.jpeg';
					break;
				case '/order':
					title = 'Place Order';
					desc = 'Complete your purchase';
					bgImage = '/img/banner/mypage.jpeg';
					break;
				case '/order/success':
					title = 'Order Confirmed';
					desc = 'Thank you for shopping with Korvera';
					bgImage = '/img/banner/mypage.jpeg';
					break;
				default:
					break;
			}

			return { title, desc, bgImage };
		}, [router.pathname]);

		/** LIFECYCLES **/
		useEffect(() => {
			const jwt = getJwtToken();
			if (jwt) updateUserInfo(jwt);
		}, []);

		/** HANDLERS **/

		if (device == 'mobile') {
			return (
				<>
					<Head>
						<title>Korvera</title>
						<meta name={'title'} content={`Korvera`} />
					</Head>
					<Stack id="mobile-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		} else {
			return (
				<>
					<Head>
						<title>Korvera</title>
						<meta name={'title'} content={`Korvera`} />
					</Head>
					<Stack id="pc-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<Stack
							className={`header-basic ${authHeader && 'auth'}`}
							style={{
								backgroundImage: `url(${memoizedValues.bgImage})`,
								backgroundSize: 'cover',
								backgroundPosition: 'center',
						boxShadow: 'inset 0px 0px 60px 20px rgba(24, 22, 36, 0.6)',
							}}
						>
							<Stack className={'container'}>
								<strong>{t(memoizedValues.title)}</strong>
								<span>{t(memoizedValues.desc)}</span>
							</Stack>
						</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						<Chat />

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		}
	};
};

export default withLayoutBasic;
