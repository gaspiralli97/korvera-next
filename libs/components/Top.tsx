import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import { useReactiveVar, useQuery } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { Logout } from '@mui/icons-material';
import { REACT_APP_API_URL } from '../config';
import { ProductCategory, ProductSubCategory } from '../enums/product.enum';
import { GET_PRODUCTS, GET_SELLERS } from '../../apollo/user/query';
import { Product } from '../types/product/product';
import { Member } from '../types/member/member';

const categories = [
	{ label: 'Skincare', value: ProductCategory.SKINCARE },
	{ label: 'Makeup', value: ProductCategory.MAKEUP },
	{ label: 'Haircare', value: ProductCategory.HAIRCARE },
	{ label: 'Bodycare', value: ProductCategory.BODYCARE },
	{ label: 'Fragrance', value: ProductCategory.FRAGRANCE },
	{ label: 'Wellness', value: ProductCategory.WELLNESS },
];

interface SubCatItem { label: string; value: ProductSubCategory }

const MEGA_MENU_DATA: Record<string, { cols: SubCatItem[][]; tagline: string }> = {
	[ProductCategory.SKINCARE]: {
		cols: [
			[
				{ label: 'Cleansers', value: ProductSubCategory.CLEANSERS },
				{ label: 'Toners', value: ProductSubCategory.TONERS },
				{ label: 'Serums', value: ProductSubCategory.SERUMS },
			],
			[
				{ label: 'Moisturisers', value: ProductSubCategory.MOISTURISERS },
				{ label: 'Sunscreen', value: ProductSubCategory.SUNSCREEN },
				{ label: 'Eye Care', value: ProductSubCategory.EYE_CARE },
			],
			[
				{ label: 'Face Masks', value: ProductSubCategory.FACE_MASKS },
				{ label: 'Acne Treatments', value: ProductSubCategory.ACNE_TREATMENTS },
			],
		],
		tagline: 'Rituals for radiant skin',
	},
	[ProductCategory.MAKEUP]: {
		cols: [
			[
				{ label: 'Foundation', value: ProductSubCategory.FOUNDATION },
				{ label: 'Concealer', value: ProductSubCategory.CONCEALER },
				{ label: 'Primer', value: ProductSubCategory.PRIMER },
			],
			[
				{ label: 'Powder', value: ProductSubCategory.POWDER },
				{ label: 'Blush & Bronzer', value: ProductSubCategory.BLUSH_BRONZER },
				{ label: 'Lip Makeup', value: ProductSubCategory.LIP_MAKEUP },
			],
			[
				{ label: 'Eye Makeup', value: ProductSubCategory.EYE_MAKEUP },
				{ label: 'Brows', value: ProductSubCategory.BROWS },
				{ label: 'Setting Products', value: ProductSubCategory.SETTING_PRODUCTS },
			],
		],
		tagline: 'Colour, refined',
	},
	[ProductCategory.HAIRCARE]: {
		cols: [
			[
				{ label: 'Shampoo', value: ProductSubCategory.SHAMPOO },
				{ label: 'Conditioner', value: ProductSubCategory.CONDITIONER },
			],
			[
				{ label: 'Hair Treatments', value: ProductSubCategory.HAIR_TREATMENTS },
				{ label: 'Scalp Care', value: ProductSubCategory.SCALP_CARE },
			],
			[
				{ label: 'Hair Oils & Serums', value: ProductSubCategory.HAIR_OILS_SERUMS },
				{ label: 'Styling', value: ProductSubCategory.STYLING },
			],
		],
		tagline: 'Hair in its best form',
	},
	[ProductCategory.BODYCARE]: {
		cols: [
			[
				{ label: 'Body Wash', value: ProductSubCategory.BODY_WASH },
				{ label: 'Body Lotion', value: ProductSubCategory.BODY_LOTION },
				{ label: 'Body Cream & Butter', value: ProductSubCategory.BODY_CREAM_BUTTER },
			],
			[
				{ label: 'Body Scrubs', value: ProductSubCategory.BODY_SCRUBS },
				{ label: 'Hand Care', value: ProductSubCategory.HAND_CARE },
				{ label: 'Foot Care', value: ProductSubCategory.FOOT_CARE },
			],
			[
				{ label: 'Deodorant', value: ProductSubCategory.DEODORANT },
				{ label: 'Body Sunscreen', value: ProductSubCategory.BODY_SUNSCREEN },
			],
		],
		tagline: 'Care from head to toe',
	},
	[ProductCategory.FRAGRANCE]: {
		cols: [
			[
				{ label: 'Perfume', value: ProductSubCategory.PERFUME },
				{ label: 'Men', value: ProductSubCategory.MEN },
			],
			[
				{ label: 'Women', value: ProductSubCategory.WOMEN },
				{ label: 'Body Mist', value: ProductSubCategory.BODY_MIST },
			],
			[
				{ label: 'Home Fragrance', value: ProductSubCategory.HOME_FRAGRANCE },
			],
		],
		tagline: 'Scent as identity',
	},
	[ProductCategory.WELLNESS]: {
		cols: [
			[
				{ label: 'Collagen', value: ProductSubCategory.COLLAGEN },
				{ label: 'Vitamins', value: ProductSubCategory.VITAMINS },
			],
			[
				{ label: 'Gut Health', value: ProductSubCategory.GUT_HEALTH },
				{ label: 'Immunity', value: ProductSubCategory.IMMUNITY },
			],
			[
				{ label: 'Sleep & Stress Support', value: ProductSubCategory.SLEEP_STRESS_SUPPORT },
				{ label: 'Tools', value: ProductSubCategory.TOOLS },
			],
		],
		tagline: 'Beauty from within',
	},
};


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
		return (
			<Stack className={'top'}>
				<Link href={'/'}>
					<div>{t('Home')}</div>
				</Link>
				<Link href={'/product'}>
					<div>{t('Products')}</div>
				</Link>
				<Link href={'/seller'}>
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
								<span>AI Beauty</span>
							</Box>
							<Link href={'/'}><span className={'nav-text-link'}>Home</span></Link>
					<Link href={'/community?articleCategory=FREE'}><span className={'nav-text-link'}>Community</span></Link>
							<Box component={'div'} className={'cs-dropdown-wrap'}
								onMouseEnter={handleCsEnter}
								onMouseLeave={handleCsLeave}
							>
								<Link href={'/cs'}><span className={'nav-text-link'}>Customer service</span></Link>
								<Box component={'div'} className={`cs-dropdown-card${csOpen ? ' is-open' : ''}`}
									onMouseEnter={handleCsEnter}
									onMouseLeave={handleCsLeave}
								>
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

							<Link href={'/cart'}>
							<span className={'nav-text-link'}>My cart</span>
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
										<span className={'cat-link'}>{cat.label}</span>
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
																<span className={'cat-mega-item'}>{item.label}</span>
															</Link>
														);
													})}
												</div>
											))}
										</div>
										<div className={'cat-mega-featured'}>
											<span className={'cat-mega-tagline'}>{MEGA_MENU_DATA[cat.value]?.tagline ?? ''}</span>
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
									<span className={'cat-link'}>Brands</span>
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
