import { NextPage } from 'next';
import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import withLayoutMain from '../libs/components/layout/LayoutHome';
import { Stack } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import TrendProducts from '../libs/components/homepage/TrendProducts';
import TopProducts from '../libs/components/homepage/TopProducts';
import HomepageCategories from '../libs/components/homepage/HomepageCategories';
import HomepageBrands from '../libs/components/homepage/HomepageBrands';
import HomepageSkinSolutions from '../libs/components/homepage/HomepageSkinSolutions';
import BeforeAfter from '../libs/components/homepage/BeforeAfter';
import HomepageAIBeauty from '../libs/components/homepage/HomepageAIBeauty';
import HomepageReviews from '../libs/components/homepage/HomepageReviews';

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
				<TrendProducts />
				<TopProducts />
				<HomepageReviews />
			</Stack>
		);
	} else {
		return (
			<Stack className={'home-page'}>
				{/* Hero — rendered in LayoutHome (.header-main) */}
				<HomepageCategories />
				<TrendProducts />
				<HomepageBrands />
				<HomepageSkinSolutions />
				<BeforeAfter />
				<TopProducts />
				<HomepageAIBeauty />
				<HomepageReviews />
			</Stack>
		);
	}
};

export default withLayoutMain(Home);
