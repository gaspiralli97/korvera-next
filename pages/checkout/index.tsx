import React from 'react';
import { NextPage } from 'next';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MyOrder from '../../libs/components/mypage/MyOrder';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const CheckoutPage: NextPage = () => {
	return <MyOrder />;
};

export default withLayoutBasic(CheckoutPage);
