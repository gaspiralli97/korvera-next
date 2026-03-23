import React, { useCallback, useEffect, useState } from 'react';
import { useRouter, withRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { getJwtToken, logOut, updateUserInfo } from '../auth';
import { Stack, Box } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { alpha, styled } from '@mui/material/styles';
import Menu, { MenuProps } from '@mui/material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { CaretDown } from 'phosphor-react';
import useDeviceDetect from '../hooks/useDeviceDetect';
import Link from 'next/link';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { Logout } from '@mui/icons-material';
import { REACT_APP_API_URL } from '../config';
import { ProductCategory } from '../enums/product.enum';

const categories = [
	{ label: 'Skincare', value: ProductCategory.SKINCARE },
	{ label: 'Makeup', value: ProductCategory.MAKEUP },
	{ label: 'Haircare', value: ProductCategory.HAIRCARE },
	{ label: 'Bodycare', value: ProductCategory.BODYCARE },
	{ label: 'Fragrance', value: ProductCategory.FRAGRANCE },
	{ label: 'Wellness', value: ProductCategory.WELLNESS },
];

const Top = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const { t, i18n } = useTranslation('common');
	const router = useRouter();
	const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
	const [lang, setLang] = useState<string | null>('en');
	const drop = Boolean(anchorEl2);
	const [colorChange, setColorChange] = useState(false);
	const [anchorEl, setAnchorEl] = React.useState<any | HTMLElement>(null);
	let open = Boolean(anchorEl);
	const [bgColor, setBgColor] = useState<boolean>(false);
	const [logoutAnchor, setLogoutAnchor] = React.useState<null | HTMLElement>(null);
	const logoutOpen = Boolean(logoutAnchor);
	const [searchQuery, setSearchQuery] = useState<string>('');

	/** LIFECYCLES **/
	useEffect(() => {
		if (localStorage.getItem('locale') === null) {
			localStorage.setItem('locale', 'en');
			setLang('en');
		} else {
			setLang(localStorage.getItem('locale'));
		}
	}, [router]);

	useEffect(() => {
		switch (router.pathname) {
			case '/product/detail':
				setBgColor(true);
				break;
			default:
				break;
		}
	}, [router]);

	useEffect(() => {
		const jwt = getJwtToken();
		if (jwt) updateUserInfo(jwt);
	}, []);

	/** HANDLERS **/
	const langClick = (e: any) => {
		setAnchorEl2(e.currentTarget);
	};

	const langClose = () => {
		setAnchorEl2(null);
	};

	const langChoice = useCallback(
		async (e: any) => {
			setLang(e.target.id);
			localStorage.setItem('locale', e.target.id);
			setAnchorEl2(null);
			await router.push(router.asPath, router.asPath, { locale: e.target.id });
		},
		[router],
	);

	const changeNavbarColor = () => {
		if (window.scrollY >= 50) {
			setColorChange(true);
		} else {
			setColorChange(false);
		}
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleHover = (event: any) => {
		if (anchorEl !== event.currentTarget) {
			setAnchorEl(event.currentTarget);
		} else {
			setAnchorEl(null);
		}
	};

	const handleSearch = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === 'Enter' && searchQuery.trim()) {
				router.push({ pathname: '/product', query: { search: searchQuery.trim() } });
			}
		},
		[router, searchQuery],
	);

	const StyledMenu = styled((props: MenuProps) => (
		<Menu
			elevation={0}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'right',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			{...props}
		/>
	))(({ theme }) => ({
		'& .MuiPaper-root': {
			borderRadius: 6,
			marginTop: theme.spacing(1),
			minWidth: 160,
			color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
			boxShadow:
				'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
			'& .MuiMenu-list': {
				padding: '4px 0',
			},
			'& .MuiMenuItem-root': {
				'& .MuiSvgIcon-root': {
					fontSize: 18,
					color: theme.palette.text.secondary,
					marginRight: theme.spacing(1.5),
				},
				'&:active': {
					backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
				},
			},
		},
	}));

	if (typeof window !== 'undefined') {
		window.addEventListener('scroll', changeNavbarColor);
	}

	if (device == 'mobile') {
		return (
			<Stack className={'top'}>
				<Link href={'/'}>
					<div>{t('Home')}</div>
				</Link>
				<Link href={'/product'}>
					<div>{t('Products')}</div>
				</Link>
				<Link href={'/agent'}>
					<div>{t('Agents')}</div>
				</Link>
				<Link href={'/community?articleCategory=FREE'}>
					<div>{t('Community')}</div>
				</Link>
				<Link href={'/cs'}>
					<div>{t('CS')}</div>
				</Link>
			</Stack>
		);
	} else {
		return (
			<Stack className={'navbar'}>
				{/* Layer 1: Top Bar */}
				<Stack className={'navbar-top'}>
					<Stack className={'container'}>
						<span className={'navbar-promo'}>Enjoy complimentary shipping on all orders over $50</span>
					</Stack>
				</Stack>

				{/* Layer 2: Main Navbar — Aesop: 3-column, text only, no icons */}
				<Stack className={`navbar-main ${colorChange ? 'transparent' : ''} ${bgColor ? 'transparent' : ''}`}>
					<Stack className={'container'}>
						{/* Left — text links */}
						<Box component={'div'} className={'navbar-main-left'}>
							<Box
								component={'div'}
								className={'ai-chat-btn'}
								onClick={() => {
									const btn = document.querySelector<HTMLButtonElement>('.chat-button');
									if (btn) btn.click();
								}}
							>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" className={'ai-chat-icon'}>
									<circle cx="10" cy="10" r="9" fill="#2C2C2C"/>
									<circle cx="7" cy="10.5" r="1" fill="#C9A96E"/>
									<circle cx="10" cy="10.5" r="1" fill="#C9A96E"/>
									<circle cx="13" cy="10.5" r="1" fill="#C9A96E"/>
									<path d="M5 6.5h10a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H7l-2.5 2V7.5a1 1 0 0 1 1-1z" stroke="#F5F2EC" strokeWidth="0.8" fill="none"/>
								</svg>
								<span>AI Beauty</span>
							</Box>
							<Link href={'/'}><span className={'nav-text-link'}>Home</span></Link>
							<Box component={'div'} className={'cs-dropdown-wrap'}>
								<Link href={'/cs'}><span className={'nav-text-link'}>Customer service</span></Link>
								<Box component={'div'} className={'cs-dropdown-card'}>
									<Box component={'div'} className={'cs-col'}>
										<span className={'cs-heading'}>How can we help?</span>
										<Link href={'/cs?tab=faq'}><span className={'cs-item'}>FAQs</span></Link>
										<Link href={'/cs?tab=faq'}><span className={'cs-item'}>Track your order</span></Link>
										<Link href={'/cs?tab=faq'}><span className={'cs-item'}>Shipping &amp; Returns</span></Link>
									</Box>
									<Box component={'div'} className={'cs-col'}>
										<span className={'cs-heading'}>Contact us</span>
										<Link href={'/cs'}>
											<button className={'cs-chat-btn'}>Chat with Us</button>
										</Link>
									</Box>
								</Box>
							</Box>
						</Box>

						{/* Center — logo */}
						<Box component={'div'} className={'logo-box'}>
							<Link href={'/'}>
								<img src="/img/logo/logoWhite.svg" alt="Korvera" />
							</Link>
						</Box>

						{/* Right — text links */}
						<Box component={'div'} className={'navbar-main-right'}>
							{/* Language */}
							<Box component={'div'} className={'navbar-top-lang'}>
								<Button
									disableRipple
									className="btn-lang"
									onClick={langClick}
									endIcon={<CaretDown size={10} color="#1B1B1B" weight="fill" />}
								>
									<Box component={'div'} className={'flag'}>
										{lang !== null ? (
											<img src={`/img/flag/lang${lang}.png`} alt={'flag'} />
										) : (
											<img src={`/img/flag/langen.png`} alt={'flag'} />
										)}
									</Box>
								</Button>
								<StyledMenu anchorEl={anchorEl2} open={drop} onClose={langClose} sx={{ position: 'absolute' }}>
									<MenuItem disableRipple onClick={langChoice} id="en">
										<img className="img-flag" src={'/img/flag/langen.png'} onClick={langChoice} id="en" alt={'usaFlag'} />
										English
									</MenuItem>
									<MenuItem disableRipple onClick={langChoice} id="kr">
										<img className="img-flag" src={'/img/flag/langkr.png'} onClick={langChoice} id="uz" alt={'koreanFlag'} />
										Korean
									</MenuItem>
									<MenuItem disableRipple onClick={langChoice} id="ru">
										<img className="img-flag" src={'/img/flag/langru.png'} onClick={langChoice} id="ru" alt={'russiaFlag'} />
										Russian
									</MenuItem>
								</StyledMenu>
							</Box>

							{/* Account */}
							{user?._id ? (
								<>
									<div className={'login-user'} onClick={(event: any) => setLogoutAnchor(event.currentTarget)}>
										<img
											src={
												user?.memberImage
													? `${REACT_APP_API_URL}/${user?.memberImage}`
													: '/img/profile/defaultUser.svg'
											}
											alt=""
										/>
									</div>
									<Menu
										id="basic-menu"
										anchorEl={logoutAnchor}
										open={logoutOpen}
										onClose={() => setLogoutAnchor(null)}
										sx={{ mt: '5px' }}
									>
										<MenuItem onClick={() => logOut()}>
											<Logout fontSize="small" style={{ color: '#75162D', marginRight: '10px' }} />
											Logout
										</MenuItem>
									</Menu>
								</>
							) : (
								<Link href={'/account/join'}>
									<span className={'nav-text-link'}>Sign in</span>
								</Link>
							)}

							<Link href={'/mypage'}>
								<span className={'nav-text-link'}>Wishlist</span>
							</Link>

							<span className={'nav-text-link'}>My cart</span>
						</Box>
					</Stack>
				</Stack>

				{/* Layer 3: Category Navigation — Aesop: categories centered + search right */}
				<Stack className={'navbar-categories'}>
					<Stack className={'container'}>
						<Box component={'div'} className={'categories-list'}>
							{categories.map((cat) => (
								<Link key={cat.value} href={`/product?productCategory=${cat.value}`}>
									<span className={'cat-link'}>{cat.label}</span>
								</Link>
							))}
							<Link href={'/agent'}>
								<span className={'cat-link'}>Brands</span>
							</Link>
						</Box>
						<Box component={'div'} className={'cat-search'}>
							<SearchIcon className={'cat-search-icon'} />
							<input
								type="text"
								placeholder={'Search...'}
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								onKeyDown={handleSearch}
							/>
						</Box>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default withRouter(Top);
