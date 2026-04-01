import React, { useEffect, useRef } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../libs/components/layout/LayoutAdmin';
import { Box, Divider, Stack, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import type { Chart as ChartType } from 'chart.js';

/** HARDCODED DATA **/
const KPI_STATS = [
	{ label: 'Total Members', value: '2,847', trend: '+12% this month', up: true, icon: '👤', color: '#2C1654', bg: 'rgba(44,22,84,0.08)' },
	{ label: 'Active Sellers', value: '143', trend: '+5% this month', up: true, icon: '🏪', color: '#D4849A', bg: 'rgba(212,132,154,0.12)' },
	{ label: 'Total Products', value: '1,289', trend: '+8% this month', up: true, icon: '💄', color: '#C9A680', bg: 'rgba(201,166,128,0.12)' },
	{ label: 'Total Orders', value: '4,521', trend: '+15% this month', up: true, icon: '📦', color: '#4A9B6F', bg: 'rgba(74,155,111,0.12)' },
	{ label: 'Monthly Revenue', value: '$48,320', trend: '+23% vs last month', up: true, icon: '💰', color: '#E8A84A', bg: 'rgba(232,168,74,0.12)' },
	{ label: 'Pending Approvals', value: '12', trend: '5 sellers · 7 products', up: false, icon: '⏳', color: '#C0504A', bg: 'rgba(192,80,74,0.10)' },
];

const RECENT_ORDERS = [
	{ id: 'ORD-2026001', customer: 'Sarah Kim', items: 3, total: '$128.50', date: '27 Mar 2026', status: 'PENDING' },
	{ id: 'ORD-2026002', customer: 'Emma Liu', items: 1, total: '$45.00', date: '27 Mar 2026', status: 'CONFIRMED' },
	{ id: 'ORD-2026003', customer: 'Mia Romano', items: 5, total: '$289.90', date: '26 Mar 2026', status: 'DELIVERED' },
	{ id: 'ORD-2026004', customer: 'Julia Stone', items: 2, total: '$76.20', date: '26 Mar 2026', status: 'CONFIRMED' },
	{ id: 'ORD-2026005', customer: 'Ana Bloom', items: 4, total: '$195.00', date: '25 Mar 2026', status: 'CANCELLED' },
];

const TOP_SELLERS = [
	{ rank: 1, name: 'Luna Beauty Studio', products: 89, revenue: '$12,450' },
	{ rank: 2, name: 'Pure Glow Co.', products: 64, revenue: '$9,820' },
	{ rank: 3, name: 'Velvet Cosmetics', products: 52, revenue: '$8,340' },
	{ rank: 4, name: 'Rose & Pearl', products: 41, revenue: '$6,790' },
	{ rank: 5, name: 'Bloom Skincare', products: 35, revenue: '$5,230' },
];

const QUICK_ALERTS = [
	{ label: 'Pending Seller Approvals', count: 5, link: '/_admin/brands', color: '#E8A84A', bg: 'rgba(232,168,74,0.1)' },
	{ label: 'Products Awaiting Review', count: 7, link: '/_admin/products', color: '#C0504A', bg: 'rgba(192,80,74,0.08)' },
	{ label: 'Unanswered Inquiries', count: 3, link: '/_admin/cs/inquiry', color: '#2C1654', bg: 'rgba(44,22,84,0.08)' },
	{ label: 'Flagged Community Posts', count: 2, link: '/_admin/community', color: '#ab47bc', bg: 'rgba(171,71,188,0.1)' },
];

const getOrderStatusClass = (status: string) => {
	switch (status) {
		case 'PENDING': return 'warning';
		case 'CONFIRMED': return 'success';
		case 'DELIVERED': return 'delivered';
		case 'CANCELLED': return 'error';
		default: return 'success';
	}
};

const AdminDashboard: NextPage = (props: any) => {
	const revenueCanvasRef = useRef<HTMLCanvasElement>(null);
	const categoryCanvasRef = useRef<HTMLCanvasElement>(null);
	const revenueChartRef = useRef<ChartType | null>(null);
	const categoryChartRef = useRef<ChartType | null>(null);

	/** REVENUE CHART **/
	useEffect(() => {
		if (!revenueCanvasRef.current) return;

		let cancelled = false;

		import('chart.js').then(({ Chart, CategoryScale, LinearScale, PointElement, LineElement, LineController, ArcElement, Filler, Tooltip, Legend }) => {
			if (cancelled || !revenueCanvasRef.current) return;
			Chart.register(CategoryScale, LinearScale, PointElement, LineElement, LineController, ArcElement, Filler, Tooltip, Legend);
			if (revenueChartRef.current) revenueChartRef.current.destroy();

			revenueChartRef.current = new Chart(revenueCanvasRef.current, {
			type: 'line',
			data: {
				labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
				datasets: [
					{
						label: 'Revenue ($)',
						data: [28500, 32100, 35800, 41200, 44900, 48320],
						borderColor: '#2C1654',
						backgroundColor: 'rgba(44,22,84,0.07)',
						borderWidth: 2.5,
						pointBackgroundColor: '#2C1654',
						pointBorderColor: '#fff',
						pointBorderWidth: 2,
						pointRadius: 5,
						tension: 0.4,
						fill: true,
					},
				],
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: { display: false },
					tooltip: {
						callbacks: {
							label: (ctx) => ` $${ctx.parsed.y.toLocaleString()}`,
						},
					},
				},
				scales: {
					x: { grid: { display: false }, ticks: { font: { family: 'Poppins', size: 12 } } },
					y: {
						grid: { color: 'rgba(0,0,0,0.04)' },
						ticks: {
							callback: (val) => `$${Number(val) / 1000}k`,
							font: { family: 'Poppins', size: 12 },
						},
					},
				},
				},
			});
		});

		return () => {
			cancelled = true;
			revenueChartRef.current?.destroy();
		};
	}, []);

	/** CATEGORY CHART **/
	useEffect(() => {
		if (!categoryCanvasRef.current) return;

		let cancelled = false;

		import('chart.js').then(({ Chart, CategoryScale, LinearScale, ArcElement, DoughnutController, Tooltip, Legend }) => {
			if (cancelled || !categoryCanvasRef.current) return;
			Chart.register(CategoryScale, LinearScale, ArcElement, DoughnutController, Tooltip, Legend);
			if (categoryChartRef.current) categoryChartRef.current.destroy();

			categoryChartRef.current = new Chart(categoryCanvasRef.current, {
				type: 'doughnut',
				data: {
					labels: ['Skincare', 'Makeup', 'Fragrance', 'Haircare', 'Body Care'],
					datasets: [
						{
							data: [38, 24, 16, 12, 10],
							backgroundColor: ['#2C1654', '#D4849A', '#C9A680', '#4A9B6F', '#E8A84A'],
							borderWidth: 0,
							hoverOffset: 8,
						},
					],
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					cutout: '68%',
					plugins: {
						legend: {
							position: 'bottom',
							labels: {
								boxWidth: 10,
								padding: 14,
								font: { family: 'Poppins', size: 12 },
							},
						},
						tooltip: {
							callbacks: {
								label: (ctx) => ` ${ctx.label}: ${ctx.parsed}%`,
							},
						},
					},
				},
			});
		});

		return () => {
			cancelled = true;
			categoryChartRef.current?.destroy();
		};
	}, []);

	return (
		<Box component={'div'} className={'content dashboard'}>

			{/* ── HEADER ── */}
			<Stack
				direction={'row'}
				justifyContent={'space-between'}
				alignItems={'center'}
				sx={{ mb: '32px' }}
			>
				<Box component={'div'}>
					<Typography className={'tit'} sx={{ fontSize: '26px !important', mb: '6px' }}>
						Welcome back, Admin
					</Typography>
					<Typography variant={'subtitle1'} sx={{ color: '#8A8A9A' }}>
						Here&apos;s what&apos;s happening with your store — 27 Mar 2026
					</Typography>
				</Box>
				<Box component={'div'} className={'db-brand-badge'}>
					<Typography variant={'subtitle1'} sx={{ fontWeight: 600, color: '#2C1654' }}>
						Korvera Beauty
					</Typography>
					<Typography variant={'body2'} sx={{ color: '#8A8A9A', textAlign: 'right' }}>
						Admin Control Panel
					</Typography>
				</Box>
			</Stack>

			{/* ── KPI CARDS ── */}
			<Box component={'div'} className={'kpi-grid'} sx={{ mb: '28px', gridTemplateColumns: 'repeat(6, 1fr)' }}>
				{KPI_STATS.map((stat, i) => (
					<Box component={'div'} key={i} className={'kpi-card'}>
						<Box component={'div'} className={'kpi-icon-wrap'} sx={{ background: stat.bg }}>
							<span className={'kpi-emoji'}>{stat.icon}</span>
						</Box>
						<Box component={'div'} className={'kpi-info'}>
							<Typography className={'kpi-label'}>{stat.label}</Typography>
							<Typography className={'kpi-value'}>{stat.value}</Typography>
							<Typography className={stat.up ? 'kpi-trend up-txt' : 'kpi-trend warn-txt'}>
								{stat.trend}
							</Typography>
						</Box>
					</Box>
				))}
			</Box>

			{/* ── CHARTS ROW ── */}
			<Box component={'div'} className={'chart-grid'} sx={{ mb: '28px' }}>
				<Box component={'div'} className={'chart-card'}>
					<Typography className={'chart-section-title'}>Revenue Trend</Typography>
					<Typography variant={'body2'} sx={{ color: '#8A8A9A', mb: '20px' }}>
						Last 6 months performance
					</Typography>
					<Box component={'div'} className={'chart-canvas-wrap'}>
						<canvas ref={revenueCanvasRef} />
					</Box>
				</Box>
				<Box component={'div'} className={'chart-card'}>
					<Typography className={'chart-section-title'}>Sales by Category</Typography>
					<Typography variant={'body2'} sx={{ color: '#8A8A9A', mb: '20px' }}>
						Product category breakdown
					</Typography>
					<Box component={'div'} className={'chart-canvas-wrap'}>
						<canvas ref={categoryCanvasRef} />
					</Box>
				</Box>
			</Box>

			{/* ── BOTTOM ROW ── */}
			<Box component={'div'} className={'bottom-grid'}>

				{/* Recent Orders */}
				<Box component={'div'} className={'table-wrap db-table-card'}>
					<Stack
						direction={'row'}
						justifyContent={'space-between'}
						alignItems={'center'}
						sx={{ px: '24px', py: '18px' }}
					>
						<Typography className={'chart-section-title'} sx={{ mb: '0 !important' }}>
							Recent Orders
						</Typography>
						<Typography
							component={'a'}
							href={'/_admin/orders'}
							variant={'subtitle1'}
							sx={{
								color: '#2C1654',
								fontWeight: 600,
								cursor: 'pointer',
								textDecoration: 'none',
								fontSize: '13px',
								'&:hover': { textDecoration: 'underline' },
							}}
						>
							View All →
						</Typography>
					</Stack>
					<Divider />
					<Box component={'div'} sx={{ px: '24px' }}>
						{RECENT_ORDERS.map((order) => (
							<Stack
								key={order.id}
								direction={'row'}
								alignItems={'center'}
								justifyContent={'space-between'}
								sx={{ py: '13px', borderBottom: '1px solid #F0EBE8' }}
							>
								<Stack direction={'row'} alignItems={'center'} spacing={1.5}>
									<Avatar src={'/img/profile/defaultUser.svg'} sx={{ width: 36, height: 36 }} />
									<Box component={'div'}>
										<Typography
											variant={'subtitle1'}
											sx={{ fontWeight: 600, color: '#1A1A2E', fontSize: '13px', lineHeight: 1.3 }}
										>
											{order.customer}
										</Typography>
										<Typography variant={'body2'} sx={{ color: '#8A8A9A', fontSize: '11px' }}>
											{order.id} &nbsp;·&nbsp; {order.items} items
										</Typography>
									</Box>
								</Stack>
								<Stack alignItems={'flex-end'} spacing={0.5}>
									<Typography
										variant={'subtitle1'}
										sx={{ fontWeight: 700, color: '#1A1A2E', fontSize: '13px' }}
									>
										{order.total}
									</Typography>
									<Box
										component={'span'}
										className={`badge ${getOrderStatusClass(order.status)}`}
										sx={{ fontSize: '10px !important' }}
									>
										{order.status}
									</Box>
								</Stack>
							</Stack>
						))}
					</Box>
				</Box>

				{/* Right column */}
				<Stack spacing={'20px'}>

					{/* Quick Alerts */}
					<Box component={'div'} className={'chart-card'}>
						<Typography className={'chart-section-title'}>Quick Alerts</Typography>
						<Stack spacing={'10px'} sx={{ mt: '4px' }}>
							{QUICK_ALERTS.map((alert, i) => (
								<Stack
									key={i}
									direction={'row'}
									alignItems={'center'}
									justifyContent={'space-between'}
									component={'a'}
									href={alert.link}
									sx={{
										p: '11px 16px',
										borderRadius: '8px',
										background: alert.bg,
										cursor: 'pointer',
										textDecoration: 'none',
										transition: 'transform 0.15s ease',
										'&:hover': { transform: 'translateX(4px)' },
									}}
								>
									<Typography
										variant={'subtitle1'}
										sx={{ color: '#1A1A2E', fontWeight: 500, fontSize: '13px' }}
									>
										{alert.label}
									</Typography>
									<Box
										component={'span'}
										sx={{
											minWidth: '26px',
											height: '26px',
											px: '6px',
											borderRadius: '20px',
											background: alert.color,
											color: '#fff',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											fontSize: '12px',
											fontWeight: 700,
											fontFamily: 'Poppins',
										}}
									>
										{alert.count}
									</Box>
								</Stack>
							))}
						</Stack>
					</Box>

					{/* Top Sellers */}
					<Box component={'div'} className={'chart-card'}>
						<Typography className={'chart-section-title'}>Top Sellers</Typography>
						<Stack spacing={'12px'} sx={{ mt: '4px' }}>
							{TOP_SELLERS.map((seller) => (
								<Stack key={seller.rank} direction={'row'} alignItems={'center'} spacing={1.5}>
									<Box
										component={'span'}
										sx={{
											width: '22px',
											height: '22px',
											borderRadius: '50%',
											background: seller.rank <= 3 ? '#2C1654' : '#EAE0E8',
											color: seller.rank <= 3 ? '#fff' : '#8A8A9A',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											fontSize: '11px',
											fontWeight: 700,
											fontFamily: 'Poppins',
											flexShrink: 0,
										}}
									>
										{seller.rank}
									</Box>
									<Avatar
										src={'/img/profile/defaultUser.svg'}
										sx={{ width: 30, height: 30, flexShrink: 0 }}
									/>
									<Box component={'div'} sx={{ flex: 1, minWidth: 0 }}>
										<Typography
											variant={'subtitle1'}
											sx={{ fontWeight: 600, color: '#1A1A2E', fontSize: '13px', lineHeight: 1.2 }}
											noWrap
										>
											{seller.name}
										</Typography>
										<Typography variant={'body2'} sx={{ color: '#8A8A9A', fontSize: '11px' }}>
											{seller.products} products
										</Typography>
									</Box>
									<Typography
										variant={'subtitle1'}
										sx={{ fontWeight: 700, color: '#2C1654', fontSize: '13px', flexShrink: 0 }}
									>
										{seller.revenue}
									</Typography>
								</Stack>
							))}
						</Stack>
					</Box>

				</Stack>
			</Box>

		</Box>
	);
};

export default withAdminLayout(AdminDashboard);
