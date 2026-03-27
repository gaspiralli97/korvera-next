import { NextPage } from 'next';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import BeautyQuiz from '../../libs/components/quiz/BeautyQuiz';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const QuizPage: NextPage = () => {
	return <BeautyQuiz />;
};

export default withLayoutBasic(QuizPage);
