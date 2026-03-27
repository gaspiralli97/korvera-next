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
import HomepageBrands from '../libs/components/homepage/HomepageBrands';
import HomepageQuizBanner from '../libs/components/homepage/HomepageQuizBanner';
import TopAgents from '../libs/components/homepage/TopAgents';
import PromoBanners from '../libs/components/homepage/PromoBanners';

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
				<HomepageSocialProof />
			</Stack>
		);
	} else {
		return (
			<Stack className={'home-page'}>
				{/* Hero — rendered in LayoutHome (.header-main) */}
				<HomepageCategories />
				<PromoBanners />
				<ProductTabs />
				<HomepageQuizBanner />
				<HomepageSkinSolutions />
				<HomepageSocialProof />
				<TopAgents />
				<Events />
				<HomepageBrands />
			</Stack>
		);
	}
};

export default withLayoutMain(Home);
