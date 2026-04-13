import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, withRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { getJwtToken, logOut, updateUserInfo } from '../auth';
import { Stack, Box, Drawer, List, ListItem, ListItemButton, ListItemText, Divider } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { alpha, styled } from '@mui/material/styles';
import Menu, { MenuProps } from '@mui/material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { CaretDown } from 'phosphor-react';
import useDeviceDetect from '../hooks/useDeviceDetect';
import Link from 'next/link';
import { useReactiveVar, useQuery } from '@apollo/client';
import { userVar, cartVar } from '../../apollo/store';
import { Logout } from '@mui/icons-material';
import { REACT_APP_API_URL } from '../config';
import { ProductCategory, ProductSubCategory } from '../enums/product.enum';
import { GET_PRODUCTS, GET_SELLERS } from '../../apollo/user/query';
import { Product } from '../types/product/product';
import { Member } from '../types/member/member';

const categories = [
	{ tKey: 'cat.skincare', value: ProductCategory.SKINCARE },
	{ tKey: 'cat.makeup', value: ProductCategory.MAKEUP },
	{ tKey: 'cat.haircare', value: ProductCategory.HAIRCARE },
	{ tKey: 'cat.bodycare', value: ProductCategory.BODYCARE },
	{ tKey: 'cat.fragrance', value: ProductCategory.FRAGRANCE },
	{ tKey: 'cat.wellness', value: ProductCategory.WELLNESS },
];

interface SubCatItem { tKey: string; value: ProductSubCategory }

const MEGA_MENU_DATA: Record<string, { cols: SubCatItem[][]; taglineKey: string }> = {
	[ProductCategory.SKINCARE]: {
		cols: [
			[
				{ tKey: 'sub.cleansers', value: ProductSubCategory.CLEANSERS },
				{ tKey: 'sub.toners', value: ProductSubCategory.TONERS },
				{ tKey: 'sub.serums', value: ProductSubCategory.SERUMS },
			],
			[
				{ tKey: 'sub.moisturisers', value: ProductSubCategory.MOISTURISERS },
				{ tKey: 'sub.sunscreen', value: ProductSubCategory.SUNSCREEN },
				{ tKey: 'sub.eyeCare', value: ProductSubCategory.EYE_CARE },
			],
			[
				{ tKey: 'sub.faceMasks', value: ProductSubCategory.FACE_MASKS },
				{ tKey: 'sub.acneTreatments', value: ProductSubCategory.ACNE_TREATMENTS },
			],
		],
		taglineKey: 'cat.skincareTagline',
	},
	[ProductCategory.MAKEUP]: {
		cols: [
			[
				{ tKey: 'sub.foundation', value: ProductSubCategory.FOUNDATION },
				{ tKey: 'sub.concealer', value: ProductSubCategory.CONCEALER },
				{ tKey: 'sub.primer', value: ProductSubCategory.PRIMER },
			],
			[
				{ tKey: 'sub.powder', value: ProductSubCategory.POWDER },
				{ tKey: 'sub.blushBronzer', value: ProductSubCategory.BLUSH_BRONZER },
				{ tKey: 'sub.lipMakeup', value: ProductSubCategory.LIP_MAKEUP },
			],
			[
				{ tKey: 'sub.eyeMakeup', value: ProductSubCategory.EYE_MAKEUP },
				{ tKey: 'sub.brows', value: ProductSubCategory.BROWS },
				{ tKey: 'sub.settingProducts', value: ProductSubCategory.SETTING_PRODUCTS },
			],
		],
		taglineKey: 'cat.makeupTagline',
	},
	[ProductCategory.HAIRCARE]: {
		cols: [
			[
				{ tKey: 'sub.shampoo', value: ProductSubCategory.SHAMPOO },
				{ tKey: 'sub.conditioner', value: ProductSubCategory.CONDITIONER },
			],
			[
				{ tKey: 'sub.hairTreatments', value: ProductSubCategory.HAIR_TREATMENTS },
				{ tKey: 'sub.scalpCare', value: ProductSubCategory.SCALP_CARE },
			],
			[
				{ tKey: 'sub.hairOilsSerums', value: ProductSubCategory.HAIR_OILS_SERUMS },
				{ tKey: 'sub.styling', value: ProductSubCategory.STYLING },
			],
		],
		taglineKey: 'cat.haircareTagline',
	},
	[ProductCategory.BODYCARE]: {
		cols: [
			[
				{ tKey: 'sub.bodyWash', value: ProductSubCategory.BODY_WASH },
				{ tKey: 'sub.bodyLotion', value: ProductSubCategory.BODY_LOTION },
				{ tKey: 'sub.bodyCreamButter', value: ProductSubCategory.BODY_CREAM_BUTTER },
			],
			[
				{ tKey: 'sub.bodyScrubs', value: ProductSubCategory.BODY_SCRUBS },
				{ tKey: 'sub.handCare', value: ProductSubCategory.HAND_CARE },
				{ tKey: 'sub.footCare', value: ProductSubCategory.FOOT_CARE },
			],
			[
				{ tKey: 'sub.deodorant', value: ProductSubCategory.DEODORANT },
				{ tKey: 'sub.bodySunscreen', value: ProductSubCategory.BODY_SUNSCREEN },
			],
		],
		taglineKey: 'cat.bodycareTagline',
	},
	[ProductCategory.FRAGRANCE]: {
		cols: [
			[
				{ tKey: 'sub.perfume', value: ProductSubCategory.PERFUME },
				{ tKey: 'sub.men', value: ProductSubCategory.MEN },
			],
			[
				{ tKey: 'sub.women', value: ProductSubCategory.WOMEN },
				{ tKey: 'sub.bodyMist', value: ProductSubCategory.BODY_MIST },
			],
			[
				{ tKey: 'sub.homeFragrance', value: ProductSubCategory.HOME_FRAGRANCE },
			],
		],
		taglineKey: 'cat.fragranceTagline',
	},
	[ProductCategory.WELLNESS]: {
		cols: [
			[
				{ tKey: 'sub.collagen', value: ProductSubCategory.COLLAGEN },
				{ tKey: 'sub.vitamins', value: ProductSubCategory.VITAMINS },
			],
			[
				{ tKey: 'sub.gutHealth', value: ProductSubCategory.GUT_HEALTH },
				{ tKey: 'sub.immunity', value: ProductSubCategory.IMMUNITY },
			],
			[
				{ tKey: 'sub.sleepStressSupport', value: ProductSubCategory.SLEEP_STRESS_SUPPORT },
				{ tKey: 'sub.tools', value: ProductSubCategory.TOOLS },
			],
		],
		taglineKey: 'cat.wellnessTagline',
	},
};


const Top = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const cartItems = useReactiveVar(cartVar);
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
	const [activeCategory, setActiveCategory] = useState<string | null>(null);
	const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

	const { data: featuredData } = useQuery(GET_PRODUCTS, {
		fetchPolicy: 'cache-first',
		variables: {
			input: {
				page: 1,
				limit: 3,
				sort: 'productRank',
				direction: 'DESC',
				search: { categoryList: activeCategory && activeCategory !== 'brands' ? [activeCategory as ProductCategory] : [] },
			},
		},
		skip: !activeCategory || activeCategory === 'brands',
	});
	const featuredProducts: Product[] = featuredData?.getProducts?.list ?? [];

	const { data: sellersData } = useQuery(GET_SELLERS, {
		fetchPolicy: 'cache-first',
		variables: { input: { page: 1, limit: 10, sort: 'memberRank', direction: 'DESC', search: {} } },
	});
	const sellers: Member[] = sellersData?.getSellers?.list ?? [];
	const [csOpen, setCsOpen] = useState(false);
	const csTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
	const [drawerOpen, setDrawerOpen] = useState(false);

	const handleCsEnter = () => {
		if (csTimeout.current) clearTimeout(csTimeout.current);
		setCsOpen(true);
	};
	const handleCsLeave = () => {
		csTimeout.current = setTimeout(() => setCsOpen(false), 120);
	};

	const handleCatEnter = (catValue: string) => {
		if (hideTimeout.current) clearTimeout(hideTimeout.current);
		setActiveCategory(catValue);
	};
	const handleCatLeave = () => {
		hideTimeout.current = setTimeout(() => setActiveCategory(null), 120);
	};
	const handlePanelEnter = () => {
		if (hideTimeout.current) clearTimeout(hideTimeout.current);
	};
	const handlePanelLeave = () => {
		hideTimeout.current = setTimeout(() => setActiveCategory(null), 120);
	};

	/** LIFECYCLES **/
	useEffect(() => {
		// try-catch: localStorage throws SecurityError when browser blocks storage access
		// (sayt tili 'locale' keyida saqlanadi, xato bo'lsa default 'en' ishlatiladi)
		try {
			if (localStorage.getItem('locale') === null) {
				localStorage.setItem('locale', 'en');
				setLang('en');
			} else {
				setLang(localStorage.getItem('locale'));
			}
		} catch {}
	}, [router]);

	useEffect(() => {
		switch (router.pathname) {
			case '/product/detail':
				setBgColor(true);
				break;
			default:
				setBgColor(false);
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
			// try-catch: localStorage.setItem throws SecurityError when browser blocks storage access
			try { localStorage.setItem('locale', e.target.id); } catch {}
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
				const input = { page: 1, limit: 9, sort: 'createdAt', direction: 'DESC', search: { text: searchQuery.trim() } };
				router.push(`/product?input=${encodeURIComponent(JSON.stringify(input))}`);
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

	useEffect(() => {
		window.addEventListener('scroll', changeNavbarColor);
		return () => window.removeEventListener('scroll', changeNavbarColor);
	}, []);

	if (device == 'mobile') {
		const navLinks = [
			{ label: 'Home', href: '/' },
			{ label: 'Skincare', href: '/product?input=%7B%22page%22%3A1%2C%22limit%22%3A9%2C%22sort%22%3A%22createdAt%22%2C%22direction%22%3A%22DESC%22%2C%22search%22%3A%7B%22categoryList%22%3A%5B%22SKINCARE%22%5D%7D%7D' },
			{ label: 'Makeup', href: '/product?input=%7B%22page%22%3A1%2C%22limit%22%3A9%2C%22sort%22%3A%22createdAt%22%2C%22direction%22%3A%22DESC%22%2C%22search%22%3A%7B%22categoryList%22%3A%5B%22MAKEUP%22%5D%7D%7D' },
			{ label: 'Haircare', href: '/product?input=%7B%22page%22%3A1%2C%22limit%22%3A9%2C%22sort%22%3A%22createdAt%22%2C%22direction%22%3A%22DESC%22%2C%22search%22%3A%7B%22categoryList%22%3A%5B%22HAIRCARE%22%5D%7D%7D' },
			{ label: 'Bodycare', href: '/product?input=%7B%22page%22%3A1%2C%22limit%22%3A9%2C%22sort%22%3A%22createdAt%22%2C%22direction%22%3A%22DESC%22%2C%22search%22%3A%7B%22categoryList%22%3A%5B%22BODYCARE%22%5D%7D%7D' },
			{ label: 'Fragrance', href: '/product?input=%7B%22page%22%3A1%2C%22limit%22%3A9%2C%22sort%22%3A%22createdAt%22%2C%22direction%22%3A%22DESC%22%2C%22search%22%3A%7B%22categoryList%22%3A%5B%22FRAGRANCE%22%5D%7D%7D' },
			{ label: 'Wellness', href: '/product?input=%7B%22page%22%3A1%2C%22limit%22%3A9%2C%22sort%22%3A%22createdAt%22%2C%22direction%22%3A%22DESC%22%2C%22search%22%3A%7B%22categoryList%22%3A%5B%22WELLNESS%22%5D%7D%7D' },
			{ label: 'Community', href: '/community' },
			{ label: 'Customer Service', href: '/cs' },
		];

		return (
			<>
				<Stack className={'mob-navbar'}>
					<Box component={'div'} className={'mob-nav-left'}>
						<MenuIcon className={'mob-nav-icon'} onClick={() => setDrawerOpen(true)} />
					</Box>
					<Link href={'/'}>
						<img src="/img/logo/logoText.svg" alt="Korvera" className={'mob-logo'} />
					</Link>
					<Box component={'div'} className={'mob-nav-actions'}>
						<SearchIcon
							className={'mob-nav-icon'}
							onClick={() => {
								const input = { page: 1, limit: 9, sort: 'createdAt', direction: 'DESC', search: {} };
								router.push(`/product?input=${encodeURIComponent(JSON.stringify(input))}`);
							}}
						/>
						<Box component={'div'} className={'mob-cart-wrap'}>
							<Link href={'/cart'}>
								<ShoppingBagOutlinedIcon className={'mob-nav-icon'} />
								{cartItems.length > 0 && (
									<span className={'mob-cart-badge'}>{cartItems.length}</span>
								)}
							</Link>
						</Box>
						{user?._id ? (
							<Link href={'/mypage'}>
								<img
									src={user?.memberImage ? `${REACT_APP_API_URL}/${user?.memberImage}` : '/img/profile/defaultUser.svg'}
									alt=""
									className={'mob-user-avatar'}
								/>
							</Link>
						) : (
							<Link href={'/account/join'}>
								<PersonOutlineIcon className={'mob-nav-icon'} />
							</Link>
						)}
					</Box>
				</Stack>

				<Drawer anchor={'left'} open={drawerOpen} onClose={() => setDrawerOpen(false)}>
					<Box className={'mob-drawer'} component={'div'}>
						<Stack className={'mob-drawer-header'}>
							<img src="/img/logo/logoText.svg" alt="Korvera" className={'mob-drawer-logo'} />
							<CloseIcon className={'mob-drawer-close'} onClick={() => setDrawerOpen(false)} />
						</Stack>
						<Divider />
						<List className={'mob-drawer-list'}>
							{navLinks.map((link) => (
								<ListItem key={link.label} disablePadding>
									<ListItemButton
										className={`mob-drawer-item${router.pathname === '/' && link.href === '/' ? ' active' : ''}`}
										onClick={() => {
											router.push(link.href);
											setDrawerOpen(false);
										}}
									>
										<ListItemText primary={link.label} />
									</ListItemButton>
								</ListItem>
							))}
						</List>
						<Divider />
						{/* Language selector */}
						<Box component={'div'} className={'mob-drawer-lang'}>
							<span className={'mob-drawer-lang-label'}>Language</span>
							<Box component={'div'} className={'mob-drawer-lang-options'}>
								{[
									{ id: 'en', src: '/img/flag/langen.png', label: 'EN' },
									{ id: 'kr', src: '/img/flag/langkr.png', label: 'KR' },
									{ id: 'ru', src: '/img/flag/langru.png', label: 'RU' },
								].map((l) => (
									<button
										key={l.id}
										className={`mob-drawer-lang-btn${lang === l.id ? ' active' : ''}`}
										onClick={() => {
											// try-catch: localStorage.setItem throws SecurityError when browser blocks storage access
											try { localStorage.setItem('locale', l.id); } catch {}
											router.push(router.asPath, router.asPath, { locale: l.id });
											setLang(l.id);
											setDrawerOpen(false);
										}}
									>
										<img src={l.src} alt={l.id} className={'mob-drawer-lang-flag'} />
										{l.label}
									</button>
								))}
							</Box>
						</Box>
						<Divider />
						{user?._id ? (
							<Box component={'div'} className={'mob-drawer-footer'}>
								<Stack className={'mob-drawer-user'}>
									<img
										src={user?.memberImage ? `${REACT_APP_API_URL}/${user?.memberImage}` : '/img/profile/defaultUser.svg'}
										alt=""
										className={'mob-drawer-avatar'}
									/>
									<Stack>
										<span className={'mob-drawer-nick'}>{user?.memberNick}</span>
										<span className={'mob-drawer-type'}>{user?.memberType}</span>
									</Stack>
								</Stack>
								<Button
									className={'mob-drawer-logout-btn'}
									startIcon={<Logout sx={{ fontSize: 16 }} />}
									onClick={() => { logOut(); setDrawerOpen(false); }}
								>
									Logout
								</Button>
							</Box>
						) : (
							<Box component={'div'} className={'mob-drawer-footer'}>
								<Button
									variant={'contained'}
									className={'mob-drawer-login-btn'}
									onClick={() => { router.push('/account/join'); setDrawerOpen(false); }}
								>
									Sign In / Register
								</Button>
							</Box>
						)}
					</Box>
				</Drawer>
			</>
		);
	} else {
		return (
			<Stack className={'navbar'}>
				{/* Layer 1: Main Navbar */}
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
								<span>{t('nav.aiBeauty')}</span>
							</Box>
							<Link href={'/'}><span className={'nav-text-link'}>{t('nav.home')}</span></Link>
					<Link href={'/community?articleCategory=FREE'}><span className={'nav-text-link'}>{t('nav.community')}</span></Link>
							<Box component={'div'} className={'cs-dropdown-wrap'}
								onMouseEnter={handleCsEnter}
								onMouseLeave={handleCsLeave}
							>
								<Link href={'/cs'}><span className={'nav-text-link'}>{t('nav.customerService')}</span></Link>
								<Box component={'div'} className={`cs-dropdown-card${csOpen ? ' is-open' : ''}`}
									onMouseEnter={handleCsEnter}
									onMouseLeave={handleCsLeave}
								>
									<Box component={'div'} className={'cs-col'}>
										<span className={'cs-heading'}>{t('nav.csHelp')}</span>
										<Link href={'/cs?tab=faq'}><span className={'cs-item'}>{t('nav.csFaq')}</span></Link>
										<Link href={'/cs?tab=faq'}><span className={'cs-item'}>{t('nav.csTrackOrder')}</span></Link>
										<Link href={'/cs?tab=faq'}><span className={'cs-item'}>{t('nav.csShipping')}</span></Link>
									</Box>
									<Box component={'div'} className={'cs-col'}>
										<span className={'cs-heading'}>{t('nav.csContact')}</span>
										<Link href={'/cs'}>
											<button className={'cs-chat-btn'}>{t('nav.csChat')}</button>
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
										<img className="img-flag" src={'/img/flag/langkr.png'} onClick={langChoice} id="kr" alt={'koreanFlag'} />
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
									<span className={'nav-text-link'}>{t('nav.signIn')}</span>
								</Link>
							)}

							<Link href={'/mypage'}>
								<span className={'nav-text-link'}>{t('nav.wishlist')}</span>
							</Link>

							<Link href={'/cart'}>
							<span className={'nav-text-link'}>{t('nav.myCart')}</span>
						</Link>
						</Box>
					</Stack>
				</Stack>

				{/* Layer 3: Category Navigation — Aesop: categories centered + search right */}
				<Stack className={'navbar-categories'}>
					<Stack className={'container'}>
						<Box component={'div'} className={'categories-list'}>
							{categories.map((cat) => (
								<div key={cat.value} className={'cat-mega-wrap'}
									onMouseEnter={() => handleCatEnter(cat.value)}
									onMouseLeave={handleCatLeave}
								>
									<Link href={`/product?input=${encodeURIComponent(JSON.stringify({ page: 1, limit: 9, sort: 'createdAt', direction: 'DESC', search: { categoryList: [cat.value] } }))}`}>
										<span className={'cat-link'}>{t(cat.tKey)}</span>
									</Link>
									<div
										className={`cat-mega-panel${activeCategory === cat.value ? ' is-active' : ''}`}
										onMouseEnter={handlePanelEnter}
										onMouseLeave={handlePanelLeave}
									>
										<div className={'cat-mega-cols'}>
											{MEGA_MENU_DATA[cat.value]?.cols.map((col, ci) => (
												<div key={ci} className={'cat-mega-col'}>
													{col.map((item) => {
														const href = `/product?input=${encodeURIComponent(JSON.stringify({ page: 1, limit: 9, sort: 'createdAt', direction: 'DESC', search: { categoryList: [cat.value], subCategoryList: [item.value] } }))}`;
														return (
															<Link key={item.value} href={href}>
																<span className={'cat-mega-item'}>{t(item.tKey)}</span>
															</Link>
														);
													})}
												</div>
											))}
										</div>
										<div className={'cat-mega-featured'}>
											<span className={'cat-mega-tagline'}>{t(MEGA_MENU_DATA[cat.value]?.taglineKey ?? '')}</span>
											<div className={'cat-mega-products'}>
												{featuredProducts.length > 0
													? featuredProducts.map((p: Product) => {
															const img = p.productImages?.[0]
																? p.productImages[0].startsWith('/')
																	? p.productImages[0]
																	: `${REACT_APP_API_URL}/${p.productImages[0]}`
																: '';
															return (
																<Link key={p._id} href={`/product/detail?id=${p._id}`} className={'mega-product-card'}>
																	<img src={img} alt={p.productTitle} className={'mega-product-img'} />
																	<span className={'mega-product-title'}>{p.productTitle}</span>
																	<span className={'mega-product-price'}>${p.productPrice}</span>
																</Link>
															);
													  })
													: null}
											</div>
										</div>
									</div>
								</div>
							))}
							<div className={'cat-mega-wrap'}
								onMouseEnter={() => handleCatEnter('brands')}
								onMouseLeave={handleCatLeave}
							>
								<Link href={'/seller'}>
									<span className={'cat-link'}>{t('nav.brands')}</span>
								</Link>
								<div
									className={`cat-mega-panel cat-mega-panel--brands${activeCategory === 'brands' ? ' is-active' : ''}`}
									onMouseEnter={handlePanelEnter}
									onMouseLeave={handlePanelLeave}
								>
									<div className={'brands-grid'}>
										{sellers.map((seller: Member) => {
											const avatar = seller.memberImage
												? seller.memberImage.startsWith('/')
													? seller.memberImage
													: `${REACT_APP_API_URL}/${seller.memberImage}`
												: '/img/profile/defaultUser.svg';
											return (
												<Link key={seller._id} href={`/seller/detail?agentId=${seller._id}`}>
													<div className={'brand-card'}>
														<img src={avatar} alt={seller.memberNick} className={'brand-avatar'} />
														<span className={'brand-name'}>{seller.memberNick}</span>
														<span className={'brand-tagline'}>{seller.memberProducts ?? 0} products</span>
													</div>
												</Link>
											);
										})}
									</div>
								</div>
							</div>
						</Box>
						<Box component={'div'} className={'cat-search'}>
							<SearchIcon className={'cat-search-icon'} />
							<input
								type="text"
								placeholder={t('nav.search')}
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
