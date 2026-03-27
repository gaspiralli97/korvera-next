import React, { useEffect, useRef } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, Typography } from '@mui/material';
import type { Chart as ChartType } from 'chart.js';

const MONTHS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];

const KPI_STATS = [
	{ label: 'Total Revenue (YTD)', value: '$284,190', trend: '+18% vs last year', icon: '💰', bg: 'rgba(44,22,84,0.08)' },
	{ label: 'Total Orders (YTD)', value: '12,840', trend: '+22% vs last year', icon: '📦', bg: 'rgba(74,155,111,0.12)' },
	{ label: 'Avg Order Value', value: '$48.30', trend: '+4% this month', icon: '🛒', bg: 'rgba(201,166,128,0.12)' },
	{ label: 'New Members (30d)', value: '312', trend: '+9% this month', icon: '👤', bg: 'rgba(212,132,154,0.12)' },
];

const AdminAnalytics: NextPage = (props: any) => {
	const revenueRef = useRef<HTMLCanvasElement>(null);
	const ordersRef = useRef<HTMLCanvasElement>(null);
	const categoryRef = useRef<HTMLCanvasElement>(null);
	const topProductsRef = useRef<HTMLCanvasElement>(null);
	const membersRef = useRef<HTMLCanvasElement>(null);
	const avgOrderRef = useRef<HTMLCanvasElement>(null);

	const revenueChart = useRef<ChartType | null>(null);
	const ordersChart = useRef<ChartType | null>(null);
	const categoryChart = useRef<ChartType | null>(null);
	const topProductsChart = useRef<ChartType | null>(null);
	const membersChart = useRef<ChartType | null>(null);
	const avgOrderChart = useRef<ChartType | null>(null);

	/** Revenue line chart **/
	useEffect(() => {
		if (!revenueRef.current) return;
		let cancelled = false;
		import('chart.js').then(({ Chart, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend }) => {
			if (cancelled || !revenueRef.current) return;
			Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);
			if (revenueChart.current) revenueChart.current.destroy();
			revenueChart.current = new Chart(revenueRef.current, {
				type: 'line',
				data: {
					labels: MONTHS,
					datasets: [{
						label: 'Revenue ($)',
						data: [28000, 31000, 24000, 29000, 33000, 38000, 35000, 40000, 42000, 44000, 47000, 48320],
						borderColor: '#2C1654',
						backgroundColor: 'rgba(44,22,84,0.07)',
						borderWidth: 2.5,
						pointBackgroundColor: '#2C1654',
						pointBorderColor: '#fff',
						pointBorderWidth: 2,
						pointRadius: 4,
						tension: 0.4,
						fill: true,
					}],
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: {
						legend: { display: false },
						tooltip: { callbacks: { label: (ctx: any) => ` $${ctx.parsed.y.toLocaleString()}` } },
					},
					scales: {
						x: { grid: { display: false }, ticks: { font: { family: 'Poppins', size: 11 } } },
						y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { callback: (v: any) => `$${Number(v) / 1000}k`, font: { family: 'Poppins', size: 11 } } },
					},
				},
			} as any);
		});
		return () => { cancelled = true; revenueChart.current?.destroy(); revenueChart.current = null; };
	}, []);

	/** Orders bar chart **/
	useEffect(() => {
		if (!ordersRef.current) return;
		let cancelled = false;
		import('chart.js').then(({ Chart, CategoryScale, LinearScale, BarElement, Tooltip, Legend }) => {
			if (cancelled || !ordersRef.current) return;
			Chart.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);
			if (ordersChart.current) ordersChart.current.destroy();
			ordersChart.current = new Chart(ordersRef.current, {
				type: 'bar',
				data: {
					labels: MONTHS,
					datasets: [{
						label: 'Orders',
						data: [820, 910, 740, 880, 960, 1100, 1040, 1190, 1250, 1320, 1410, 1420],
						backgroundColor: 'rgba(212,132,154,0.7)',
						borderColor: '#D4849A',
						borderWidth: 0,
						borderRadius: 4,
					}],
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: { legend: { display: false } },
					scales: {
						x: { grid: { display: false }, ticks: { font: { family: 'Poppins', size: 11 } } },
						y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { family: 'Poppins', size: 11 } } },
					},
				},
			} as any);
		});
		return () => { cancelled = true; ordersChart.current?.destroy(); ordersChart.current = null; };
	}, []);

	/** Category doughnut chart **/
	useEffect(() => {
		if (!categoryRef.current) return;
		let cancelled = false;
		import('chart.js').then(({ Chart, ArcElement, Tooltip, Legend }) => {
			if (cancelled || !categoryRef.current) return;
			Chart.register(ArcElement, Tooltip, Legend);
			if (categoryChart.current) categoryChart.current.destroy();
			categoryChart.current = new Chart(categoryRef.current, {
				type: 'doughnut',
				data: {
					labels: ['Skincare', 'Makeup', 'Fragrance', 'Haircare', 'Body Care'],
					datasets: [{
						data: [38, 24, 16, 12, 10],
						backgroundColor: ['#2C1654', '#D4849A', '#C9A680', '#4A9B6F', '#E8A84A'],
						borderWidth: 0,
						hoverOffset: 8,
					}],
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					cutout: '68%',
					plugins: {
						legend: { position: 'bottom', labels: { boxWidth: 10, padding: 12, font: { family: 'Poppins', size: 11 } } },
						tooltip: { callbacks: { label: (ctx: any) => ` ${ctx.label}: ${ctx.parsed}%` } },
					},
				},
			} as any);
		});
		return () => { cancelled = true; categoryChart.current?.destroy(); categoryChart.current = null; };
	}, []);

	/** Top products horizontal bar **/
	useEffect(() => {
		if (!topProductsRef.current) return;
		let cancelled = false;
		import('chart.js').then(({ Chart, CategoryScale, LinearScale, BarElement, Tooltip, Legend }) => {
			if (cancelled || !topProductsRef.current) return;
			Chart.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);
			if (topProductsChart.current) topProductsChart.current.destroy();
			topProductsChart.current = new Chart(topProductsRef.current, {
				type: 'bar',
				data: {
					labels: ['Glow Serum 30ml', 'Velvet Foundation', 'Night Repair Cream', 'Rose Petal Toner', 'SPF 50 Shield'],
					datasets: [{
						label: 'Revenue ($)',
						data: [14200, 9800, 8700, 7600, 6400],
						backgroundColor: ['#2C1654', '#3D2070', '#D4849A', '#C9A680', '#4A9B6F'],
						borderWidth: 0,
						borderRadius: 4,
					}],
				},
				options: {
					indexAxis: 'y',
					responsive: true,
					maintainAspectRatio: false,
					plugins: {
						legend: { display: false },
						tooltip: { callbacks: { label: (ctx: any) => ` $${ctx.parsed.x.toLocaleString()}` } },
					},
					scales: {
						x: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { callback: (v: any) => `$${Number(v) / 1000}k`, font: { family: 'Poppins', size: 11 } } },
						y: { grid: { display: false }, ticks: { font: { family: 'Poppins', size: 11 } } },
					},
				},
			} as any);
		});
		return () => { cancelled = true; topProductsChart.current?.destroy(); topProductsChart.current = null; };
	}, []);

	/** New members line chart **/
	useEffect(() => {
		if (!membersRef.current) return;
		let cancelled = false;
		import('chart.js').then(({ Chart, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend }) => {
			if (cancelled || !membersRef.current) return;
			Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);
			if (membersChart.current) membersChart.current.destroy();
			membersChart.current = new Chart(membersRef.current, {
				type: 'line',
				data: {
					labels: MONTHS,
					datasets: [{
						label: 'New Members',
						data: [180, 210, 155, 195, 230, 285, 260, 300, 320, 290, 310, 312],
						borderColor: '#4A9B6F',
						backgroundColor: 'rgba(74,155,111,0.07)',
						borderWidth: 2,
						pointBackgroundColor: '#4A9B6F',
						pointRadius: 4,
						tension: 0.4,
						fill: true,
					}],
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: { legend: { display: false } },
					scales: {
						x: { grid: { display: false }, ticks: { font: { family: 'Poppins', size: 11 } } },
						y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { family: 'Poppins', size: 11 } } },
					},
				},
			} as any);
		});
		return () => { cancelled = true; membersChart.current?.destroy(); membersChart.current = null; };
	}, []);

	/** Avg order value line chart **/
	useEffect(() => {
		if (!avgOrderRef.current) return;
		let cancelled = false;
		import('chart.js').then(({ Chart, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend }) => {
			if (cancelled || !avgOrderRef.current) return;
			Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);
			if (avgOrderChart.current) avgOrderChart.current.destroy();
			avgOrderChart.current = new Chart(avgOrderRef.current, {
				type: 'line',
				data: {
					labels: MONTHS,
					datasets: [{
						label: 'Avg Order ($)',
						data: [42, 44, 40, 43, 46, 48, 46, 49, 50, 48, 51, 48],
						borderColor: '#E8A84A',
						backgroundColor: 'rgba(232,168,74,0.07)',
						borderWidth: 2,
						pointBackgroundColor: '#E8A84A',
						pointRadius: 4,
						tension: 0.4,
						fill: true,
					}],
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: {
						legend: { display: false },
						tooltip: { callbacks: { label: (ctx: any) => ` $${ctx.parsed.y}` } },
					},
					scales: {
						x: { grid: { display: false }, ticks: { font: { family: 'Poppins', size: 11 } } },
						y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { callback: (v: any) => `$${v}`, font: { family: 'Poppins', size: 11 } } },
					},
				},
			} as any);
		});
		return () => { cancelled = true; avgOrderChart.current?.destroy(); avgOrderChart.current = null; };
	}, []);

	return (
		<Box component={'div'} className={'content dashboard'}>
			<Typography className={'tit'} sx={{ fontSize: '26px !important', mb: '6px' }}>
				Analytics
			</Typography>
			<Typography variant={'subtitle1'} sx={{ color: '#8A8A9A', mb: '32px' }}>
				Full performance overview — Apr 2025 to Mar 2026
			</Typography>

			{/* KPI */}
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

			{/* Row 1: Revenue + Orders */}
			<Box component={'div'} className={'chart-grid'} sx={{ mb: '20px' }}>
				<Box component={'div'} className={'chart-card'}>
					<Typography className={'chart-section-title'}>Monthly Revenue</Typography>
					<Typography variant={'body2'} sx={{ color: '#8A8A9A', mb: '16px' }}>Apr 2025 – Mar 2026</Typography>
					<Box component={'div'} className={'chart-canvas-wrap'}>
						<canvas ref={revenueRef} />
					</Box>
				</Box>
				<Box component={'div'} className={'chart-card'}>
					<Typography className={'chart-section-title'}>Monthly Orders</Typography>
					<Typography variant={'body2'} sx={{ color: '#8A8A9A', mb: '16px' }}>Order volume per month</Typography>
					<Box component={'div'} className={'chart-canvas-wrap'}>
						<canvas ref={ordersRef} />
					</Box>
				</Box>
			</Box>

			{/* Row 2: Category + Top Products */}
			<Box component={'div'} className={'chart-grid'} sx={{ mb: '20px', gridTemplateColumns: '1fr 1.6fr' }}>
				<Box component={'div'} className={'chart-card'}>
					<Typography className={'chart-section-title'}>Sales by Category</Typography>
					<Typography variant={'body2'} sx={{ color: '#8A8A9A', mb: '16px' }}>Revenue share per category</Typography>
					<Box component={'div'} className={'chart-canvas-wrap'}>
						<canvas ref={categoryRef} />
					</Box>
				</Box>
				<Box component={'div'} className={'chart-card'}>
					<Typography className={'chart-section-title'}>Top 5 Products by Revenue</Typography>
					<Typography variant={'body2'} sx={{ color: '#8A8A9A', mb: '16px' }}>Best performing products</Typography>
					<Box component={'div'} className={'chart-canvas-wrap'}>
						<canvas ref={topProductsRef} />
					</Box>
				</Box>
			</Box>

			{/* Row 3: New Members + Avg Order */}
			<Box component={'div'} className={'chart-grid'}>
				<Box component={'div'} className={'chart-card'}>
					<Typography className={'chart-section-title'}>New Members</Typography>
					<Typography variant={'body2'} sx={{ color: '#8A8A9A', mb: '16px' }}>Monthly new registrations</Typography>
					<Box component={'div'} className={'chart-canvas-wrap'}>
						<canvas ref={membersRef} />
					</Box>
				</Box>
				<Box component={'div'} className={'chart-card'}>
					<Typography className={'chart-section-title'}>Average Order Value</Typography>
					<Typography variant={'body2'} sx={{ color: '#8A8A9A', mb: '16px' }}>Monthly avg order value ($)</Typography>
					<Box component={'div'} className={'chart-canvas-wrap'}>
						<canvas ref={avgOrderRef} />
					</Box>
				</Box>
			</Box>

		</Box>
	);
};

export default withAdminLayout(AdminAnalytics);
