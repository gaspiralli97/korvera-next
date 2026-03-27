import React from 'react';
import { Stack, Typography, Button } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useRouter } from 'next/router';

const HomepageQuizBanner = () => {
	const router = useRouter();

	const visuals = [
		{ emoji: '🧬', label: 'Skin Type' },
		{ emoji: '🎯', label: 'Concern' },
		{ emoji: '🛍️', label: 'Category' },
		{ emoji: '✨', label: 'Results' },
	];

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
