import type { AppProps } from 'next/app';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { light } from '../scss/MaterialTheme';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../apollo/client';
import { appWithTranslation } from 'next-i18next';
import '../scss/app.scss';
import '../scss/pc/main.scss';
import '../scss/mobile/main.scss';
import '../scss/pc/spinWheel.scss';
import SpinWheel from '../libs/components/common/SpinWheel';

const SPIN_DELAY_MS = 10_000;
const SPIN_STORAGE_KEY = 'korvera_spin_shown';

const App = ({ Component, pageProps }: AppProps) => {
	// @ts-ignore
	const [theme, setTheme] = useState(createTheme(light));
	const client = useApollo(pageProps.initialApolloState);
	const [showSpin, setShowSpin] = useState(false);

	useEffect(() => {
		// TODO: remove localStorage check before production
		const timer = setTimeout(() => {
			setShowSpin(true);
		}, SPIN_DELAY_MS);
		return () => clearTimeout(timer);
	}, []);

	return (
		<ApolloProvider client={client}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<Component {...pageProps} />
				{showSpin && <SpinWheel onClose={() => setShowSpin(false)} />}
			</ThemeProvider>
		</ApolloProvider>
	);
};

export default appWithTranslation(App);
