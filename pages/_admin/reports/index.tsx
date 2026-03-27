import React, { useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, Button, Chip, Divider, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import DownloadIcon from '@mui/icons-material/Download';
import ArticleIcon from '@mui/icons-material/Article';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import InventoryIcon from '@mui/icons-material/Inventory';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AssessmentIcon from '@mui/icons-material/Assessment';

const KPI_STATS = [
	{ label: 'Total Revenue', value: '$48,320', trend: 'Mar 2026', icon: '💰', bg: 'rgba(44,22,84,0.08)' },
	{ label: 'Total Orders', value: '1,420', trend: 'Mar 2026', icon: '📦', bg: 'rgba(74,155,111,0.12)' },
	{ label: 'New Customers', value: '312', trend: 'Mar 2026', icon: '👤', bg: 'rgba(212,132,154,0.12)' },
	{ label: 'Avg Order Value', value: '$48.30', trend: 'Mar 2026', icon: '🛒', bg: 'rgba(201,166,128,0.12)' },
];

const REPORT_ROWS = [
	{
		icon: <ArticleIcon sx={{ fontSize: 22, color: '#2C1654' }} />,
		iconBg: 'rgba(44,22,84,0.08)',
		title: 'Sales Report',
		desc: 'Complete breakdown of all orders, revenue, and product sales',
		lastGenerated: '27 Mar 2026',
		size: '2.4 MB',
		format: ['CSV', 'PDF'],
	},
	{
		icon: <PeopleAltIcon sx={{ fontSize: 22, color: '#D4849A' }} />,
		iconBg: 'rgba(212,132,154,0.10)',
		title: 'Customer Report',
		desc: 'Registrations, purchase history, lifetime value, and activity',
		lastGenerated: '27 Mar 2026',
		size: '1.1 MB',
		format: ['CSV', 'PDF'],
	},
	{
		icon: <InventoryIcon sx={{ fontSize: 22, color: '#4A9B6F' }} />,
		iconBg: 'rgba(74,155,111,0.10)',
		title: 'Inventory Report',
		desc: 'Product stock levels, low-stock alerts, seller inventory by category',
		lastGenerated: '26 Mar 2026',
		size: '890 KB',
		format: ['CSV', 'PDF'],
	},
	{
		icon: <MonetizationOnIcon sx={{ fontSize: 22, color: '#E8A84A' }} />,
		iconBg: 'rgba(232,168,74,0.10)',
		title: 'Payout Report',
		desc: 'Seller payout history, pending requests, and processed amounts',
		lastGenerated: '25 Mar 2026',
		size: '640 KB',
		format: ['CSV', 'PDF'],
	},
	{
		icon: <LocalOfferIcon sx={{ fontSize: 22, color: '#C0504A' }} />,
		iconBg: 'rgba(192,80,74,0.08)',
		title: 'Coupon Report',
		desc: 'Coupon usage statistics, discount totals, and expiry tracking',
		lastGenerated: '24 Mar 2026',
		size: '320 KB',
		format: ['CSV'],
	},
	{
		icon: <AssessmentIcon sx={{ fontSize: 22, color: '#635BFF' }} />,
		iconBg: 'rgba(99,91,255,0.08)',
		title: 'Returns & Refunds',
		desc: 'Return requests, approval rates, and refunded totals',
		lastGenerated: '23 Mar 2026',
		size: '480 KB',
		format: ['CSV', 'PDF'],
	},
];

const AdminReports: NextPage = (props: any) => {
	const [startDate, setStartDate] = useState('2026-03-01');
	const [endDate, setEndDate] = useState('2026-03-31');

	return (
		<Box component={'div'} className={'content'}>
			<Typography className={'tit'} sx={{ fontSize: '26px !important', mb: '6px' }}>
				Reports
			</Typography>
			<Typography variant={'subtitle1'} sx={{ color: '#8A8A9A', mb: '32px' }}>
				Export and review business reports for any date range
			</Typography>

			{/* Date Range Filter */}
			<Box component={'div'} className={'chart-card'} sx={{ mb: '24px' }}>
				<Typography className={'chart-section-title'} sx={{ mb: '16px' }}>Date Range</Typography>
				<Stack direction={'row'} alignItems={'center'} spacing={2}>
					<TextField
						label={'From'}
						type={'date'}
						value={startDate}
						onChange={(e) => setStartDate(e.target.value)}
						size={'small'}
						InputLabelProps={{ shrink: true }}
						sx={{ width: '180px' }}
					/>
					<Typography variant={'subtitle1'} sx={{ color: '#8A8A9A' }}>—</Typography>
					<TextField
						label={'To'}
						type={'date'}
						value={endDate}
						onChange={(e) => setEndDate(e.target.value)}
						size={'small'}
						InputLabelProps={{ shrink: true }}
						sx={{ width: '180px' }}
					/>
					<Button
						variant={'contained'}
						sx={{ background: '#2C1654', '&:hover': { background: '#3D2070' }, height: '40px', px: '24px' }}
					>
						Apply
					</Button>
				</Stack>
			</Box>

			{/* KPI Cards */}
			<Box component={'div'} className={'kpi-grid'} sx={{ mb: '28px', gridTemplateColumns: 'repeat(4, 1fr)' }}>
				{KPI_STATS.map((stat, i) => (
					<Box component={'div'} key={i} className={'kpi-card'}>
						<Box component={'div'} className={'kpi-icon-wrap'} sx={{ background: stat.bg }}>
							<span className={'kpi-emoji'}>{stat.icon}</span>
						</Box>
						<Box component={'div'} className={'kpi-info'}>
							<Typography className={'kpi-label'}>{stat.label}</Typography>
							<Typography className={'kpi-value'}>{stat.value}</Typography>
							<Typography className={'kpi-trend up-txt'}>{stat.trend}</Typography>
						</Box>
					</Box>
				))}
			</Box>

			<Divider sx={{ mb: '28px' }} />

			{/* Available Reports Table */}
			<Box component={'div'} className={'chart-card'} sx={{ p: 0, overflow: 'hidden' }}>
				<Box component={'div'} sx={{ px: '24px', py: '18px', borderBottom: '1px solid #F0EBE8' }}>
					<Typography className={'chart-section-title'}>Available Reports</Typography>
					<Typography variant={'body2'} sx={{ color: '#8A8A9A', mt: '2px', fontSize: '12px' }}>
						Select a report type and download for the selected period
					</Typography>
				</Box>
				<TableContainer sx={{ overflowX: 'auto' }}>
					<Table>
						<TableHead>
							<TableRow sx={{ background: '#FAFAFA' }}>
								<TableCell sx={{ fontWeight: 700, fontSize: '12px', color: '#8A8A9A', letterSpacing: '0.5px', textTransform: 'uppercase', py: '12px' }}>
									Report
								</TableCell>
								<TableCell sx={{ fontWeight: 700, fontSize: '12px', color: '#8A8A9A', letterSpacing: '0.5px', textTransform: 'uppercase', py: '12px' }}>
									Description
								</TableCell>
								<TableCell sx={{ fontWeight: 700, fontSize: '12px', color: '#8A8A9A', letterSpacing: '0.5px', textTransform: 'uppercase', py: '12px' }}>
									Last Generated
								</TableCell>
								<TableCell sx={{ fontWeight: 700, fontSize: '12px', color: '#8A8A9A', letterSpacing: '0.5px', textTransform: 'uppercase', py: '12px' }}>
									Size
								</TableCell>
								<TableCell sx={{ fontWeight: 700, fontSize: '12px', color: '#8A8A9A', letterSpacing: '0.5px', textTransform: 'uppercase', py: '12px' }}>
									Format
								</TableCell>
								<TableCell align={'right'} sx={{ fontWeight: 700, fontSize: '12px', color: '#8A8A9A', letterSpacing: '0.5px', textTransform: 'uppercase', py: '12px' }}>
									Actions
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{REPORT_ROWS.map((row, i) => (
								<TableRow key={i} sx={{ '&:hover': { background: '#FAFAFA' }, '&:last-child td': { border: 0 } }}>
									<TableCell sx={{ py: '16px' }}>
										<Stack direction={'row'} alignItems={'center'} spacing={1.5}>
											<Box
												component={'div'}
												sx={{
													width: 38,
													height: 38,
													borderRadius: '10px',
													background: row.iconBg,
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													flexShrink: 0,
												}}
											>
												{row.icon}
											</Box>
											<Typography sx={{ fontWeight: 600, fontSize: '14px', color: '#1A1A2E' }}>
												{row.title}
											</Typography>
										</Stack>
									</TableCell>
									<TableCell sx={{ py: '16px', color: '#8A8A9A', fontSize: '13px', maxWidth: '320px' }}>
										{row.desc}
									</TableCell>
									<TableCell sx={{ py: '16px', color: '#555', fontSize: '13px' }}>
										{row.lastGenerated}
									</TableCell>
									<TableCell sx={{ py: '16px', color: '#555', fontSize: '13px' }}>
										{row.size}
									</TableCell>
									<TableCell sx={{ py: '16px' }}>
										<Stack direction={'row'} spacing={0.5}>
											{row.format.map((f) => (
												<Chip
													key={f}
													label={f}
													size={'small'}
													sx={{
														fontSize: '11px',
														height: '22px',
														background: f === 'PDF' ? 'rgba(44,22,84,0.08)' : 'rgba(74,155,111,0.10)',
														color: f === 'PDF' ? '#2C1654' : '#4A9B6F',
														fontWeight: 600,
													}}
												/>
											))}
										</Stack>
									</TableCell>
									<TableCell align={'right'} sx={{ py: '16px' }}>
										<Stack direction={'row'} spacing={1} justifyContent={'flex-end'}>
											{row.format.includes('CSV') && (
												<Button
													size={'small'}
													variant={'outlined'}
													startIcon={<DownloadIcon sx={{ fontSize: '14px !important' }} />}
													onClick={() => {}}
													sx={{
														color: '#4A9B6F',
														borderColor: '#4A9B6F',
														fontSize: '12px',
														height: '32px',
														'&:hover': { background: 'rgba(74,155,111,0.06)' },
													}}
												>
													CSV
												</Button>
											)}
											{row.format.includes('PDF') && (
												<Button
													size={'small'}
													variant={'contained'}
													startIcon={<DownloadIcon sx={{ fontSize: '14px !important' }} />}
													onClick={() => {}}
													sx={{
														background: '#2C1654',
														fontSize: '12px',
														height: '32px',
														'&:hover': { background: '#3D2070' },
													}}
												>
													PDF
												</Button>
											)}
										</Stack>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>
		</Box>
	);
};

export default withAdminLayout(AdminReports);
