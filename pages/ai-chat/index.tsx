import React, { useState, useRef, useEffect } from 'react';
import { NextPage } from 'next';
import { Box, Stack } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

interface Message {
	role: 'user' | 'assistant';
	text: string;
}

const SUGGESTIONS = [
	'What skincare routine is best for dry skin?',
	'Recommend a moisturizer for sensitive skin',
	'What ingredients should I avoid?',
	'How do I layer serums correctly?',
];

const AiChat: NextPage = () => {
	const device = useDeviceDetect();
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState('');
	const bottomRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	const sendMessage = (text: string) => {
		if (!text.trim()) return;
		setMessages((prev) => [
			...prev,
			{ role: 'user', text: text.trim() },
			{ role: 'assistant', text: 'Our AI beauty advisor is coming soon. Stay tuned for personalized skincare recommendations!' },
		]);
		setInput('');
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') sendMessage(input);
	};

	if (device === 'mobile') {
		return <h1>AI CHAT MOBILE</h1>;
	}

	return (
		<Stack className={'ai-chat-page'}>
			<Stack className={'container'}>
				<Box className={'ai-chat-header'}>
					<Box className={'ai-chat-avatar'}>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
							<circle cx="24" cy="24" r="24" fill="#2C2C2C" />
							<circle cx="18" cy="24" r="2" fill="#C9A96E" />
							<circle cx="24" cy="24" r="2" fill="#C9A96E" />
							<circle cx="30" cy="24" r="2" fill="#C9A96E" />
							<path d="M10 14h28a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H14l-5 4V16a2 2 0 0 1 2-2z" stroke="#F5F2EC" strokeWidth="1.2" fill="none" />
						</svg>
					</Box>
					<Box className={'ai-chat-header-text'}>
						<span className={'ai-chat-title'}>AI Beauty Advisor</span>
						<span className={'ai-chat-subtitle'}>Personalized skincare &amp; beauty guidance</span>
					</Box>
				</Box>

				<Box className={'ai-chat-body'}>
					{messages.length === 0 ? (
						<Box className={'ai-chat-empty'}>
							<span className={'ai-chat-empty-title'}>How can I help you today?</span>
							<Box className={'ai-chat-suggestions'}>
								{SUGGESTIONS.map((s) => (
									<button key={s} className={'ai-suggestion-btn'} onClick={() => sendMessage(s)}>
										{s}
									</button>
								))}
							</Box>
						</Box>
					) : (
						<Box className={'ai-chat-messages'}>
							{messages.map((msg, i) => (
								<Box key={i} className={`ai-message ai-message--${msg.role}`}>
									<span>{msg.text}</span>
								</Box>
							))}
							<div ref={bottomRef} />
						</Box>
					)}
				</Box>

				<Box className={'ai-chat-input-wrap'}>
					<input
						className={'ai-chat-input'}
						type="text"
						placeholder={'Ask about skincare, ingredients, routines...'}
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={handleKeyDown}
					/>
					<button className={'ai-chat-send'} onClick={() => sendMessage(input)}>
						Send
					</button>
				</Box>
			</Stack>
		</Stack>
	);
};

export default withLayoutBasic(AiChat);
