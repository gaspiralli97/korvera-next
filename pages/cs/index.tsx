import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Box, Stack } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import Notice from '../../libs/components/cs/Notice';
import Faq from '../../libs/components/cs/Faq';
import Inquiry from '../../libs/components/cs/Inquiry';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const CS: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();

	/** HANDLERS **/
	const changeTabHandler = (tab: string) => {
		router.push(
			{
				pathname: '/cs',
				query: { tab: tab },
			},
			undefined,
			{ scroll: false },
		);
	};
	const tab = router.query.tab ?? 'notice';

	if (device === 'mobile') {
		return (
			<div className={'mob-cs-page'}>
				<div className={'mob-cs-header'}>
					<span className={'mob-cs-title'}>Help Center</span>
					<p className={'mob-cs-sub'}>How can we help you today?</p>
				</div>
				<div className={'mob-cs-tabs'}>
					<button className={`mob-cs-tab-btn${tab === 'notice' ? ' active' : ''}`} onClick={() => changeTabHandler('notice')}>Notice</button>
					<button className={`mob-cs-tab-btn${tab === 'faq' ? ' active' : ''}`} onClick={() => changeTabHandler('faq')}>FAQ</button>
					<button className={`mob-cs-tab-btn${tab === 'inquiry' ? ' active' : ''}`} onClick={() => changeTabHandler('inquiry')}>Inquiry</button>
				</div>
				<div className={'mob-cs-content'}>
					{tab === 'notice' && <Notice />}
					{tab === 'faq' && <Faq />}
					{tab === 'inquiry' && <Inquiry />}
				</div>
			</div>
		);
	} else {
		return (
			<Stack className={'cs-page'}>
				<Stack className={'container'}>
					<Box component={'div'} className={'cs-main-info'}>
						<Box component={'div'} className={'info'}>
							<span>Beauty Help Center</span>
							<p>How can we help you today?</p>
						</Box>
						<Box component={'div'} className={'btns'}>
							<div
								className={tab == 'notice' ? 'active' : ''}
								onClick={() => {
									changeTabHandler('notice');
								}}
							>
								Notice
							</div>
							<div
								className={tab == 'faq' ? 'active' : ''}
								onClick={() => {
									changeTabHandler('faq');
								}}
							>
								FAQ
							</div>
							<div
								className={tab == 'inquiry' ? 'active' : ''}
								onClick={() => {
									changeTabHandler('inquiry');
								}}
							>
								Inquiry
							</div>
						</Box>
					</Box>

					<Box component={'div'} className={'cs-content'}>
						{tab === 'notice' && <Notice />}

						{tab === 'faq' && <Faq />}

						{tab === 'inquiry' && <Inquiry />}
					</Box>
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(CS);
