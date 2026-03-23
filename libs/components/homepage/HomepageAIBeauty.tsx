import React from 'react';
import { Stack, Box, Typography } from '@mui/material';

const SUGGESTIONS = [
	'Best serum for dry skin?',
	'Korean skincare routine for beginners',
	'How to layer actives safely?',
	'Products for sensitive + acne-prone skin',
];

const HomepageAIBeauty = () => {
	const openChat = () => {
		const btn = document.querySelector<HTMLButtonElement>('.chat-button');
		if (btn) btn.click();
	};

	return (
		<Stack className={'hp-ai-beauty'}>
			<Stack className={'container'}>
				<Box className={'hp-ai-inner'}>
					{/* Left */}
					<Box className={'hp-ai-left'}>
						<Box className={'hp-ai-icon'}>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
								<circle cx="24" cy="24" r="24" fill="#2C2C2C" />
								<circle cx="18" cy="24" r="2" fill="#C9A96E" />
								<circle cx="24" cy="24" r="2" fill="#C9A96E" />
								<circle cx="30" cy="24" r="2" fill="#C9A96E" />
								<path d="M10 14h28a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H14l-5 4V16a2 2 0 0 1 2-2z"
									stroke="#F5F2EC" strokeWidth="1.2" fill="none" />
							</svg>
						</Box>
						<Typography className={'hp-section-eyebrow'}>AI Beauty Advisor</Typography>
						<Typography className={'hp-section-title'}>Personalised Beauty Guidance</Typography>
						<p className={'hp-ai-desc'}>
							Not sure where to start? Our AI advisor analyses your skin concerns and recommends
							the right products from our curated Korean beauty collection.
						</p>
						<button className={'hp-solid-btn hp-solid-btn--dark'} onClick={openChat}>
							Start a Conversation
						</button>
					</Box>

					{/* Right — suggestion chips */}
					<Box className={'hp-ai-right'}>
						<span className={'hp-ai-prompt-label'}>Try asking:</span>
						<Box className={'hp-ai-suggestions'}>
							{SUGGESTIONS.map((s) => (
								<button key={s} className={'hp-ai-chip'} onClick={openChat}>
									{s}
								</button>
							))}
						</Box>
					</Box>
				</Box>
			</Stack>
		</Stack>
	);
};

export default HomepageAIBeauty;
