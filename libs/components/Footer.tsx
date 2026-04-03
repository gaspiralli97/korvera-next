import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import useDeviceDetect from '../hooks/useDeviceDetect';
import { Stack, Box } from '@mui/material';
import moment from 'moment';
import Link from 'next/link';

const productLink = (category: string) =>
	`/product?input=${JSON.stringify({
		page: 1,
		limit: 9,
		sort: 'createdAt',
		direction: 'DESC',
		search: { categoryList: [category], pricesRange: { start: 5, end: 2000000 }, volumesRange: { start: 0, end: 500 } },
	})}`;

const Footer = () => {
	const device = useDeviceDetect();

	const popularSearchLinks = [
		{ label: 'Skincare Products', href: productLink('SKINCARE') },
		{ label: 'Makeup Essentials', href: productLink('MAKEUP') },
		{ label: 'Hair & Body Care', href: productLink('HAIRCARE') },
		{ label: 'Fragrances', href: productLink('FRAGRANCE') },
	];

	const quickLinks = [
		{ label: 'About Us', href: '/about' },
		{ label: 'Terms of Use', href: '/cs' },
		{ label: 'Privacy Policy', href: '/cs' },
		{ label: 'Pricing Plans', href: '/cs' },
		{ label: 'Our Services', href: '/cs' },
		{ label: 'Contact Support', href: '/cs' },
		{ label: 'FAQs', href: '/cs' },
	];

	const categoryLinks = [
		{ label: 'Skincare', href: productLink('SKINCARE') },
		{ label: 'Makeup', href: productLink('MAKEUP') },
		{ label: 'Haircare', href: productLink('HAIRCARE') },
		{ label: 'Bodycare', href: productLink('BODYCARE') },
		{ label: 'Fragrance', href: productLink('FRAGRANCE') },
		{ label: 'Wellness', href: productLink('WELLNESS') },
	];

	if (device == 'mobile') {
		return (
			<Stack className={'footer-container'}>
				<Stack className={'footer-brand'}>
					<img src="/img/logo/logoWhite.svg" alt="Korvera" className={'footer-logo'} />
					<Box component={'div'} className={'footer-contact'}>
						<span className={'footer-label'}>free customer support</span>
						<a href="mailto:support@korvera.uz" className={'footer-value'}>support@korvera.uz</a>
					</Box>
					<Box component={'div'} className={'footer-contact'}>
						<span className={'footer-label'}>live chat available</span>
						<p className={'footer-value'}>Mon – Fri, 9AM – 6PM</p>
						<span className={'footer-label'}>We're here to help</span>
					</Box>
					<Box component={'div'} className={'footer-contact'}>
						<p className={'footer-label'}>follow us on social media</p>
						<div className={'footer-social-icons'}>
							<FacebookOutlinedIcon />
							<TelegramIcon />
							<InstagramIcon />
							<TwitterIcon />
						</div>
					</Box>
				</Stack>
				<Stack className={'footer-links'}>
					<Box component={'div'} className={'footer-col'}>
						<strong className={'footer-col-title'}>Popular Search</strong>
						{popularSearchLinks.map((item) => (
							<Link key={item.label} href={item.href}><span>{item.label}</span></Link>
						))}
					</Box>
					<Box component={'div'} className={'footer-col'}>
						<strong className={'footer-col-title'}>Quick Links</strong>
						{quickLinks.map((item) => (
							<Link key={item.label} href={item.href}><span>{item.label}</span></Link>
						))}
					</Box>
					<Box component={'div'} className={'footer-col'}>
						<strong className={'footer-col-title'}>Categories</strong>
						{categoryLinks.map((item) => (
							<Link key={item.label} href={item.href}><span>{item.label}</span></Link>
						))}
					</Box>
				</Stack>
				<Stack className={'footer-bottom'}>
					<span>© Korvera Beauty — All rights reserved. {moment().year()}</span>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'footer-container'}>
				<Stack className={'footer-newsletter'}>
					<strong>Stay updated with beauty trends</strong>
					<div className={'footer-newsletter-form'}>
						<input type="text" placeholder={'Your email address'} />
						<span>Subscribe</span>
					</div>
				</Stack>
				<Stack className={'footer-main'}>
					<Box component={'div'} className={'footer-brand'}>
						<img src="/img/logo/logoWhite.svg" alt="Korvera" className={'footer-logo'} />
						<Box component={'div'} className={'footer-contact'}>
							<span className={'footer-label'}>free customer support</span>
							<a href="mailto:support@korvera.uz" className={'footer-value'}>support@korvera.uz</a>
						</Box>
						<Box component={'div'} className={'footer-contact'}>
							<span className={'footer-label'}>live chat available</span>
							<p className={'footer-value'}>Mon – Fri, 9AM – 6PM</p>
							<span className={'footer-label'}>We're here to help</span>
						</Box>
						<Box component={'div'} className={'footer-contact'}>
							<p className={'footer-label'}>follow us on social media</p>
							<div className={'footer-social-icons'}>
								<FacebookOutlinedIcon />
								<TelegramIcon />
								<InstagramIcon />
								<TwitterIcon />
							</div>
						</Box>
					</Box>
					<Box component={'div'} className={'footer-col'}>
						<strong className={'footer-col-title'}>Popular Search</strong>
						{popularSearchLinks.map((item) => (
							<Link key={item.label} href={item.href}><span>{item.label}</span></Link>
						))}
					</Box>
					<Box component={'div'} className={'footer-col'}>
						<strong className={'footer-col-title'}>Quick Links</strong>
						{quickLinks.map((item) => (
							<Link key={item.label} href={item.href}><span>{item.label}</span></Link>
						))}
					</Box>
					<Box component={'div'} className={'footer-col'}>
						<strong className={'footer-col-title'}>Categories</strong>
						{categoryLinks.map((item) => (
							<Link key={item.label} href={item.href}><span>{item.label}</span></Link>
						))}
					</Box>
				</Stack>
				<Stack className={'footer-bottom'}>
					<span>© Korvera Beauty — All rights reserved. {moment().year()}</span>
					<span>Privacy · Terms · Sitemap</span>
				</Stack>
			</Stack>
		);
	}
};

export default Footer;
