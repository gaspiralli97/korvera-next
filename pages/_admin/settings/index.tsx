import React, { useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, Button, Divider, FormControlLabel, Stack, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import { sweetTopSuccessAlert } from '../../../libs/sweetAlert';

const AdminSettings: NextPage = (props: any) => {
	const [settings, setSettings] = useState({
		siteName: 'Korvera Beauty',
		contactEmail: 'admin@korvera.com',
		commissionRate: 12,
		minPayoutAmount: 50,
		maintenanceMode: false,
		instagramUrl: 'https://instagram.com/korverabeauty',
		facebookUrl: 'https://facebook.com/korverabeauty',
		twitterUrl: 'https://twitter.com/korverabeauty',
	});

	const handleChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
		setSettings((prev) => ({ ...prev, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
	};

	const saveHandler = async () => {
		await sweetTopSuccessAlert('Settings saved successfully!');
	};

	return (
		<Box component={'div'} className={'content'}>
			<Typography className={'tit'} sx={{ fontSize: '26px !important', mb: '6px' }}>
				Settings
			</Typography>
			<Typography variant={'subtitle1'} sx={{ color: '#8A8A9A', mb: '32px' }}>
				Manage general platform configuration
			</Typography>

			<Stack spacing={'24px'}>

				{/* General */}
				<Box component={'div'} className={'chart-card'}>
					<Typography className={'chart-section-title'} sx={{ mb: '20px' }}>General</Typography>
					<Box component={'div'} className={'settings-form-grid'}>
						<TextField
							label={'Site Name'}
							value={settings.siteName}
							onChange={handleChange('siteName')}
							size={'small'}
							fullWidth
						/>
						<TextField
							label={'Contact Email'}
							type={'email'}
							value={settings.contactEmail}
							onChange={handleChange('contactEmail')}
							size={'small'}
							fullWidth
						/>
					</Box>
					<Box component={'div'} sx={{ mt: '20px' }}>
						<FormControlLabel
							control={
								<Switch
									checked={settings.maintenanceMode}
									onChange={handleChange('maintenanceMode')}
									sx={{
										'& .MuiSwitch-switchBase.Mui-checked': { color: '#C0504A' },
										'& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#C0504A' },
									}}
								/>
							}
							label={
								<Box component={'div'}>
									<Typography variant={'subtitle1'} sx={{ fontWeight: 600, color: '#1A1A2E', fontSize: '14px' }}>
										Maintenance Mode
									</Typography>
									<Typography variant={'body2'} sx={{ color: '#8A8A9A', fontSize: '12px' }}>
										When enabled, the site will show a maintenance page to all visitors
									</Typography>
								</Box>
							}
						/>
					</Box>
				</Box>

				{/* Finance */}
				<Box component={'div'} className={'chart-card'}>
					<Typography className={'chart-section-title'} sx={{ mb: '20px' }}>Finance</Typography>
					<Box component={'div'} className={'settings-form-grid'}>
						<TextField
							label={'Commission Rate (%)'}
							type={'number'}
							value={settings.commissionRate}
							onChange={handleChange('commissionRate')}
							size={'small'}
							helperText={'Platform fee taken from each seller sale'}
							inputProps={{ min: 0, max: 50 }}
						/>
						<TextField
							label={'Minimum Payout Amount ($)'}
							type={'number'}
							value={settings.minPayoutAmount}
							onChange={handleChange('minPayoutAmount')}
							size={'small'}
							helperText={'Minimum balance required before seller can request payout'}
							inputProps={{ min: 0 }}
						/>
					</Box>
				</Box>

				{/* Social */}
				<Box component={'div'} className={'chart-card'}>
					<Typography className={'chart-section-title'} sx={{ mb: '20px' }}>Social Links</Typography>
					<Stack spacing={'16px'}>
						<TextField
							label={'Instagram URL'}
							value={settings.instagramUrl}
							onChange={handleChange('instagramUrl')}
							size={'small'}
							fullWidth
							InputProps={{ startAdornment: <Typography variant={'body2'} sx={{ color: '#8A8A9A', mr: 1, fontSize: '13px' }}>📷</Typography> }}
						/>
						<TextField
							label={'Facebook URL'}
							value={settings.facebookUrl}
							onChange={handleChange('facebookUrl')}
							size={'small'}
							fullWidth
							InputProps={{ startAdornment: <Typography variant={'body2'} sx={{ color: '#8A8A9A', mr: 1, fontSize: '13px' }}>📘</Typography> }}
						/>
						<TextField
							label={'Twitter / X URL'}
							value={settings.twitterUrl}
							onChange={handleChange('twitterUrl')}
							size={'small'}
							fullWidth
							InputProps={{ startAdornment: <Typography variant={'body2'} sx={{ color: '#8A8A9A', mr: 1, fontSize: '13px' }}>🐦</Typography> }}
						/>
					</Stack>
				</Box>

			</Stack>

			<Divider sx={{ my: '28px' }} />

			<Stack direction={'row'} justifyContent={'flex-end'} spacing={2}>
				<Button
					className={'btn-cancel'}
					onClick={() => {}}
					sx={{ px: '24px', height: '44px' }}
				>
					Reset
				</Button>
				<Button
					variant={'contained'}
					onClick={saveHandler}
					sx={{ background: '#2C1654', '&:hover': { background: '#3D2070' }, px: '32px', height: '44px' }}
				>
					Save Settings
				</Button>
			</Stack>
		</Box>
	);
};

export default withAdminLayout(AdminSettings);
