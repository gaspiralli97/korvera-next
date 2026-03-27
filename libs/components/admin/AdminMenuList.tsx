import React, { useEffect, useState } from 'react';
import { useRouter, withRouter } from 'next/router';
import Link from 'next/link';
import { Divider, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {
	ArrowCounterClockwise,
	CalendarBlank,
	ChartLine,
	ChatsCircle,
	FileText,
	Gear,
	Headset,
	Image,
	Money,
	Package,
	ShoppingBag,
	SquaresFour,
	Star,
	Storefront,
	Tag,
	User,
} from 'phosphor-react';
import cookies from 'js-cookie';

const SECTION_LABEL_STYLE = {
	px: '20px',
	pt: '16px',
	pb: '4px',
	fontSize: '10px',
	fontWeight: 700,
	color: '#bdbdbd',
	letterSpacing: '1.2px',
	textTransform: 'uppercase' as const,
};

const AdminMenuList = (props: any) => {
	const router = useRouter();
	const [openMenu] = useState(typeof window === 'object' ? cookies.get('admin_menu') === 'true' : false);
	const [clickMenu, setClickMenu] = useState<any>([]);
	const [clickSubMenu, setClickSubMenu] = useState('');

	const {
		router: { pathname },
	} = props;

	const pathnames = pathname.split('/').filter((x: any) => x);

	/** LIFECYCLES **/
	useEffect(() => {
		switch (pathnames[1]) {
			case 'users': setClickMenu(['Users']); break;
			case 'products': setClickMenu(['Products']); break;
			case 'orders': setClickMenu(['Orders']); break;
			case 'brands': setClickMenu(['Brands']); break;
			case 'reviews': setClickMenu(['Reviews']); break;
			case 'returns': setClickMenu(['Returns']); break;
			case 'coupons': setClickMenu(['Coupons']); break;
			case 'payouts': setClickMenu(['Payouts']); break;
			case 'banners': setClickMenu(['Banners']); break;
			case 'events': setClickMenu(['Events']); break;
			case 'community': setClickMenu(['Community']); break;
			case 'cs': setClickMenu(['Cs']); break;
			case 'analytics': setClickMenu(['Analytics']); break;
			case 'reports': setClickMenu(['Reports']); break;
			case 'settings': setClickMenu(['Settings']); break;
			default: setClickMenu(['Dashboard']); break;
		}

		switch (pathnames[2]) {
			case 'inquiry': setClickSubMenu('1:1 Inquiry'); break;
			case 'notice': setClickSubMenu('Notice'); break;
			case 'faq': setClickSubMenu('FAQ'); break;
			default: setClickSubMenu('List'); break;
		}
	}, []);

	/** HANDLERS **/
	const subMenuChangeHandler = (target: string) => {
		if (clickMenu.find((item: string) => item === target)) {
			setClickMenu(clickMenu.filter((menu: string) => target !== menu));
		} else {
			setClickMenu([...clickMenu, target]);
		}
	};

	const sub_menu_set: any = {
		Users: [{ title: 'List', url: '/_admin/users' }],
		Products: [{ title: 'List', url: '/_admin/products' }],
		Community: [{ title: 'List', url: '/_admin/community' }],
		Cs: [
			{ title: 'FAQ', url: '/_admin/cs/faq' },
			{ title: 'Notice', url: '/_admin/cs/notice' },
			{ title: '1:1 Inquiry', url: '/_admin/cs/inquiry' },
		],
	};

	// Menu groups with section labels
	const menu_groups = [
		{
			label: 'Overview',
			items: [
				{ title: 'Dashboard', icon: <SquaresFour size={18} color="#bdbdbd" weight="fill" />, direct: true, on_click: () => router.push('/_admin') },
				{ title: 'Analytics', icon: <ChartLine size={18} color="#bdbdbd" weight="fill" />, direct: true, on_click: () => router.push('/_admin/analytics') },
			],
		},
		{
			label: 'Catalog',
			items: [
				{ title: 'Users', icon: <User size={18} color="#bdbdbd" weight="fill" />, on_click: () => subMenuChangeHandler('Users') },
				{ title: 'Products', icon: <Package size={18} color="#bdbdbd" weight="fill" />, on_click: () => subMenuChangeHandler('Products') },
				{ title: 'Brands', icon: <Storefront size={18} color="#bdbdbd" weight="fill" />, direct: true, on_click: () => router.push('/_admin/brands') },
				{ title: 'Reviews', icon: <Star size={18} color="#bdbdbd" weight="fill" />, direct: true, on_click: () => router.push('/_admin/reviews') },
			],
		},
		{
			label: 'Commerce',
			items: [
				{ title: 'Orders', icon: <ShoppingBag size={18} color="#bdbdbd" weight="fill" />, direct: true, on_click: () => router.push('/_admin/orders') },
				{ title: 'Returns', icon: <ArrowCounterClockwise size={18} color="#bdbdbd" weight="fill" />, direct: true, on_click: () => router.push('/_admin/returns') },
				{ title: 'Coupons', icon: <Tag size={18} color="#bdbdbd" weight="fill" />, direct: true, on_click: () => router.push('/_admin/coupons') },
				{ title: 'Payouts', icon: <Money size={18} color="#bdbdbd" weight="fill" />, direct: true, on_click: () => router.push('/_admin/payouts') },
			],
		},
		{
			label: 'Content & Support',
			items: [
				{ title: 'Banners', icon: <Image size={18} color="#bdbdbd" weight="fill" />, direct: true, on_click: () => router.push('/_admin/banners') },
				{ title: 'Events', icon: <CalendarBlank size={18} color="#bdbdbd" weight="fill" />, direct: true, on_click: () => router.push('/_admin/events') },
				{ title: 'Community', icon: <ChatsCircle size={18} color="#bdbdbd" weight="fill" />, on_click: () => subMenuChangeHandler('Community') },
				{ title: 'Cs', icon: <Headset size={18} color="#bdbdbd" weight="fill" />, on_click: () => subMenuChangeHandler('Cs') },
			],
		},
		{
			label: 'System',
			items: [
				{ title: 'Reports', icon: <FileText size={18} color="#bdbdbd" weight="fill" />, direct: true, on_click: () => router.push('/_admin/reports') },
				{ title: 'Settings', icon: <Gear size={18} color="#bdbdbd" weight="fill" />, direct: true, on_click: () => router.push('/_admin/settings') },
			],
		},
	];

	return (
		<>
			{menu_groups.map((group, gi) => (
				<React.Fragment key={gi}>
					{gi > 0 && <Divider sx={{ mx: '16px', my: '4px', borderColor: '#F0EBE8' }} />}
					<Typography sx={SECTION_LABEL_STYLE}>{group.label}</Typography>
					{group.items.map((item: any, index: number) => (
						<List className={'menu_wrap'} key={`${gi}-${index}`} disablePadding>
							{item.direct ? (
								<ListItemButton
									onClick={item.on_click}
									component={'li'}
									className={clickMenu[0] === item.title ? 'menu on' : 'menu'}
									sx={{ minHeight: 44, justifyContent: openMenu ? 'initial' : 'center', px: 2.5 }}
								>
									<ListItemIcon sx={{ minWidth: 0, mr: openMenu ? 3 : 'auto', justifyContent: 'center' }}>
										{item.icon}
									</ListItemIcon>
									<ListItemText>{item.title}</ListItemText>
								</ListItemButton>
							) : (
								<>
									<ListItemButton
										onClick={item.on_click}
										component={'li'}
										className={clickMenu[0] === item.title ? 'menu on' : 'menu'}
										sx={{ minHeight: 44, justifyContent: openMenu ? 'initial' : 'center', px: 2.5 }}
									>
										<ListItemIcon sx={{ minWidth: 0, mr: openMenu ? 3 : 'auto', justifyContent: 'center' }}>
											{item.icon}
										</ListItemIcon>
										<ListItemText>{item.title}</ListItemText>
										{clickMenu.find((menu: string) => item.title === menu) ? <ExpandLess /> : <ExpandMore />}
									</ListItemButton>
									<Collapse in={!!clickMenu.find((menu: string) => menu === item.title)} className="menu" timeout="auto" component="li" unmountOnExit>
										<List className="menu-list" disablePadding>
											{sub_menu_set[item.title] &&
												sub_menu_set[item.title].map((sub: any, i: number) => (
													<Link href={sub.url} shallow={true} replace={true} key={i}>
														<ListItemButton
															component="li"
															className={clickMenu[0] === item.title && clickSubMenu === sub.title ? 'li on' : 'li'}
														>
															<Typography variant={sub.title} component={'span'}>{sub.title}</Typography>
														</ListItemButton>
													</Link>
												))}
										</List>
									</Collapse>
								</>
							)}
						</List>
					))}
				</React.Fragment>
			))}
		</>
	);
};

export default withRouter(AdminMenuList);
