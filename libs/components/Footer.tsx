import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import useDeviceDetect from '../hooks/useDeviceDetect';
import { Stack, Box } from '@mui/material';
import moment from 'moment';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

const productLink = (category: string) =>
	`/product?input=${encodeURIComponent(JSON.stringify({
		page: 1,
		limit: 9,
		sort: 'createdAt',
		direction: 'DESC',
		search: { categoryList: [category], pricesRange: { start: 5, end: 2000000 }, volumesRange: { start: 0, end: 500 } },
	}))}`;

const Footer = () => {
	const device = useDeviceDetect();
	const { t } = useTranslation('common');

	const popularSearchLinks = [
		{ tKey: 'footer.skincareProducts', href: productLink('SKINCARE') },
		{ tKey: 'footer.makeupEssentials', href: productLink('MAKEUP') },
		{ tKey: 'footer.hairBodyCare', href: productLink('HAIRCARE') },
		{ tKey: 'footer.fragrances', href: productLink('FRAGRANCE') },
	];

	const quickLinks = [
		{ tKey: 'footer.aboutUs', href: '/about' },
		{ tKey: 'footer.termsOfUse', href: '/cs' },
		{ tKey: 'footer.privacyPolicy', href: '/cs' },
		{ tKey: 'footer.pricingPlans', href: '/cs' },
		{ tKey: 'footer.ourServices', href: '/cs' },
		{ tKey: 'footer.contactSupport', href: '/cs' },
		{ tKey: 'footer.faqs', href: '/cs' },
	];

	const categoryLinks = [
		{ tKey: 'footer.skincare', href: productLink('SKINCARE') },
		{ tKey: 'footer.makeup', href: productLink('MAKEUP') },
		{ tKey: 'footer.haircare', href: productLink('HAIRCARE') },
		{ tKey: 'footer.bodycare', href: productLink('BODYCARE') },
		{ tKey: 'footer.fragrance', href: productLink('FRAGRANCE') },
		{ tKey: 'footer.wellness', href: productLink('WELLNESS') },
	];

	if (device == 'mobile') {
		return (
			<Stack className={'footer-container'}>
				<Stack className={'footer-brand'}>
					<img src="/img/logo/logoWhite.svg" alt="Korvera" className={'footer-logo'} />
					<Box component={'div'} className={'footer-contact'}>
						<span className={'footer-label'}>{t('footer.support')}</span>
						<a href="mailto:support@korvera.uz" className={'footer-value'}>support@korvera.uz</a>
					</Box>
					<Box component={'div'} className={'footer-contact'}>
						<span className={'footer-label'}>{t('footer.liveChat')}</span>
						<p className={'footer-value'}>{t('footer.chatHours')}</p>
						<span className={'footer-label'}>{t('footer.hereToHelp')}</span>
					</Box>
					<Box component={'div'} className={'footer-contact'}>
						<p className={'footer-label'}>{t('footer.followUs')}</p>
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
						<strong className={'footer-col-title'}>{t('footer.popularSearch')}</strong>
						{popularSearchLinks.map((item) => (
							<Link key={item.tKey} href={item.href}><span>{t(item.tKey)}</span></Link>
						))}
					</Box>
					<Box component={'div'} className={'footer-col'}>
						<strong className={'footer-col-title'}>{t('footer.quickLinks')}</strong>
						{quickLinks.map((item) => (
							<Link key={item.tKey} href={item.href}><span>{t(item.tKey)}</span></Link>
						))}
					</Box>
					<Box component={'div'} className={'footer-col'}>
						<strong className={'footer-col-title'}>{t('footer.categories')}</strong>
						{categoryLinks.map((item) => (
							<Link key={item.tKey} href={item.href}><span>{t(item.tKey)}</span></Link>
						))}
					</Box>
				</Stack>
				<Stack className={'footer-bottom'}>
					<span>{t('footer.copyright')} {moment().year()}</span>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'footer-container'}>
				<Stack className={'footer-newsletter'}>
					<strong>{t('footer.stayUpdated')}</strong>
					<div className={'footer-newsletter-form'}>
						<input type="text" placeholder={t('footer.emailPlaceholder')} />
						<span>{t('footer.subscribe')}</span>
					</div>
				</Stack>
				<Stack className={'footer-main'}>
					<Box component={'div'} className={'footer-brand'}>
						<img src="/img/logo/logoWhite.svg" alt="Korvera" className={'footer-logo'} />
						<Box component={'div'} className={'footer-contact'}>
							<span className={'footer-label'}>{t('footer.support')}</span>
							<a href="mailto:support@korvera.uz" className={'footer-value'}>support@korvera.uz</a>
						</Box>
						<Box component={'div'} className={'footer-contact'}>
							<span className={'footer-label'}>{t('footer.liveChat')}</span>
							<p className={'footer-value'}>{t('footer.chatHours')}</p>
							<span className={'footer-label'}>{t('footer.hereToHelp')}</span>
						</Box>
						<Box component={'div'} className={'footer-contact'}>
							<p className={'footer-label'}>{t('footer.followUs')}</p>
							<div className={'footer-social-icons'}>
								<FacebookOutlinedIcon />
								<TelegramIcon />
								<InstagramIcon />
								<TwitterIcon />
							</div>
						</Box>
					</Box>
					<Box component={'div'} className={'footer-col'}>
						<strong className={'footer-col-title'}>{t('footer.popularSearch')}</strong>
						{popularSearchLinks.map((item) => (
							<Link key={item.tKey} href={item.href}><span>{t(item.tKey)}</span></Link>
						))}
					</Box>
					<Box component={'div'} className={'footer-col'}>
						<strong className={'footer-col-title'}>{t('footer.quickLinks')}</strong>
						{quickLinks.map((item) => (
							<Link key={item.tKey} href={item.href}><span>{t(item.tKey)}</span></Link>
						))}
					</Box>
					<Box component={'div'} className={'footer-col'}>
						<strong className={'footer-col-title'}>{t('footer.categories')}</strong>
						{categoryLinks.map((item) => (
							<Link key={item.tKey} href={item.href}><span>{t(item.tKey)}</span></Link>
						))}
					</Box>
				</Stack>
				<Stack className={'footer-bottom'}>
					<span>{t('footer.copyright')} {moment().year()}</span>
					<span>{t('footer.privacyTerms')}</span>
				</Stack>
			</Stack>
		);
	}
};

export default Footer;
