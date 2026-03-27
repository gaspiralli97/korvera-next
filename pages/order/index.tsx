import React from 'react';
import { NextPage } from 'next';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import MyOrder from '../../libs/components/mypage/MyOrder';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const OrderPage: NextPage = () => {
	return <MyOrder />;
};

export default withLayoutBasic(OrderPage);
