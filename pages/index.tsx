import { NextPage } from 'next';
import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import withLayoutMain from '../libs/components/layout/LayoutHome';
import { Stack } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import HomepageCategories from '../libs/components/homepage/HomepageCategories';
import ProductTabs from '../libs/components/homepage/ProductTabs';
import HomepageSkinSolutions from '../libs/components/homepage/HomepageSkinSolutions';
import HomepageSocialProof from '../libs/components/homepage/HomepageSocialProof';
import Events from '../libs/components/homepage/Events';
import HomepageCleanBeauty from '../libs/components/homepage/HomepageCleanBeauty';
import HomepageQuizBanner from '../libs/components/homepage/HomepageQuizBanner';
import TopAgents from '../libs/components/homepage/TopAgents';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Home: NextPage = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Stack className={'home-page'}>
				<HomepageCategories />
				<ProductTabs />
				<HomepageQuizBanner />
				<HomepageSocialProof />
				<TopAgents />
				<Events />
				<HomepageSkinSolutions />
				<HomepageCleanBeauty />
			</Stack>
		);
	} else {
		return (
			<Stack className={'home-page'}>
				{/* Hero — rendered in LayoutHome (.header-main) */}
				<HomepageCategories />
				<ProductTabs />
				<HomepageQuizBanner />
				<HomepageSocialProof />
				<TopAgents />
				<Events />
				<HomepageSkinSolutions />
				<HomepageCleanBeauty />
			</Stack>
		);
	}
};

export default withLayoutMain(Home);
