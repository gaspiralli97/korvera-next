import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import useDeviceDetect from '../hooks/useDeviceDetect';
import { Stack, Box } from '@mui/material';
import moment from 'moment';

const Footer = () => {
	const device = useDeviceDetect();

	if (device == 'mobile') {
		return (
			<Stack className={'footer-container'}>
				<Stack className={'footer-brand'}>
					<img src="/img/logo/logoWhite.svg" alt="Korvera" className={'footer-logo'} />
					<Box component={'div'} className={'footer-contact'}>
						<span className={'footer-label'}>free customer support</span>
						<p className={'footer-value'}>support@korvera.uz</p>
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
						<span>Skincare Products</span>
						<span>Makeup Essentials</span>
						<span>Hair & Body Care</span>
						<span>Fragrances</span>
					</Box>
					<Box component={'div'} className={'footer-col'}>
						<strong className={'footer-col-title'}>Quick Links</strong>
						<span>Terms of Use</span>
						<span>Privacy Policy</span>
						<span>Pricing Plans</span>
						<span>Our Services</span>
						<span>Contact Support</span>
						<span>FAQs</span>
					</Box>
					<Box component={'div'} className={'footer-col'}>
						<strong className={'footer-col-title'}>Categories</strong>
						<span>Skincare</span>
						<span>Makeup</span>
						<span>Haircare</span>
						<span>Bodycare</span>
						<span>Fragrance</span>
						<span>Wellness</span>
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
							<p className={'footer-value'}>support@korvera.uz</p>
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
						<span>Skincare Products</span>
						<span>Makeup Essentials</span>
						<span>Hair & Body Care</span>
						<span>Fragrances</span>
					</Box>
					<Box component={'div'} className={'footer-col'}>
						<strong className={'footer-col-title'}>Quick Links</strong>
						<span>Terms of Use</span>
						<span>Privacy Policy</span>
						<span>Pricing Plans</span>
						<span>Our Services</span>
						<span>Contact Support</span>
						<span>FAQs</span>
					</Box>
					<Box component={'div'} className={'footer-col'}>
						<strong className={'footer-col-title'}>Categories</strong>
						<span>Skincare</span>
						<span>Makeup</span>
						<span>Haircare</span>
						<span>Bodycare</span>
						<span>Fragrance</span>
						<span>Wellness</span>
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
