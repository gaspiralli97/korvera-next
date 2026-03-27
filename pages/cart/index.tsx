import React from 'react';
import { NextPage } from 'next';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import MyCart from '../../libs/components/mypage/MyCart';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const CartPage: NextPage = () => {
	return <MyCart />;
};

export default withLayoutBasic(CartPage);
