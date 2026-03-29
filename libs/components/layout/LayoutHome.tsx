import React, { useEffect, useRef, useState } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Head from 'next/head';
import Top from '../Top';
import Footer from '../Footer';
import { Stack } from '@mui/material';
import { userVar } from '../../../apollo/store';
import { useReactiveVar } from '@apollo/client';
import { getJwtToken, updateUserInfo } from '../../auth';
import Chat from '../Chat';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const withLayoutMain = (Component: any) => {
	return (props: any) => {
		const device = useDeviceDetect();
		const user = useReactiveVar(userVar);
		const videoRef = useRef<HTMLVideoElement>(null);
		const [muted, setMuted] = useState(true);

		/** LIFECYCLES **/
		useEffect(() => {
			const jwt = getJwtToken();
			if (jwt) updateUserInfo(jwt);
		}, []);

		useEffect(() => {
			const video = videoRef.current;
			if (!video) return;
			const observer = new IntersectionObserver(
				([entry]) => {
					if (!entry.isIntersecting) {
						video.muted = true;
						setMuted(true);
					}
				},
				{ threshold: 0.1 },
			);
			observer.observe(video);
			return () => observer.disconnect();
		}, []);

		const toggleMute = () => {
			const video = videoRef.current;
			if (!video) return;
			video.muted = !video.muted;
			setMuted(video.muted);
		};

		/** HANDLERS **/

		if (device == 'mobile') {
			return (
				<>
					<Head>
						<title>Korvera</title>
						<meta name={'title'} content={`Korvera`} />
					</Head>
					<Stack id="mobile-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		} else {
			return (
				<>
					<Head>
						<title>Korvera</title>
						<meta name={'title'} content={`Korvera`} />
					</Head>
					<Stack id="pc-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<Stack className={'header-main'}>
						<video
							ref={videoRef}
							className={'hero-video'}
							src={'/video/ads2.mp4'}
							autoPlay
							loop
							playsInline
							muted
						/>
						<button className={'hero-mute-btn'} onClick={toggleMute}>
							{muted ? '🔇' : '🔊'}
						</button>
					</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						<Chat />

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		}
	};
};

export default withLayoutMain;
