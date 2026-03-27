import React from 'react';
import { NextPage } from 'next';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import MyOrderSuccess from '../../libs/components/mypage/MyOrderSuccess';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const OrderSuccessPage: NextPage = () => {
	return <MyOrderSuccess />;
};

export default withLayoutBasic(OrderSuccessPage);
