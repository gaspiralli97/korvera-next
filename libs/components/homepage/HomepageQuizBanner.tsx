import React from 'react';
import { Stack, Typography, Button } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';

const HomepageQuizBanner = () => {
	const router = useRouter();
	const device = useDeviceDetect();

	const visuals = [
		{ emoji: '🧬', label: 'Skin Type' },
		{ emoji: '🎯', label: 'Concern' },
		{ emoji: '🛍️', label: 'Category' },
		{ emoji: '✨', label: 'Results' },
	];

	if (device === 'mobile') {
		return (
			<Stack className={'mob-quiz-banner'}>
				<span className={'mob-quiz-tag'}>
					<AutoAwesomeIcon style={{ fontSize: 12 }} />
					Personalized Routine
				</span>
				<Typography className={'mob-quiz-title'}>Find Your Perfect Skincare Routine</Typography>
				<Typography className={'mob-quiz-desc'}>
					Answer 4 quick questions and we'll match you with the right products.
				</Typography>
				<Stack className={'mob-quiz-steps'}>
					{visuals.map((v, i) => (
						<Stack key={i} className={'mob-quiz-step'}>
							<span className={'mob-quiz-emoji'}>{v.emoji}</span>
							<span className={'mob-quiz-step-label'}>{v.label}</span>
						</Stack>
					))}
				</Stack>
				<Button
					className={'mob-quiz-btn'}
					onClick={() => router.push('/quiz')}
					endIcon={<ArrowForwardIcon />}
				>
					Take the Beauty Quiz
				</Button>
			</Stack>
		);
	}

	return (
		<Stack className={'hp-quiz-banner'}>
			<Stack className={'container'}>
				<Stack className={'banner-content'}>
					<span className={'banner-tag'}>
						<AutoAwesomeIcon style={{ fontSize: 13 }} />
						Personalized Routine
					</span>
					<Typography className={'banner-title'}>
						Find Your Perfect<br />Skincare Routine
					</Typography>
					<Typography className={'banner-desc'}>
						Answer 4 quick questions and we'll match you with products<br />
						tailored to your skin type, concerns, and budget.
					</Typography>
					<Button
						className={'banner-btn'}
						onClick={() => router.push('/quiz')}
						endIcon={<ArrowForwardIcon />}
					>
						Take the Beauty Quiz
					</Button>
				</Stack>
				<Stack className={'banner-visual'}>
					{visuals.map((v, i) => (
						<Stack key={i} className={'visual-item'}>
							<span className={'visual-emoji'}>{v.emoji}</span>
							<Typography className={'visual-label'}>{v.label}</Typography>
						</Stack>
					))}
				</Stack>
			</Stack>
		</Stack>
	);
};

export default HomepageQuizBanner;
