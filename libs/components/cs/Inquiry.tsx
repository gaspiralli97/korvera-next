import React, { useState, useEffect } from 'react';
import { Box, Button, MenuItem, Select, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { sweetMixinErrorAlert, sweetTopSuccessAlert } from '../../sweetAlert';

const CATEGORIES = ['Product Issue', 'Order & Delivery', 'Payment', 'Return & Refund', 'Account', 'Partnership', 'Other'];

const Inquiry = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [category, setCategory] = useState(CATEGORIES[0]);
	const [subject, setSubject] = useState('');
	const [message, setMessage] = useState('');
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		if (user?.memberNick) setName(user.memberNick);
	}, [user?._id]);

	const handleSubmit = async () => {
		if (!name.trim()) { await sweetMixinErrorAlert('Please enter your name.'); return; }
		if (!email.trim()) { await sweetMixinErrorAlert('Please enter your email.'); return; }
		if (!subject.trim()) { await sweetMixinErrorAlert('Please enter a subject.'); return; }
		if (message.trim().length < 10) { await sweetMixinErrorAlert('Message must be at least 10 characters.'); return; }

		setSubmitting(true);
		try {
			const record = {
				name,
				email,
				category,
				subject,
				message,
				createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
				status: 'Pending',
			};
			const key = `korvera_inquiries_${user?._id ?? 'guest'}`;
			let history: any[] = [];
			try {
				const raw = localStorage.getItem(key);
				if (raw) history = JSON.parse(raw);
			} catch {}
			history.unshift(record);
			localStorage.setItem(key, JSON.stringify(history));

			setSubject('');
			setMessage('');
			await sweetTopSuccessAlert('Your inquiry has been submitted. We will respond within 24 hours.', 2000);
		} finally {
			setSubmitting(false);
		}
	};

	if (device === 'mobile') {
		return <div>Inquiry MOBILE</div>;
	} else {
		return (
			<Stack className={'inquiry-wrap'}>
				<Stack className={'inquiry-header'}>
					<Typography className={'inquiry-title'}>Contact Us</Typography>
					<Typography className={'inquiry-sub'}>
						Our support team will respond within 24 hours. You can also reach us at{' '}
						<span className={'inquiry-email'}>support@korvera.uz</span>
					</Typography>
				</Stack>

				<Stack className={'inquiry-form'}>
					<Stack className={'inquiry-row'}>
						<Stack className={'inquiry-field'}>
							<label className={'inquiry-label'}>Name</label>
							<input
								className={'inquiry-input'}
								placeholder={'Your name'}
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</Stack>
						<Stack className={'inquiry-field'}>
							<label className={'inquiry-label'}>Email</label>
							<input
								className={'inquiry-input'}
								placeholder={'your@email.com'}
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</Stack>
					</Stack>

					<Stack className={'inquiry-row'}>
						<Stack className={'inquiry-field'}>
							<label className={'inquiry-label'}>Category</label>
							<Select
								value={category}
								onChange={(e) => setCategory(e.target.value)}
								className={'inquiry-select'}
								size={'small'}
							>
								{CATEGORIES.map((cat) => (
									<MenuItem key={cat} value={cat}>{cat}</MenuItem>
								))}
							</Select>
						</Stack>
						<Stack className={'inquiry-field'}>
							<label className={'inquiry-label'}>Subject</label>
							<input
								className={'inquiry-input'}
								placeholder={'Brief description of your inquiry'}
								value={subject}
								onChange={(e) => setSubject(e.target.value)}
							/>
						</Stack>
					</Stack>

					<Stack className={'inquiry-field'}>
						<label className={'inquiry-label'}>Message</label>
						<textarea
							className={'inquiry-textarea'}
							placeholder={'Describe your inquiry in detail... (min 10 characters)'}
							value={message}
							rows={6}
							onChange={(e) => setMessage(e.target.value)}
						/>
					</Stack>

					<Box component={'div'} className={'inquiry-submit-row'}>
						<Button
							className={'inquiry-submit-btn'}
							onClick={handleSubmit}
							disabled={submitting}
						>
							{submitting ? 'Submitting...' : 'Submit Inquiry'}
						</Button>
					</Box>
				</Stack>

				<Stack className={'inquiry-info-row'}>
					{[
						{ icon: '📧', label: 'Email', value: 'support@korvera.uz' },
						{ icon: '🕐', label: 'Response Time', value: 'Within 24 hours' },
						{ icon: '📞', label: 'Phone', value: '+82-10-0000-0000' },
					].map(({ icon, label, value }) => (
						<Stack key={label} className={'inquiry-info-card'}>
							<span className={'inquiry-info-icon'}>{icon}</span>
							<Typography className={'inquiry-info-label'}>{label}</Typography>
							<Typography className={'inquiry-info-value'}>{value}</Typography>
						</Stack>
					))}
				</Stack>
			</Stack>
		);
	}
};

export default Inquiry;
