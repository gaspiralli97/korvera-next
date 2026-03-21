import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<meta name="robots" content="index,follow" />
				<link rel="icon" type="image/png" href="/img/logo/favicon.svg" />

				{/* SEO */}
				<meta name="keyword" content={'korvera, korvera.uz, beauty, skincare, cosmetics, makeup, haircare'} />
				<meta
					name={'description'}
					content={
						'Discover premium beauty & skincare products at Korvera. Shop cosmetics, skincare, makeup and more at korvera.uz | ' +
						'Откройте для себя премиальные средства по уходу за кожей и косметику на Korvera. Покупайте на korvera.uz | ' +
						'코르베라에서 프리미엄 뷰티 및 스킨케어 제품을 만나보세요. korvera.uz에서 화장품, 스킨케어, 메이크업 등을 쇼핑하세요'
					}
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
